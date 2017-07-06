const plugins = [
    'test/auth',
    'test/app'
];

let modules = plugins.map(e => require(e))
    .reduce((prev, current) => {
        // Object.assign(prev.reducers, current.reducers);
        // Object.assign(prev.actions, current.actions);
        prev.routes = prev.routes.concat(current.routes);
        
        return prev;
    }, { reducers: {}, actions: {}, routes: [] });

export default modules;