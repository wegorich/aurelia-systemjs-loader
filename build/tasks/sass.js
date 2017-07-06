/**
 * Created by wegorelax on 28.12.15.
 */
'use strict';

import gulp from 'gulp';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import cssBase64 from 'gulp-css-base64';
import sassGlob from 'gulp-sass-glob';
import browserSync from 'browser-sync';

import _ from 'lodash';
import through from 'through2';
import path from 'path';

function jsToSass(chunk, enc, cb) {
    var file = path.resolve(chunk.path);
    var vars = require(file);
    var result = '//NOTE:\n//it`s auto-generated from variables.js file, \n//by using sass:js-to-sass gulp task\n\n';
    
    vars.forEach((val, key) => {
        result += `$${_.kebabCase(key)}: (\n${Object.keys(val).map(j => `\t${_.kebabCase(j)}: ${val[j]}`).join(',\n')}\n);`;
        result += '\n\n';
    });

    chunk.contents = new Buffer(result);// this should log now
    chunk.path = chunk.path.replace('variables.js', 'core.scss');
    
    delete require.cache[file];
    
    cb(null, chunk);
}

function baseSassPipe(params) {
    let pipe = gulp.src(params.sassFile)
        .pipe(sassGlob());

    if (params.useMaps)
        pipe = pipe.pipe(sourcemaps.init());

    pipe = pipe.pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 4 versions'],
            cascade: false
        }));
        // .pipe(cssBase64({
        //     extensionsAllowed: ['.gif', '.jpg', '.png']
        // }));

    if (params.useMaps)
        pipe = pipe.pipe(sourcemaps.write(params.mapDist));

    return pipe.pipe(gulp.dest(params.dist));
}

function gulpSassApp(useMaps = false) {
    return baseSassPipe({
        sassFile: 'sass/app.sass',
        useMaps: useMaps,
        mapDist: './dist/css/maps-app',
        dist: './dist/css'
    });
}

gulp.task('sass:app', () => {
    gulpSassApp(true);
});

gulp.task('sass:app:stream', () => {
    gulpSassApp().pipe(browserSync.stream());
});

gulp.task('sass:js-to-sass', ()=> {
    gulp.src('src/variables.js')
    .pipe(through.obj(jsToSass))
    .pipe(gulp.dest('sass/__settings'));
});
