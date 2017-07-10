import api from '_services/api';

export function configure(aurelia) {
    if (!window.navigator) {
        window.navigator = {};
    }
    console.log(aurelia.loader);
    
    aurelia.use
        .standardConfiguration()
        .eventAggregator()
        .developmentLogging()

     aurelia.use.globalResources([
        'components/component.js'
     ]);

    aurelia.start()
        .then(a => {
            a.setRoot(api.auth.getToken() ? 'app' : 'auth');
        });
}
