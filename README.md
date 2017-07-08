### The sandbox to test Aurelia HMR for System.js

Motivations - is to create systemjs HMR for your aurelia application.

The aurelia loaders used as donors: 
-  aurelia [default loader](https://github.com/aurelia/loader-default/blob/master/src/index.js) - contains some code samples, how work with SystemJS low lvl.
-  aurelia [webpack loader](https://github.com/aurelia/loader-webpack/blob/master/src/aurelia-loader-webpack.ts) - have code samples, how the integrate [aurelia/hot-module-reload](https://github.com/aurelia/hot-module-reload) to the loader.

The project based on:
- https://github.com/alexisvincent/systemjs-hot-reloader - manage file changes on the UI over System.js
- https://github.com/capaj/chokidar-socket-emitter - to connect to the browser-sync
- https://github.com/aurelia/hot-module-reload - to reloade aurelia modules

The core idea is to implement the **aurelia-sysemjs-loader**. Other vice needs to handle: 

```
/**
 * You can import the previous instance of your module as you would any other module.
 * On first load, module == false.
 */
import { module } from '@hot'

/**
 * Since all exports of the previous instance are available, you can simply export any state you might want to persist.
 *
 * Here we set and export the state of the file. If 'module == false' (first load),
 * then initialise the state to {}, otherwise set the state to the previously exported
 * state.
 */
export const _state = module ? module._state : {}

// OR

export const __unload = () => {
    console.log('Unload something (unsubscribe from listeners, disconnect from socket, etc...)')
    // your container node
}
```

In each JS module. And it's not so cool as it can be.

-----

#### How to setup and run sandbox:

```
npm install -g jspm
npm install -g gulp

npm install
jspm install

gulp watch
```

-----

#### Current state: 

- [X] Live reload css done by [browser-sync stream](https://www.browsersync.io/docs/api#api-stream), and [sass-glob](https://www.npmjs.com/package/gulp-sass-glob)

- [X] It's not apply reloaded module to the Aurelia app yet. Found that we need extra system.js module, to process changes. Take a look at **/lib/aurelia-hmr-update**. Case that file said that our module changes, and provide module name as notification. Then **aurelia-systemjs-loader** can trigger **__import** to update aurelia deps.

- [X] **module.hot** - seems to be never true, but in that discussion: [React Hot Loader](https://github.com/alexisvincent/systemjs-hot-reloader/issues/140) seems be some times. UPs: it's globar webpack flag. 

- [X] How to reload the template? Found that **systemjs-hot-reloader**, disallow you patch the html after reloads via default systemjs loaders. But it works over the **socket.io-client**. So I decide to patch **systemjs-hot-reloader** itself to provide me a hook for subscribing directly to the sockets message bus.

- [X] Find the way to reload the Aurelia templates

- [] Fork **aurelia-loader-webpack** and push changes, for community reviev

- [] Fork **systemjs-hot-reloader** and push changes for PR, we need for the change callback

Open questions here:
  - [How to do custom loader?](https://github.com/alexisvincent/systemjs-hot-reloader/issues/143)
  - [HMR for SystemJS](https://github.com/aurelia/hot-module-reload/issues/10)

