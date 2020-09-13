import { config } from 'dotenv';
config({ path: __dirname + '/../.env' });
import Logger from '../utils/logger';
import { connect, connection, ConnectionOptions } from 'mongoose';

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const DB_URI = process.env.DB_URI;
const ENV = process.env.NODE_ENV;
const nextRetry = 5000;
const options: ConnectionOptions = { useNewUrlParser: true };

const connectionUrl = {
    development: `${DB_URI}`,
    production: `mongodb://${dbUser}:${dbPassword}@${DB_URI}`
};

const connectDb = (): void => {
    connect(connectionUrl[ENV], options).catch(function (err: any): void {
        Logger('error', err.message);
        process.exit(1);
    });
};

// on connection
connection.on('connected', (): void => {
    Logger('database.ts', `Mongoose connected on ${DB_URI}`, 'info');
});

// on error
connection.on('error', (err: any): void => {
    Logger('database.ts', `Mongoose connection error: ${err}`, 'error');
    setTimeout(connectDb, nextRetry);
});

// on disconnect
connection.on('disconnected', (): void => {
    Logger('database.ts', 'Mongoose disconnected.', 'info');
});

connection.once('open', (): void => {
    Logger('database.ts', 'Mongo running!', 'info');
});

export default connectDb;