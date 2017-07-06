/*eslint dot-notation:0*/
import { Origin } from 'aurelia-metadata';
import { TemplateRegistryEntry, Loader } from 'aurelia-loader';
import { DOM, PLATFORM } from 'aurelia-pal';
/**
 * An implementation of the TemplateLoader interface implemented with text-based loading.
 */
export class TextTemplateLoader {
    /**
     * Loads a template.
     * @param loader The loader that is requesting the template load.
     * @param entry The TemplateRegistryEntry to load and populate with a template.
     * @return A promise which resolves when the TemplateRegistryEntry is loaded with a template.
     */
    async loadTemplate(loader, entry) {
        const text = await loader.loadText(entry.address);
        entry.template = DOM.createTemplateFromMarkup(text);
    }
}

export function ensureOriginOnExports(moduleExports, moduleId) {
    let target = moduleExports;
    let key;
    let exportedValue;

    if (target.__useDefault) {
        target = target.default;
    }

    Origin.set(target, new Origin(moduleId, 'default'));

    if (typeof target === 'object') {
        for (key in target) {
            exportedValue = target[key];

            if (typeof exportedValue === 'function') {
                Origin.set(exportedValue, new Origin(moduleId, key));
            }
        }
    }

    return moduleExports;
}

/**
 * A default implementation of the Loader abstraction which works with SystemJS, RequireJS and Dojo Loader.
 */
export class SystemJSLoader extends Loader {
    moduleRegistry = Object.create(null);
    loaderPlugins = {};
    modulesBeingLoaded = new Map();
    templateLoader;
    hmrContext;

    /**
     * Creates an instance of the SystemJSLoader.
     */
    constructor() {
        super();
        /**
         * The name of the underlying native loader plugin used to load text.
         */
        this.textPluginName = 'text';


        this.moduleRegistry = Object.create(null);
        this.useTemplateLoader(new TextTemplateLoader());

        let that = this;

        this.addPlugin('template-registry-entry', {
            fetch: async(address) => {
                // let entry = that.getOrCreateTemplateRegistryEntry(address);
                // return entry.templateIsLoaded ? entry : that.templateLoader.loadTemplate(that, entry).then(x => entry);
                // HMR:
                console.log('module.hot')
                if(module.hot) {
                    if (!this.hmrContext) {
                        // Note: Please do NOT import aurelia-hot-module-reload statically at the top of file.
                        //       We don't want to bundle it when not using --hot, in particular in production builds.
                        //       Webpack will evaluate the `if (module.hot)` above at build time 
                        //       and will include (or not) aurelia-hot-module-reload accordingly.
                        const { HmrContext } = require('aurelia-hot-module-reload');
                        this.hmrContext = new HmrContext(this);
                    }
                    module.hot.accept(address, async() => {
                        await this.hmrContext.handleViewChange(address);
                    });
                }

                const entry = this.getOrCreateTemplateRegistryEntry(address);
                if (!entry.templateIsLoaded) {
                    await this.templateLoader.loadTemplate(this, entry);
                }
                return entry;
            }
        });
    }


    async _import(address, defaultHMR = true) {
        if (SystemJS.has(address)) {
            console.log('reload', address)
            if (defaultHMR && module.hot && this.hmrContext) {
                this.hmrContext.handleModuleChange(moduleId);
            }
            return SystemJS.reload(address);
        } else {
            return SystemJS.import(address);
        }
    }

    /**
     * Maps a module id to a source.
     * @param id The module id.
     * @param source The source to map the module to.
     */
    map(id, source) {}


    /**
     * Normalizes a module id.
     * @param moduleId The module id to normalize.
     * @param relativeTo What the module id should be normalized relative to.
     * @return The normalized module id.
     */
    normalizeSync(moduleId, relativeTo) {
        return moduleId;
    }

    /**
     * Normalizes a module id.
     * @param moduleId The module id to normalize.
     * @param relativeTo What the module id should be normalized relative to.
     * @return The normalized module id.
     */
    normalize(moduleId, relativeTo) {
        return Promise.resolve(moduleId);
    }

