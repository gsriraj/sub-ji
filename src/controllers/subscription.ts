import pool from '../db-config/db-config';
import { Request, Response } from 'express'
import { Subscription } from '../model/models'

// To do - implement error codes
class SubscriptionController {
    public async post(req: Request, res: Response) {
        try {
            const sub: Subscription = req.body
            console.log("data body", sub)
            
        } catch (error) {
            res.status(400).send(error)
        }
    }
    public async get(req: Request, res: Response) {
        try {
            const userName = req.params.username
            const user: any = await pool.connect().then(client => {
                return client.query('SELECT * FROM users WHERE user_name = $1', [userName])
                    .then(res => {
                        client.release()
                        return res.rows[0]
                    })
                    .catch(err => {
                        client.release()
                        throw err.stack
                    })
            })
            res.status(200).json({
                "user_name": user.user_name,
                "created_at": user.created_at
            });
        } catch (error) {
            res.status(400).send(error)
        }
    }

    public async put(req: Request, res: Response) {
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
}

export default SubscriptionController;
