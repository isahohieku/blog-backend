import dotenv from 'dotenv';
dotenv.config();
import Logger from '../utils/logger';
import express, { Application } from 'express';
import Db from '../db';
import http from 'http';

/* Declaration */
const app: Application = express();

/* Setup Db */
Db();

/* Express Server Configuration */
const { PORT } = process.env;
const httpServer = new http.Server(app);
httpServer.listen(PORT, (): void => {
    Logger('app/index.ts', `App is listening on port ${PORT}`, 'info');
});

export default app;