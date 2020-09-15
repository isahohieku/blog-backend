import * as Joi from 'joi';
import { RouteHandler } from '../../lib/route';
import { NextFunction, Request, Response } from 'express';
import CustomError from '../../responses/error/custom-error';

import httpCodes from '../../constants/http-status-codes';
import responseCodes from '../../constants/response-codes';
import responseMessages from '../../constants/response-messages';
import Logger from '../../utils/logger';

const articleValidator = Joi.object().keys({
    title: Joi.string().required(),
    slug: Joi.string().required(),
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required()
});

const articleUpdateValidator = Joi.object().keys({
    id: Joi.string().required(),
    title: Joi.string().optional(),
    body: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional()
});


const throwError = (next, details): void => {
    const error = new CustomError(responseCodes.INVALID_PARAMS,
        responseMessages.FORBIDDEN, httpCodes.FORBIDDEN, details);
    Logger('validators/auth.ts', details, 'error');
    next(error);
};

const validateArticle: RouteHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await Joi.validate(req.body, articleValidator);
        next();
    } catch (e) {
        throwError(next, e.details);
    }
};

const validateUpdateArticle: RouteHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await Joi.validate(req.body, articleUpdateValidator);
        next();
    } catch (e) {
        throwError(next, e.details);
    }
};

export {
    validateArticle,
    validateUpdateArticle
};
