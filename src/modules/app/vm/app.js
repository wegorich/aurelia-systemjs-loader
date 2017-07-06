import { inject, Aurelia } from 'aurelia-framework';
import { api } from 'test/services';
import { module } from '@hot';

console.log('module', module);

export class App {
    constructor() {
        this.model = {};
    }

    attached() {
        this.reset();
        api.getMe().then(this.updateUser.bind(this));
    }

    updateUser(user) {
        Object.assign(this.model, user);
    }
    
    reset() {
        Object.assign(this.model, { });
    }
}
