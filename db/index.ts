import { config } from 'dotenv';
config({ path: __dirname + '/../.env' });
import { logger } from '../utils/logger';
import mongoose, { ConnectionOptions } from 'mongoose';

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const DB_URI = process.env.DB_URI;
const ENV = process.env.NODE_ENV
const nextRetry = 5000;
const options: ConnectionOptions = { useNewUrlParser: true };

const connectionUrl: any = {
    development: `${DB_URI}`,
    production: `mongodb://${dbUser}:${dbPassword}@${DB_URI}`
}

const connectDb = (): void => {
    mongoose.connect(connectionUrl[ENV], options).catch(function (err: any): void {
        logger('error', err.message);
        process.exit(1);
    });
}

// on connection
mongoose.connection.on('connected', function (): void {
    logger('database.ts', `Mongoose connected on ${DB_URI}`, 'info');
});

// on error
mongoose.connection.on('error', async function (err: any): Promise<void> {
    logger('database.ts', `Mongoose connection error: ${err}`, 'error');
    setTimeout(connectDb, nextRetry);
});

// on disconnect
mongoose.connection.on('disconnected', function (): void {
    logger('database.ts', 'Mongoose disconnected.', 'info');
});

mongoose.connection.once('open', function (): void {
    logger('database.ts', 'Mongo running!', 'info');
});

export default connectDb;