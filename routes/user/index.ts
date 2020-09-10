import Route from '../../lib/route';
import HttpMethod from '../../lib/httpMethod';
import {
    validateCreateUser,
    validateUpdateUser,
    validateForgotPassword,
    validateResetPassword,
    validatePasswordUpdate,
    validateAvatarUpdate
} from '../../validators/user';
import User from '../../controllers/user';
import { verifyToken, validateEmailVerification } from '../../validators/auth';
import UploadImage from '../../middlewares/image-upload';

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
        path: `${USER_URL}/user/change-password`,
        method: HttpMethod.POST,
        middlewares: [verifyToken, validatePasswordUpdate],
        controller: [User.updatePassword]
    },
    {
        path: `${USER_URL}/user/avatar`,
        method: HttpMethod.POST,
        middlewares: [verifyToken, UploadImage
            .handleUploadS3().single(process['env']['AVATAR'] as string)],
        controller: [User.updateAvatar]
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
