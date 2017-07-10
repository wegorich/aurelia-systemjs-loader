import gulp from 'gulp';
import browserSync from 'browser-sync';
import chokidarEvEmitter from 'chokidar-socket-emitter';

gulp.task('serve', ['build'], () => {
  const url = require('url');
  const proxy = require('proxy-middleware');
  const proxyUrl = process.env.URL || '';
  const proxyOptions = url.parse(proxyUrl);

  proxyOptions.route = '/api';

  browserSync({
    browser: 'chrome',
    notify: false,
    port: 9000,
    logPrefix: 'DSP',
    online: false,
    open: false,
    reloadOnRestart: true,
    injectChanges: true,
    snippetOptions: {
      rule: {
        match: '<span id="browser-sync-binding"></span>',
        fn(snippet) {
          return snippet;
        }
      }
    },
    server: {
      baseDir: ['.'],
      middleware: [
        proxy(proxyOptions)
      ]
    }
  }, function() {
      chokidarEvEmitter({ quiet: true })
  });
});
