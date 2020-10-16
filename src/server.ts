import express, { Application, Router } from 'express';
import bodyParser from 'body-parser';
import pool from './db-config/db-config';
import routes from './routes/router';

class Server {
    private app: express.Application;
    private route: express.Router;

    constructor() {
        this.app = express();
        this.route = routes;
        this.config();
        this.routerConfig();
        this.dbConnect();
    }

    private config() {
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json({ limit: '1mb' }));
    }

    private dbConnect() {
        pool.connect(function (err: any, client, done) {
            if (err) throw new Error(err);
            console.log('Database connected!');
        });
    }
    private routerConfig() {
        this.app.use('/', this.route);
    }
    public start = (port: number) => {
        return new Promise((resolve, reject) => {
            this.app.listen(port, () => {
                resolve(port);
            }).on('error', (err: Object) => reject(err));
        })
    }
}

export default Server;