import express, { Application } from "express";
import { createServer, Server as HTTPServer } from "http";
import swaggerUi from 'swagger-ui-express';
import Logger from '../utils/logger';
import middlewares from '../middlewares';
import routes from '../lib/routesConfig';
import unknownRouteConfig from '../responses/error/unkown-routes';
import errorHandlerConfig from '../responses/error/error-handler';
import * as swaggerDocument from '../doc/swagger.json';

export default class Server {
    private httpServer: HTTPServer;
    private app: Application;

    public constructor() {
        this.initialize();
        this.configureMiddlewares();
        this.handleSwaggerUI();
        this.configureRoutes();
        this.handleMissingRoutes();
        this.handleErrorsGlobally();
    }

    private initialize(): void {
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

    public listen(): void {
        /* App initialization */
        const { PORT } = process.env;
        this.httpServer.listen(PORT, (): void => {
            Logger('server/index.ts', `App is listening on port ${PORT}`, 'info');
        });
    }
}