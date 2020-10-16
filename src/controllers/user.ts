import pool from '../db-config/db-config';
import e, { Request, Response } from 'express'


class UserController {
    public async get(req: Request, res: Response) {
        try {
            const userName = req.params.username
            console.log("user", userName)
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

            console.log("user", user)

            res.status(200).json({
                "user_name": user.user_name,
                "created_at": user.created_at
            });
        } catch (error) {
            res.status(400).send(error)
        }
    }
}

export default UserController;
