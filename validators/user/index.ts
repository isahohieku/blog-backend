import * as Joi from 'joi';
import { RouteHandler } from '../../lib/route';
import { NextFunction, Request, Response } from 'express';
import CustomError from '../../responses/error/custom-error';

import httpCodes from '../../constants/http-status-codes';
import responseCodes from '../../constants/response-codes';
import responseMessages from '../../constants/response-messages';
import Logger from '../../utils/logger';

const createUserValidator = Joi.object().keys({
    fullName: Joi.string().required(),
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string().required(),
    roles: Joi.array().required().min(1),
    admin: Joi.boolean().optional()
});

const updateUserValidator = Joi.object().keys({
    id: Joi.string().required(),
    fullName: Joi.string().optional(),
    occupation: Joi.string().optional(),
    stateOfOrigin: Joi.string().optional(),
    gender: Joi.string().optional(),
    dob: Joi.string().optional(),
    address: Joi.string().optional(),
    password: Joi.string().optional(),
    status: Joi.string().optional(),
    avatar: Joi.string().optional(),
    isEmailVerified: Joi.boolean().optional(),
    adminType: Joi.string().optional()
});

const forgetPasswordValidator = Joi.object().keys({
    email: Joi.string()
        .email()
        .required()
});

const resetPasswordValidator = Joi.object().keys({
    email: Joi.string()
        .email()
        .required(),
    token: Joi.string().required(),
    password: Joi.string().min(6).required()
});

const throwError = (next, details): void => {
    const error = new CustomError(responseCodes.INVALID_PARAMS,
        responseMessages.FORBIDDEN, httpCodes.FORBIDDEN, details);
    Logger('validators/auth.ts', details, 'error');
    next(error);
};

const validateCreateUser: RouteHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await Joi.validate(req.body, createUserValidator);
        next();
    } catch (e) {
        throwError(next, e.details);
    }
};

const validateUpdateUser: RouteHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await Joi.validate(req.body, updateUserValidator);
        next();
    } catch (e) {
        throwError(next, e.details);
    }
};

const validateForgotPassword: RouteHandler =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await Joi.validate(req.body, forgetPasswordValidator);
            next();
        } catch (e) {
            throwError(next, e.details);
        }
    };

const validateResetPassword: RouteHandler =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await Joi.validate(req.body, resetPasswordValidator);
            next();
        } catch (e) {
            throwError(next, e.details);
        }
    };

export {
    validateCreateUser,
    validateUpdateUser,
    validateForgotPassword,
    validateResetPassword
};