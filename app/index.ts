import dotenv from 'dotenv';
dotenv.config();
import Db from '../db';
import App from '../server';

/* App declaration */
const app = new App();

/* Setup Db */
Db();

/* App initialization */
app.listen();

export default app;