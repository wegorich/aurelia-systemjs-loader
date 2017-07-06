### The sandbox to test Aurelia HMR for System.js

Motivations - is to create systemjs HMR for your aurelia application.

The aurelia loaders used as donors: 
- (Aurelia default loader)[https://github.com/aurelia/loader-default/blob/master/src/index.js] - contains some code samples, how work with SystemJS low lvl.
- (Aurelia webpack loader)[https://github.com/aurelia/loader-webpack/blob/master/src/aurelia-loader-webpack.ts] - have code samples, how the integrate (aurelia/hot-module-reload)[https://github.com/aurelia/hot-module-reload] to the loader.

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

0. It's not apply reloaded module to the Aurelia app yet.

1. Not clear how to trigger the **__import** method after module synchronized via sockets.js

2. module.hot - seems to be never true, but in that discussion: [React Hot Loader](https://github.com/alexisvincent/systemjs-hot-reloader/issues/140) seems be some times.

3. Open questions here:
  - [How to do custom loader?](https://github.com/alexisvincent/systemjs-hot-reloader/issues/143)
  - [HMR for SystemJS](https://github.com/aurelia/hot-module-reload/issues/10)

