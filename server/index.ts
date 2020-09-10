import dotenv from 'dotenv';
dotenv.config();
import express, { Application } from "express";
import { createServer, Server as HTTPServer } from "http";
import Db from '../db';
import swaggerUi from 'swagger-ui-express';
import Logger from '../utils/logger';
import middlewares from '../middlewares';
import routes from '../lib/routesConfig';
import unknownRouteConfig from '../responses/error/unkown-routes';
import errorHandlerConfig from '../responses/error/error-handler';
import * as swaggerDocument from '../doc/swagger.json';

export default class Server {
    private httpServer: HTTPServer;
    public app: Application;

    public constructor() {
        this.setupDb();
        this.initializeApp();
        this.configureMiddlewares();
        this.handleSwaggerUI();
        this.configureRoutes();
        this.handleMissingRoutes();
        this.handleErrorsGlobally();
    }

    private initializeApp(): void {
        this.app = express();
        this.httpServer = createServer(this.app);
    }

    private configureMiddlewares(): void {
        middlewares(this.app);
    }

    private configureRoutes(): void {
        routes(this.app);
    }

    private handleMissingRoutes(): void {
        this.app.use(unknownRouteConfig);
    }

    private handleErrorsGlobally(): void {
        this.app.use(errorHandlerConfig);
    }

    private handleSwaggerUI(): void {
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }

    private setupDb(): void {
        /* Setup Db */
        Db();
    }

    public listen(): void {
        /* App initialization */
        const { PORT } = process.env;
        this.httpServer.listen(PORT, (): void => {
            Logger('server/index.ts', `App is listening on port ${PORT}`, 'info');
        });
    }
}