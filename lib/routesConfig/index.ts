import { Router } from 'express';
import Route from '../route';
import Routes from '../../routes';

const configureRoutes = (): void => {
    for (const route of Routes as Route[]) {
        const { method, path, middlewares, controller } = route;
        Router[method](path, middlewares, controller);
    };
};

export default configureRoutes;
