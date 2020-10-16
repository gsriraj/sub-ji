
import express, { Router } from 'express';
import UserController from '../controllers/user';

const router = Router();
const userController = new UserController();

class UserRoutes {
    public userController: UserController

    constructor(public router: Router) {
        this.userController = new UserController()
        this.config()
    }

    config() {
        this.router.get('/user/:username', userController.get);
    }
}

export default UserRoutes;