import dotenv from 'dotenv';
dotenv.config();
import * as Joi from 'joi';
import { RouteHandler } from '../../lib/route';
import { NextFunction, Request, Response } from 'express';
import CustomError from '../../responses/error/custom-error';

import httpCodes from '../../constants/http-status-codes';
import responseCodes from '../../constants/response-codes';
import responseMessages from '../../constants/response-messages';
import Logger from '../../utils/logger';

const { AVATAR } = process['env'];

const updateUserValidator = Joi.object().keys({
    id: Joi.string().required(),
    fullName: Joi.string().optional(),
    bio: Joi.string().optional(),
    occupation: Joi.string().optional(),
    password: Joi.string().optional(),
    isEmailVerified: Joi.boolean().optional(),
    adminType: Joi.string().optional()
});

const updateUserAvatar = Joi.object().keys({
    [AVATAR]: Joi.any().required()
});

const updateUserPassword = Joi.object().keys({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required()
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

const validateAvatarUpdate: RouteHandler =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await Joi.validate(req.body, updateUserAvatar);
            next();
        } catch (e) {
            throwError(next, e.details);
        }
    };

const validatePasswordUpdate: RouteHandler =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await Joi.validate(req.body, updateUserPassword);
            next();
        } catch (e) {
            throwError(next, e.details);
        }
    };

export {
    validateUpdateUser,
    validateForgotPassword,
    validateResetPassword,
    validateAvatarUpdate,
    validatePasswordUpdate
};