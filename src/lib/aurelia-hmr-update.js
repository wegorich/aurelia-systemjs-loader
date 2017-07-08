import 'systemjs-hmr';
import io from 'socket.io-client';
import debug from 'debug'
import merge from 'deepmerge'

const d = debug('systemjs-hot-reloader')

const isBrowser = typeof window !== 'undefined'
const isWorker = typeof WorkerGlobalScope !== 'undefined'

function changeAureliaFiles(url) {
    // TODO: add some event emitter to say new module there
    console.log('module loads', url);
    // TODO: find way to check uploaded views via SystemJS
    if (url && (SystemJS.loads[SystemJS.baseURL + url] || SystemJS.loads[SystemJS.baseURL + url + '!http://localhost:9000/jspm_packages/github/systemjs/plugin-text@0.0.3.js'])) {
        var moduleId = url.replace('dist/', '')
        if (moduleId.endsWith('.html')) {
            window.__reloaded = true;
            window.__systemJSLoader.hmrContext.handleViewChange(moduleId, true);
        } else{
             window.__systemJSLoader.hmrContext.handleModuleChange(moduleId.replace('.js', ''), true);
        }       
    }
}

export default (opts = {}) => {
  const options = merge({
    entries: [],
    host: `//${location.hostname}:5776`
  }, opts)

  const {host} = options

  const socket = io(host)

  const reloadPage = () => {
    d('whole page reload requested')
    if (isBrowser) {
      location.reload(true)
    }
  }

  const fileChanged = ({url, entries={}}) => {
    d('reloading', url)
    if (url.startsWith('src/')) return;
    // needs to fix url for templates I suppose
    // if (url && (SystemJS.loads[SystemJS.baseURL + url] || SystemJS.loads[SystemJS.baseURL + url + '!http://localhost:9000/jspm_packages/github/systemjs/plugin-text@0.0.3.js'])) {
    var baseUrl = SystemJS.baseURL + url;
    if (SystemJS.loads[SystemJS.baseURL + url + '!http://localhost:9000/jspm_packages/github/systemjs/plugin-text@0.0.3.js']) {
        var baseUrl = SystemJS.baseURL + url + '!http://localhost:9000/jspm_packages/github/systemjs/plugin-text@0.0.3.js';
    }
    System.reload(baseUrl, {entries: Object.values(entries).concat(options.entries)}).then(()=>{
        changeAureliaFiles(url);
    });
  }

  socket.on('connect', () => {
    d('connected to ', host)
    socket.emit('identification', navigator.userAgent)
  })

  socket.on('disconnect', () => {
    d('disconnected from', host)
  })

  // UNSTABLE NEW API - TIED TO systemjs-tools for the moment
  socket.on('*', (event) => {
    switch (event.type) {
      case 'hmr': {
        fileChanged(event)
        break
      }
    }
  })

  // support for old api
  {
    socket.on('reload', reloadPage)

    socket.on('change', (event) => {
      if (event.path === 'index.html') reloadPage()
      else fileChanged({url: event.path})
    })

    // emitting errors for jspm-dev-buddy
    if (isBrowser) {
      window.onerror = (err) => {
        socket.emit('error', err)
      }
    } else if (isWorker) {
      self.onerror = (err) => {
        socket.emit('error', err)
      }
    }
  }
}