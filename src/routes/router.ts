import express, { Router } from 'express';
import UserRoutes from './user';
import SubscriptionRoutes from './subscription';


class Routes {
    public router: express.Router
    constructor() {
        this.router = express.Router()
        this.config()
    }
    config() {
        new UserRoutes(this.router)
        new SubscriptionRoutes(this.router)
    }
}

export default new Routes().router