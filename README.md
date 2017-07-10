### The sandbox to test Aurelia HMR for aurelia-systemjs-hot-plugin

Motivations - is to create systemjs HMR for your aurelia application.

The aurelia loaders used as donors: 
-  aurelia [default loader](https://github.com/aurelia/loader-default/blob/master/src/index.js) - contains some code samples, how work with SystemJS low lvl.
-  aurelia [webpack loader](https://github.com/aurelia/loader-webpack/blob/master/src/aurelia-loader-webpack.ts) - have code samples, how the integrate [aurelia/hot-module-reload](https://github.com/aurelia/hot-module-reload) to the loader.

The project based on:
- https://github.com/alexisvincent/systemjs-hot-reloader - manage file changes on the UI over System.js
- https://github.com/capaj/chokidar-socket-emitter - to connect to the browser-sync
- https://github.com/aurelia/hot-module-reload - to reloade aurelia modules

-----

#### Hot to setup from scratch

Please read it here [aurelia-systemjs-hot-plugin](https://github.com/wegorich/aurelia-sysemjs-hot-plugin)

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

The HMR works with JSPM, systemjs and aurelia.js

![alt text](./assets/images/demo.gif)

**ITWORKS**
![itworks](./assets/images/dance.webp)


Open questions here:
  - [How to do custom loader?](https://github.com/alexisvincent/systemjs-hot-reloader/issues/143)
  - [HMR for SystemJS](https://github.com/aurelia/hot-module-reload/issues/10)

