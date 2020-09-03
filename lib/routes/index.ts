import { Request, Response, NextFunction} from 'express';

export type Route = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export default Route;