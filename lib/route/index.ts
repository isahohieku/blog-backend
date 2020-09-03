import HttpMethod from '../httpMethod';
import Endpoint from '../routes';

interface Route {
    path: string;
    method: HttpMethod;
    middlewares: Endpoint[];
    controller: Endpoint;
}

export default Route;
