import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import express, { Application } from 'express';
import Logger from '../utils/logger';
import Db from '../db';
import middlewaresConfig from '../middlewares';
import routesConfig from '../lib/routesConfig';
import unknownRouteConfig from '../responses/error/unkown-routes';
import errorHandlerConfig from '../responses/error/error-handler';

/* App declaration */
const app: Application = express();

/* Setup Db */
Db();

/* Middleware configuration */
middlewaresConfig(app);

/* Route Configuration */
routesConfig();

/* Missing routes Configuration */
app.use(unknownRouteConfig);

/* Global Error Handling Configuration */
app.use(errorHandlerConfig);

/* App initialization */
const { PORT } = process.env;
const httpServer = new http.Server(app);
httpServer.listen(PORT, (): void => {
    Logger('app/index.ts', `App is listening on port ${PORT}`, 'info');
});

export default app;