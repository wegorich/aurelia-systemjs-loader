var gulp = require('gulp');
var runSequence = require('run-sequence');
var paths = require('../paths');
var bundler = require('aurelia-bundler');
var usemin = require('gulp-usemin');
var minifyCss = require('gulp-minify-css');
var concat = require('gulp-concat');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var bundles = require('../bundles.json');

var config = {
    force: true,
    baseURL: './',
    configPath: './config.js',
    bundles: bundles.bundles
};

gulp.task('bundle', ['build', 'clean-bundle'], function() {
    return bundler.bundle(config);
});

gulp.task('unbundle', function() {
    return bundler.unbundle(config);
});

//gulp.task('bundle-cmd', ['build', 'clean-bundle'], function (callback) {
//    exec('node node_modules/aurelia-cli/bin/aurelia bundle', function (err, stdout, stderr) {
//        console.log(stdout);
//        console.error(stderr);
//        callback();
//    });
//});
//
//gulp.task('unbundle-cmd', function (callback) {
//    exec('node node_modules/aurelia-cli/bin/aurelia unbundle', function (err, stdout, stderr) {
//        console.log(stdout);
//        console.error(stderr);
//        callback();
//    });
//});


gulp.task('bundle-copy', function () {
    return gulp.src(paths.bundleSrc, {base: './'})
        .pipe(gulp.dest(paths.bundleOutput));
});

gulp.task('dist', function () {
    return runSequence(
        'bundle',
        'bundle-copy',
        'usemin',
//        'rev-bundle',
//        'revreplace',
        'unbundle'
    );
});

gulp.task('usemin', function () {
    gulp.src('./index.html')
        .pipe(usemin({
            css: [minifyCss(), 'concat', rev()],
            js: [rev()]
        }))
        .pipe(gulp.dest('release/'));

});

gulp.task("rev-bundle", function () {
    return gulp.src('release/dist/*')
        .pipe(rev())
        .pipe(gulp.dest('release/dist'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('release/dist'));

});

gulp.task("revreplace", function () {
    var manifest = gulp.src("release/dist/rev-manifest.json");
    return gulp.src("release/index.html")
        .pipe(revReplace({manifest: manifest}))
        .pipe(gulp.dest("./release"));

});
