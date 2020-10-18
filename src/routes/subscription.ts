
import express, { Router } from 'express';
import SubscriptionController from '../controllers/subscription';

class SubscriptionRoutes {
    public subscriptionController: SubscriptionController

    constructor(public router: Router) {
        this.subscriptionController = new SubscriptionController()
        this.config()
    }

    config() {
        this.router.get('/subscription/:username/:date?', this.subscriptionController.get);
        this.router.post('/subscription/', this.subscriptionController.post);
    }
}

export default SubscriptionRoutes;