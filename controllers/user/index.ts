import { Request, Response, NextFunction } from 'express';
import { v1 as uuidv1 } from 'uuid';
import aws from 'aws-sdk';

import sendSuccess from '../../responses/success';
import CustomError from '../../responses/error/custom-error';

import httpCodes from '../../constants/http-status-codes';
import responseCodes from '../../constants/response-codes';
import responseMessages from '../../constants/response-messages';

import { User, UserI, AdminI, Admin } from '../../models/user';
import { verifyTok, pickToken, passwordMatch } from '../../utils/auth';

import avatarHandler, { MulterFile } from '../../middlewares/image-upload';

import EmailService from '../../lib/email';
import { mailVerificationTemplate } from '../../email-templates/mail-verification';
import { forgotPasswordTemplate } from '../../email-templates/forgot-password';
import { resetPasswordTemplate } from '../../email-templates/reset-password';
import { registrationTemplate } from '../../email-templates/registration';
import { DeleteObjectRequest } from 'aws-sdk/clients/s3';

interface RequestFileWithLocation extends Request {
    hi: string;
}

class UserService {
    public constructor() { }

    public async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {
            const { id } = req.query;

            let result;

            result = !id ? await User.find({ id }) as UserI[]
                : await User.findOne({ id });

            sendSuccess(res, 'user.service.ts', result, responseMessages.NO_MESSAGE);
        } catch (e) {
            next(e);
        };
    }

    public async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {
            const { admin } = req.body;
            const data: UserI | AdminI = req.body;
            const user = await User.find({ email: data.email });

            if (user.length) {
                throw new CustomError(responseCodes.USER_EXIST,
                    responseMessages.RESOURCE_EXIST('User'), httpCodes.UNAUTHORIZED);
            }

            const query = !admin ? new User(data) : new Admin(data);

            const result = await query.save() as (UserI | AdminI);

            delete result.password;
            delete result.token;

            sendSuccess(res, 'user.service.ts', result, 'User created Successfully');
        } catch (e) {
            next(e);
        };
    }

    public async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {
            const data: UserI = req.body;
            const user = await User.findOne({ _id: data.id }) as UserI;

            if (!user) {
                throw new CustomError(responseCodes.NOT_FOUND,
                    responseMessages.RESOURCE_NOT_FOUND('User'), httpCodes.NOT_FOUND);
            }

            const token = pickToken(req);
            const referer = verifyTok(req, res, token) as AdminI;

            // Only Super admin or User will get privilege
            if ((referer.adminType !== 'super') && (referer.id !== user.id)) {
                throw new CustomError(responseCodes.FORBIDDEN, responseMessages.FORBIDDEN, httpCodes.FORBIDDEN);
            }

            const params = { ...data };
            delete params.id;

            const skips = [];

            if ((referer.adminType !== 'super')) {
                skips.push('roles');
                skips.push('status');
            }


            const result = await User.findOneAndUpdate({ _id: user.id }, params, { new: true });


            sendSuccess(res, 'user.service.ts', result, 'Update Successful');
        } catch (e) {
            next(e);
        };
    }

    public async confirmEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: UserI = req.body;
            const user = await User.find({ email: data.email }) as UserI[];

            if (!user.length) {
                throw new CustomError(responseCodes.USER_EXIST,
                    responseMessages.RESOURCE_EXIST('User'), httpCodes.UNAUTHORIZED);
            }

            if (data.verificationToken !== user[0].verificationToken) {
                throw new CustomError(responseCodes.INVALID_TOKEN, 'Invalid verification token', 401);
            }

            const params = { isEmailVerified: true, status: 'enabled' };

            const result = await User.findOneAndUpdate({ _id: user[0].id }, params, { new: true });
            await EmailService.sendEmail(user[0].email, 'Email Confirmed', null, null,
                mailVerificationTemplate(user[0]));

            sendSuccess(res, 'user.controllers.ts', result, 'Email successfully confirmed');
        } catch (e) {
            next(e);
        };
    }

    public async requestVerificaitonEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email } = req.body;
            if (!email) {
                throw new CustomError(responseCodes.FORBIDDEN,
                    'Email required', httpCodes.FORBIDDEN);
            }
            const user = await User.find({ email }) as UserI[];

            if (!user.length) {
                throw new CustomError(responseCodes.USER_EXIST,
                    responseMessages.RESOURCE_EXIST('User'), httpCodes.UNAUTHORIZED);
            }

            if (user[0].isEmailVerified) {
                throw new CustomError(responseCodes.FORBIDDEN,
                    `${user[0].email} is already verified`, httpCodes.FORBIDDEN);
            }

            const params = { verificationToken: uuidv1() };

            const result = await User.findOneAndUpdate({ _id: user[0].id }, params, { new: true });
            await EmailService.sendEmail(user[0].email, 'Welcome to Vehicle Registration', null, null,
                registrationTemplate(user[0].verificationToken, user[0]));

            sendSuccess(res, 'user.controllers.ts', result, 'Email successfully confirmed');
        } catch (e) {
            next(e);
        }
    }

    public async updatePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { oldPassword, newPassword } = req.body;

            const userObject: Partial<UserI> = pickToken(req);

            const user = await User.findOne({ _id: userObject.id }) as UserI;

            if (!await passwordMatch(oldPassword, user.password)) {
                throw new CustomError(responseCodes.FORBIDDEN,
                    'Wrong password', httpCodes.FORBIDDEN);
            }

            const params = { password: newPassword };

            const result = await User.findOneAndUpdate({ _id: user.id }, params, { new: true });
            // await EmailService.sendEmail(user[0].email, 'Reset Password', null, null,
            //     forgotPasswordTemplate(user[0], params.forgotPasswordToken));

            sendSuccess(res, 'user.controllers.ts', result, 'Email changed successfully');
        } catch (e) {
            next(e);
        };
    }

    public async updateAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { location } = req.file as MulterFile;

            const token: string = pickToken(req) as string;
            const userData: Partial<UserI> = verifyTok(req, res, token) as Partial<UserI>;

            const user = await User.findOne({ _id: userData.id }) as UserI;

            // Delete previous avatar
            if (user.avatar) {
                const { AWS_SECRET_ACCESS_KEY, AWS_ACCESS_KEY_ID, BUCKET } = process.env;
                const s3 = new aws.S3({
                    secretAccessKey: AWS_SECRET_ACCESS_KEY,
                    accessKeyId: AWS_ACCESS_KEY_ID
                });

                const deleteParams: DeleteObjectRequest = {
                    Bucket: BUCKET as string,
                    Key: user.avatar
                };

                await new Promise((resolve, reject): void => {
                    s3.deleteObject(deleteParams, (err: any, data: any): void => {
                        resolve(data);
                        reject(err);
                    });
                });
            }

            user.avatar = location;

            const params = { avatar: location };

            const result: UserI = await User.findOneAndUpdate({ _id: user.id }, params, { new: true }) as UserI;

            sendSuccess(res, 'user.controllers.ts', result, 'Avatar changed successfully');
        } catch (e) {
            next(e);
        };
    }

    public async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email } = req.body;

            const user = await User.find({ email }) as UserI[];

            if (!user.length) {
                throw new CustomError(responseCodes.NOT_FOUND,
                    responseMessages.RESOURCE_NOT_FOUND('User'), httpCodes.NOT_FOUND);
            }

            const params = { forgotPasswordToken: uuidv1() };

            const result = await User.findOneAndUpdate({ _id: user[0].id }, params, { new: true });
            await EmailService.sendEmail(user[0].email, 'Reset Password', null, null,
                forgotPasswordTemplate(user[0], params.forgotPasswordToken));

            sendSuccess(res, 'user.controllers.ts', result, 'Reset email sent successfully');
        } catch (e) {
            next(e);
        };
    }

    public async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { password, token, email } = req.body;

            const user = await User.find({ email }) as UserI[];

            if (!user.length) {
                throw new CustomError(responseCodes.NOT_FOUND, responseMessages.NO_MESSAGE, httpCodes.NOT_FOUND);
            }

            if (user[0].forgotPasswordToken !== token) {
                throw new CustomError(responseCodes.BAD_REQUEST, 'Wrong token try reset password again', 422);
            }

            const params = { password, forgotPasswordToken: null };

            const result = await User.findOneAndUpdate({ _id: user[0].id }, params, { new: true });

            await EmailService.sendEmail(user[0].email, 'Password Reset Successful', null, null,
                resetPasswordTemplate(user[0]));

            sendSuccess(res, 'user.controllers.ts', result, 'Reset email confirmation sent successfully');
        } catch (e) {
            next(e);
        };
    }
}

export default new UserService; 
