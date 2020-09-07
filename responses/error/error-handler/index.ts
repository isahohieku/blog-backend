import { Request, Response, NextFunction } from 'express';
import Logger from '../../../utils/logger';
import throwError from '../';
import CustomError from '../custom-error';
import httpCodes from '../../../constants/http-status-codes';
import responseCodes from '../../../constants/response-codes';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): Response => {
    if (err instanceof CustomError) {
        console.log(err);
        Logger('error.response.ts', err.message, 'error'); // For debugging
        const message = (typeof err === 'string') ? err : err.message;
        return throwError(res, responseCodes.NOT_FOUND, message, httpCodes.NOT_FOUND);
    } else {
        Logger('error.response.ts', 'uncaught exception', 'error'); // For debugging
        return throwError(res);
    }
};

export default errorHandler;