    /**
     * Instructs the loader to use a specific TemplateLoader instance for loading templates
     * @param templateLoader The instance of TemplateLoader to use for loading templates.
     */
    useTemplateLoader(templateLoader) {
        this.templateLoader = templateLoader;
    }

    /**
     * Loads a collection of modules.
     * @param ids The set of module ids to load.
     * @return A Promise for an array of loaded modules.
     */
    loadAllModules(ids) {
        return Promise.all(
            ids.map(id => this.loadModule(id))
        );
    }

    /**
     * Loads a module.
     * @param moduleId The module ID to load.
     * @return A Promise for the loaded module.
     */
    async loadModule(moduleId, defaultHMR = true) {
        let existing = this.moduleRegistry[moduleId];
        if (existing) {
            return Promise.resolve(existing);
        }
        let beingLoaded = this.modulesBeingLoaded.get(moduleId);
        if (beingLoaded) {
            return Promise.resolve(beingLoaded);
        }
        beingLoaded = this._import(moduleId, defaultHMR);
        this.modulesBeingLoaded.set(moduleId, beingLoaded);

        const moduleExports = await beingLoaded;
        this.moduleRegistry[moduleId] = ensureOriginOnExports(moduleExports, moduleId);
        this.modulesBeingLoaded.delete(moduleId);
        return moduleExports;
    }

    /**
     * Loads a text-based resource.
     * @param url The url of the text file to load.
     * @return A Promise for text content.
     */
    loadText(url) {
        return this._import(this.applyPluginToUrl(url, this.textPluginName)).then(textOrModule => {
            if (typeof textOrModule === 'string') {
                return textOrModule;
            }

            return textOrModule['default'];
        });
    }

    /**
     * Loads a template.
     * @param url The url of the template to load.
     * @return A Promise for a TemplateRegistryEntry containing the template.
     */
    loadTemplate(url) {
        return this.loadModule(this.applyPluginToUrl(url, 'template-registry-entry'), false);
    }

    /**
     * Alters a module id so that it includes a plugin loader.
     * @param url The url of the module to load.
     * @param pluginName The plugin to apply to the module id.
     * @return The plugin-based module id.
     */
    applyPluginToUrl(url, pluginName) {
        return `${url}!${pluginName}`;
    }

    /**
     * Registers a plugin with the loader.
     * @param pluginName The name of the plugin.
     * @param implementation The plugin implementation.
     */
    addPlugin(pluginName, implementation) {
        System.set(pluginName, System.newModule({
            'fetch': function(load, _fetch) {
                let result = implementation.fetch(load.address);
                return Promise.resolve(result).then(x => {
                    load.metadata.result = x;
                    return '';
                });
            },
            'instantiate': function(load) {
                return load.metadata.result;
            }
        }));
    };
}

PLATFORM.Loader = SystemJSLoader;
PLATFORM.eachModule = function(callback) {
    if (System.registry) { // SystemJS >= 0.20.x
        for (let [k, m] of System.registry.entries()) {
            try {
                if (callback(k, m)) return;
            } catch (e) {}
        }
        return;
    }

    // SystemJS < 0.20.x
    let modules = System._loader.modules;

    for (let key in modules) {
        try {
            if (callback(key, modules[key].module)) return;
        } catch (e) {}
    }
};

System.set('text', System.newModule({
    'translate': function(load) {
        return 'module.exports = "' + load.source
            .replace(/(["\\])/g, '\\$1')
            .replace(/[\f]/g, '\\f')
            .replace(/[\b]/g, '\\b')
            .replace(/[\n]/g, '\\n')
            .replace(/[\t]/g, '\\t')
            .replace(/[\r]/g, '\\r')
            .replace(/[\u2028]/g, '\\u2028')
            .replace(/[\u2029]/g, '\\u2029') +
            '";';
    }
}));