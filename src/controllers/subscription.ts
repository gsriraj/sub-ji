import pool from '../db-config/db-config';
import { Request, Response } from 'express'
import { Subscription, CompareResponse } from '../model/models'
import UserController from './user';
import { Conf } from '../utils/config';
import Axios from 'axios';
import moment from 'moment';
class SubscriptionController extends UserController {
    constructor() {
        super();
    }

    public post = async (req: Request, res: Response) => {
        try {
            const sub: Subscription = req.body;
            const user = await this.getAUser(sub.user_name)
            if (user == undefined || null) {
                res.status(404).json({
                    "Error": "User does not exist"
                })
            }
            const userSub: any = await this.getActiveSubDetail(user.user_id)
            let paymentType = 'CREDIT';
            const plan = await this.getPlanDetails(sub.plan_id);
            if (plan == undefined || null) {
                res.status(404).json({
                    "Error": "Plan does not exist"
                })
            }
            if (userSub == undefined || null) {
                await this.makePayment(paymentType, user.user_name, Number(plan.cost)).then(async (payment: any) => {
                    if (payment.status == "SUCCESS") {
                        await this.createASub(user.user_id, plan.id, sub.start_date).then(() => {
                            res.json({
                                "status": "SUCCESS",
                                "amount": -1 * Number(plan.cost)
                            })
                        })
                    } else {
                        res.status(400).json({
                            "status": "FAILURE",
                            "amount": Number(plan.cost)
                        })
                    }
                })

            } else {
                if (userSub.plan_id == sub.plan_id) {
                    res.status(200).json({
                        "Message": "User already in this plan!"
                    })
                } else {
                    const compareResp: CompareResponse = await this.comparePlan(userSub.cost, sub)
                    if (compareResp.upgradeToHigherPlan) paymentType = 'DEBIT';

                    await this.makePayment(paymentType, user.user_name, compareResp.cost).then(async (payment: any) => {
                        if (payment && payment.status == "SUCCESS") {
                            await this.updateActivSubToFalse(userSub.sub_id).then(async () => {
                                await this.createASub(user.user_id, plan.id, sub.start_date).then(() => {
                                    res.json({
                                        "status": "SUCCESS",
                                        "amount": paymentType == 'DEBIT' ? -1 * compareResp.cost : compareResp.cost
                                    })
                                })
                            })
                        } else {
                            res.status(400).json({
                                "status": "FAILURE",
                                "amount": Number(plan.cost)
                            })
                        }
                    })
                }
            }
        } catch (error) {
            res.status(400).send(error)
            console.log("error", error)
        }
    }

    public get = async (req: Request, res: Response) => {
        try {
            const userName: string = req.params.username
            const date = req.params.date ? moment(req.params.date) : undefined
            const user = await this.getAUser(userName)
            if (user == null || undefined) {
                res.status(404).send("User not found.");
            } else {
                let subs: any = await this.getSubDetails(user.user_id)
                if (subs.length == 0) {
                    res.status(404).send("User does not have a subscription.");
                } else {
                    if (date == null || undefined) {
                        subs = await subs.map((sub: any) => {
                            let day = sub.start_date
                            let day_start = moment(day).format("YYYY-MM-DD")
                            let day_end = moment(day).add(parseInt(sub.validity), 'd').format("YYYY-MM-DD");
                            return {
                                "plan_id": sub.plan_id,
                                "start_date": day_start,
                                "valid_till": sub.validity == "Infinite" ? "Infinite" : day_end
                            }
                        })
                        res.status(200).json(subs);

                    } else {
                        let lowestDaysLeft: any = 365
                        new Promise(async (resolve, reject) => {
                            let val: any = []
                            await subs.map((sub: any) => {
                                let dateTwo = moment(sub.start_date).add(sub.validity == "Infinite" ? 365 : parseInt(sub.validity), 'd')
                                if (date.isSameOrAfter(moment(sub.start_date)) && date.isBefore(dateTwo)) {
                                    let daysLeft = sub.validity == "Infinite" ? 365 : moment(sub.start_date).add(parseInt(sub.validity), 'd').diff(date, 'days')
                                    if (daysLeft > 0 && daysLeft <= lowestDaysLeft) lowestDaysLeft = daysLeft
                                    val.push({
                                        "plan_id": sub.plan_id,
                                        "days_left": sub.plan_id == "FREE" ? "Infinite" : daysLeft
                                    })

                                } else return
                            });
                            resolve(val);
                        }).then((subs: any) => {
                            if (subs.length == 0) {
                                res.status(403).send("User did not have any subscriptions during this period")
                            }
                            subs.map((sub: any) => {
                                if (sub.days_left == lowestDaysLeft) {
                                    res.status(200).json(sub)
                                }
                            });
                        })

                    }
                }
            }
        } catch (error) {
            res.status(400).send(error)
            console.log("error", error)
        }
    }

