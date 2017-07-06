import gulp from 'gulp';
import paths from '../paths';
import browserSync from 'browser-sync';
import chokidarEvEmitter from 'chokidar-socket-emitter';

gulp.task('serve', ['build'], function() {
    var bs = browserSync.create();

    bs.watch([
        'index.html',
        'config.js',
        './src/aurelia-loader-system.js',
        './src/text-template-loader.js',
        './src/aurelia-loader-custom.js',
        'jspm.config.js'
    ]).on('change', bs.reload);

    bs.init({
        server: '.',
        port: 9000,
        logPrefix: 'TEST',
        online: false,
        open: false,
        reloadOnRestart: true
    }, function(){
        chokidarEvEmitter();
    });

    
});