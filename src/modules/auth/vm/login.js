import { inject, Aurelia } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { api } from 'test/services';

export class Login {
    static inject = [Router, Aurelia];
    params = {};

    constructor(router, aurelia) {
        this.router = router;
        this.aurelia = aurelia;
    }

    login() {
        this.error = false;

        api.auth.login(this.params).then(user => {
            this.aurelia.setRoot('app')
        }, err => this.error = true);
    }

    activate() {
        this.isLogin = api.auth.getToken();

        if (this.isLogin) {
            this.aurelia.setRoot('app');
        }
    }
}
