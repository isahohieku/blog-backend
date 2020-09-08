import Route from '../../lib/route';
import HttpMethod from '../../lib/httpMethod';
import { validateLogin, validateSignup } from '../../validators/auth';
import Auth from '../../controllers/auth';

const AUTH_URL = '/api/auth';

const auth: Route[] = [
    {
        path: AUTH_URL,
        method: HttpMethod.POST,
        middlewares:[validateSignup],
        controller: [Auth.registerUser]
    },
    {
        path: `${AUTH_URL}/login`,
        method: HttpMethod.POST,
        middlewares:[validateLogin],
        controller: [Auth.loginUser]
    }
];

export default auth;
