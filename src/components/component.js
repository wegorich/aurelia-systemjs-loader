import { bindable, child } from 'aurelia-framework';

export class Component {
    @bindable value; // Specifies the new filename for the downloaded file

    static inject = [Element];

    constructor(element) {
        this.element = element;
    }
}
