import pool from '../db-config/db-config';
import { Request, Response } from 'express'

// To do - implement error codes
class UserController {
    constructor() { }
    public get = async (req: Request, res: Response) => {
        try {
            const userName = req.params.username
            const user: any = this.getAUser(userName)
            res.status(200).json({
                "user_name": user.user_name,
                "created_at": user.created_at
            });
        } catch (error) {
            res.status(400).send(error)
        }
    }

    public put = async (req: Request, res: Response) => {
        try {
            const userName = req.params.username
            await pool.connect().then(client => {
                return client.query('INSERT INTO users (user_name) VALUES ($1)', [userName])
                    .then(() => {
                        client.release()
                    })
                    .catch(err => {
                        client.release()
                        throw err.stack
                    })
            });
            res.status(200).send();
        } catch (error) {
            res.status(400).send(error)
        }
    }

    protected getAUser = async (userName: string) => {
        console.log("input", userName);
        return await pool.connect().then(client => {
            return client.query('SELECT * FROM users WHERE user_name = $1', [userName])
                .then(res => {
                    client.release()
                    // console.log("resp", res)
                    return res.rows[0]
                })
                .catch(err => {
                    client.release()
                    // return err.stack
                    console.log("error", err.stack)
                })
        })
    }
}

export default UserController;
