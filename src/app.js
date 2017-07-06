import { api }  from 'test/services';
import { Routes } from './routes';
import { Aurelia } from 'aurelia-framework';

export class App {
    static inject = [Routes, Aurelia];
    subscr = [];

    constructor(routes, aurelia) {
        this.routes = routes;
        this.aurelia = aurelia;
    }

    configureRouter(config, router) {

        config.title = 'Title';
        config.map(this.routes.getRoutes());
        this.router = router;
    }

    showLoading(data) {
        this.loading = true;
    }

    hideLoading(data) {
        this.loading = false;
    }

    logout() {
        console.log('logout')
        api.auth.logout();
        this.aurelia.setRoot('auth');
    }
}
