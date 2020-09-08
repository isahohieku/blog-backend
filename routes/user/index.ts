import Route from '../../lib/route';
import HttpMethod from '../../lib/httpMethod';
import {
    validateCreateUser,
    validateUpdateUser,
    validateForgotPassword,
    validateResetPassword
} from '../../validators/user';
import User from '../../controllers/user';
import { verifyToken, validateEmailVerification } from '../../validators/auth';

const USER_URL = '/api';

const userEndpoints: Route[] = [
    {
        path: `${USER_URL}/user`,
        method: HttpMethod.GET,
        middlewares: [verifyToken],
        controller: [User.getUsers]
    },
    {
        path: `${USER_URL}/user`,
        method: HttpMethod.POST,
        middlewares: [verifyToken, validateCreateUser],
        controller: [User.createUser]
    },
    {
        path: `${USER_URL}/user`,
        method: HttpMethod.PUT,
        middlewares: [verifyToken, validateUpdateUser],
        controller: [User.updateUser]
    },
    {
        path: `${USER_URL}/user/confirm-email`,
        method: HttpMethod.PUT,
        middlewares: [validateEmailVerification],
        controller: [User.confirmEmail]
    },
    {
        path: `${USER_URL}/user/request-verification`,
        method: HttpMethod.POST,
        middlewares: [validateEmailVerification],
        controller: [User.requestVerificaitonEmail]
    },
    {
        path: `${USER_URL}/user/forgot-password`,
        method: HttpMethod.POST,
        middlewares: [validateForgotPassword],
        controller: [User.forgotPassword]
    },
    {
        path: `${USER_URL}/user/reset-password`,
        method: HttpMethod.POST,
        middlewares: [validateResetPassword],
        controller: [User.resetPassword]
    }
];

export default userEndpoints;
