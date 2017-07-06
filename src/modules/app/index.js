import routes from './routes';

export function configure(frameworkConfig, configurationCallback) {
    // Populate app with the module routes
    configurationCallback(routes);
}

export { routes }
