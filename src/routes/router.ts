import express, { Router } from 'express';
import UserRoutes from './user';


class Routes {
    public router: express.Router
    constructor() {
        this.router = express.Router()
        this.config()
    }
    config() {
        new UserRoutes(this.router)
    }
}

export default new Routes().router