import { api }  from 'test/services';
import { Routes } from './routes';

export class Auth {
    static inject = [Routes];

    constructor(routes) {
        this.routes = routes;
    }

    configureRouter(config, router) {
        config.title = 'Title'
        config.mapUnknownRoutes(instruction => {
            console.log("Map unknown routes");
            return "./modules/auth/login";
        });
        config.map(this.routes.getNoAuth());
        this.router = router;
    }
}
