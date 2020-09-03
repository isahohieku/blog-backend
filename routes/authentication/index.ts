import Route from '../../lib/route';
import HttpMethod from '../../lib/httpMethod';
// import { validateLogin, validateSignup } from '../validators/auth.validators';
// import AuthService from '../services/auth.service';

const AUTH_URL = '/api/auth';

const auth: Route[] = [
    // {
    //     path: AUTH_URL,
    //     method: HttpMethod.POST,
    //     middlewares:[validateSignup],
    //     controller: [AuthService.registerUser]
    // },
    // {
    //     path: `${AUTH_URL}/login`,
    //     method: HttpMethod.POST,
    //     middlewares:[validateLogin],
    //     controller: [AuthService.loginUser]
    // }
];

export default auth;
