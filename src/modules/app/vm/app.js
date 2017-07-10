import { inject, Aurelia } from 'aurelia-framework';
import { api } from 'test/services';

export class App {
    jsText = "Some text";

    constructor() {
        this.model = {};  
    }

    attached() {
        this.reset();
        api.getMe().then(this.updateUser.bind(this));
    }

    click() {
        this.jsText = "Some text 199992";
        console.log('10000000');
    }

    updateUser(user) {
        Object.assign(this.model, user);
    }
    
    reset() {
        Object.assign(this.model, { });
    }
}
