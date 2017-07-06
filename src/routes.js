import { modules } from 'test/services';

export class Routes {
    constructor() {}

    getRoutes() {
        return modules.routes;
    }

    getNoAuth() {
        return this.noAuthItems = modules.routes.filter(e => e.isNoAuth);
    }
}
