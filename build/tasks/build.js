var gulp = require('gulp');
var runSequence = require('run-sequence');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var to5 = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');
var paths = require('../paths');
var compilerOptions = require('../babel-options');
var assign = Object.assign || require('object.assign');

gulp.task('build-js', function() {
    return gulp.src(paths.source)
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(changed(paths.output, {extension: '.js'}))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(to5(assign({}, compilerOptions("commonjs"))))
        .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: '/src'}))
        .pipe(gulp.dest(paths.output));
});

// copies changed html files to the output directory
gulp.task('build-html', function () {
    return gulp.src(paths.html)
        .pipe(changed(paths.output, {extension: '.html'}))
        .pipe(gulp.dest(paths.output));
});

gulp.task('add-locale', function () {
    return gulp.src('locales/**/*.json')
        .pipe(gulp.dest(paths.output + '/locales'));
});

// this task calls the clean task (located
// in ./clean.js), then runs the build-system
// and build-html tasks in parallel
// https://www.npmjs.com/package/gulp-run-sequence
gulp.task('build', function (callback) {
    return runSequence(
        'clean', [
            'sass:app',
            'build-js',
            'build-json',
            'build-html',
            'add-locale'
        ],
        callback
    );
});
