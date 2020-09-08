import { Request, Response, NextFunction } from 'express';
import { v1 as uuidv1 } from 'uuid';
import sendSuccess from '../../responses/success';
import CustomError from '../../responses/error/custom-error';

import httpCodes from '../../constants/http-status-codes';
import responseCodes from '../../constants/response-codes';
import responseMessages from '../../constants/response-messages';

import { User, UserI } from '../../models/user';
import { passwordMatch, generateJWT, pickUserData } from '../../utils/auth';

import EmailService from '../../lib/email';
import { registrationTemplate } from '../../email-templates/registration';

class AuthService {
    public constructor() { }

    public async registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {
            const data: UserI = req.body;
            const user = await User.find({ email: data.email });

            if (user.length) {
                throw new CustomError(responseCodes.USER_EXIST, 
                    responseMessages.RESOURCE_EXIST('User'), httpCodes.FORBIDDEN);
            }

            const query = new User(data);
            query.verificationToken = uuidv1();

            const result = await query.save();

            await EmailService.sendEmail(query.email, 'Welcome to Vehicle Registration', null, null,
                registrationTemplate(query.verificationToken, query));

            sendSuccess(res, 'auth.controllers.ts', result, 'User created Successfully');
        } catch (e) {
            next(e);
        };
    }

    public async loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;

            const result = await User.find({ email });

            if (!result.length) {
                throw new CustomError(responseCodes.USER_NOT_FOUND, 
                    responseMessages.RESOURCE_NOT_FOUND('User'), httpCodes.NOT_FOUND);
            }

            let user: Partial<UserI> = result[0] as UserI;

            await passwordMatch(password, user.password)
                .then((match): void => {
                    if (!match) {
                        throw new CustomError(responseCodes.WRONG_CREDENTIALS, responseMessages.WRONG_CREDENTIALS, 422);
                    }
                });

            user = pickUserData(user as UserI);

            user.token = generateJWT(user as UserI);

            sendSuccess(res, 'auth.service.ts', user);

        } catch (e) {
            next(e);
        }
    }
}

export default new AuthService; 