    private comparePlan = async (currentPlanCost: number, newSub: Subscription) => {
        const newPlan = await this.getPlanDetails(newSub.plan_id);
        let amountToPay: number
        if (newPlan.cost > currentPlanCost) {
            amountToPay = newPlan.cost - currentPlanCost
            return { upgradeToHigherPlan: true, cost: amountToPay }
        }
        amountToPay = currentPlanCost - newPlan.cost
        return { upgradeToHigherPlan: false, cost: amountToPay }
    }

    private updateActivSubToFalse = async (currentSubID: number) => {
        return await pool.connect().then(client => {
            return client.query('UPDATE subscriptions SET active = false WHERE sub_id = ($1)', [currentSubID])
                .then((res) => {
                    client.release()
                    return res.rows[0]
                })
                .catch(err => {
                    client.release()
                    console.log("error", err.stack)
                })
        });
    }

    private getActiveSubDetail = async (userId: number) => {
        return await pool.connect().then(client => {
            return client.query('SELECT s.sub_id, s.user_id, s.start_date, s.active, p.id, p.plan_id, p.validity, p.cost FROM subscriptions s LEFT JOIN plans p ON s.plan_id = p.id WHERE s.user_id = ($1) AND s.active', [userId])
                .then((res) => {
                    client.release()
                    return res.rows[0]
                })
                .catch(err => {
                    client.release()
                    console.log("error", err.stack)
                })
        });
    }

    private getSubDetails = async (userId: number) => {
        return await pool.connect().then(client => {
            return client.query('SELECT s.sub_id, s.user_id, s.start_date, s.active, p.id, p.plan_id, p.validity, p.cost FROM subscriptions s LEFT JOIN plans p ON s.plan_id = p.id WHERE s.user_id = ($1)', [userId])
                .then((res) => {
                    client.release()
                    return res.rows
                })
                .catch(err => {
                    client.release()
                    console.log("error", err.stack)
                })
        });
    }


    private getPlanDetails = async (plan_id: string) => {
        return await pool.connect().then(client => {
            return client.query('SELECT * FROM plans WHERE plan_id = ($1)', [plan_id])
                .then((res) => {
                    client.release()
                    return res.rows[0]
                })
                .catch(err => {
                    client.release()
                    console.log("error", err.stack)
                })
        });
    }

    private async createASub(user_id: number, plan_id: number, start_date: string) {
        await pool.connect().then(client => {
            return client.query('INSERT INTO subscriptions (user_id, plan_id, start_date, active) VALUES ($1, $2, $3, $4)', [user_id, plan_id, start_date, true])
                .then(() => {
                    client.release()
                })
                .catch(err => {
                    client.release()
                    throw err.stack
                })
        });
    }

    private makePayment = async (paymentType: string, user_name: string, cost: number) => {
        const data = {
            "user_name": user_name,
            "payment_type": paymentType,
            "amount": cost
        }

        return await Axios
            .post(Conf.PAYMENT_API, data)
            .then(res => {
                return res.data
            })
            .catch(error => {
                console.error(error)
            })

    }

}

export default SubscriptionController;
