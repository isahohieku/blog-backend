import { Request, Response, NextFunction} from 'express';
import HttpMethod from '../httpMethod';

interface RouteHandler {
    (req: Request, res: Response, next: NextFunction): Promise<void>;
}

interface Route {
    path: string;
    method: HttpMethod;
    middlewares: RouteHandler[];
    controller: RouteHandler;
}

export default Route;
