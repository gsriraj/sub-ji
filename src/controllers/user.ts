import pool from '../db-config/db-config';
import { Request, Response } from 'express'
class UserController {
    constructor() { }
    public get = async (req: Request, res: Response) => {
        try {
            const userName = req.params.username
            await this.getAUser(userName).then((user) => {
                if (user == undefined || null) {
                    res.status(404).send("User not found.");
                } else {
                    res.status(200).json({
                        "user_name": user.user_name,
                        "created_at": user.created_at
                    });
                }
            }).catch(err => { throw err })

        } catch (error) {
            res.status(400).send(error)
        }
    }

    public put = async (req: Request, res: Response) => {
        try {
            const userName = req.params.username

            await this.getAUser(userName).then(async (user) => {
                if (user == undefined || null) {
                    await pool.connect().then(client => {
                        return client.query('INSERT INTO users (user_name) VALUES ($1)', [userName])
                            .then(() => {
                                client.release()
                                res.status(200).send();
                            })
                            .catch(err => {
                                client.release()
                                throw err.stack
                            })
                    })
                } else {
                    res.status(409).send("User already exists.")
                }
            })
        } catch (error) {
            res.status(400).send(error)
        }
    }

    protected getAUser = async (userName: string) => {
        return await pool.connect().then(client => {
            return client.query('SELECT * FROM users WHERE user_name = $1', [userName])
                .then(res => {
                    client.release()
                    return res.rows[0]
                })
                .catch(err => {
                    client.release()
                    console.log("error", err.stack)
                })
        })
    }
}

export default UserController;
