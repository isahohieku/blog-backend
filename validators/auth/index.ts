import * as Joi from 'joi';
import { RouteHandler } from '../../lib/route';
import { NextFunction, Request, Response } from 'express';
import CustomError from '../../responses/error/custom-error';

import httpCodes from '../../constants/http-status-codes';
import responseCodes from '../../constants/response-codes';
import responseMessages from '../../constants/response-messages';
import Logger from '../../utils/logger';
import { pickToken, verifyTok } from '../../utils/auth';

const signupValidator = Joi.object().keys({
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string().required(),
    fullName: Joi.string().required()
});

const loginValidator = Joi.object().keys({
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string().required()
});

const emailVerificationValidator = Joi.object().keys({
    email: Joi.string()
        .email()
        .required(),
    verificationToken: Joi.string().required()
});


const throwError = (next, details): void => {
    const error = new CustomError(responseCodes.INVALID_PARAMS,
        responseMessages.FORBIDDEN, httpCodes.FORBIDDEN, details);
    Logger('validators/auth.ts', details, 'error');
    next(error);
};

const validateSignup: RouteHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await Joi.validate(req.body, signupValidator);
        next();
    } catch (e) {
        throwError(next, e.details);
    }
};

const validateLogin: RouteHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await Joi.validate(req.body, loginValidator);
        next();
    } catch (e) {
        throwError(next, e.details);
    }
};

const validateEmailVerification: RouteHandler =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await Joi.validate(req.body, emailVerificationValidator);
            next();
        } catch (e) {
            throwError(next, e.details);
        }
    };

const verifyToken: RouteHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = pickToken(req);
        if (!token) {
            throw new CustomError(responseCodes.MISSING_TOKEN, responseMessages.MISSING_TOKEN, 401);
        }

        if (token) {
            verifyTok(req, res, token);
        }
        Logger('auth.service.ts', 'Token verified', 'info');
        next();
    } catch (e) {
        next(e);
    }
};

export {
    validateLogin,
    validateSignup,
    verifyToken,
    validateEmailVerification
};
