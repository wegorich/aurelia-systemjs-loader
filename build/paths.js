var path = require('path');

var appRoot = 'src/';
var outputRoot = 'dist/';

module.exports = {
    root: appRoot,
    source: appRoot + '**/*.js',
    html: appRoot + '**/*.html',
    style: './dist/css/*.css',
    sassApp: [ 'sass/app.sass', 'sass/layout/**/*.sass', 'sass/views/**/*.sass', 'src/**/*.sass', 'sass/__settings/**/*.sass', 'sass/__mixins/**/*.sass', 'src/**/*.scss'],
    sassVendor: ['sass/vendor.sass', 'sass/__vendor/**/*.sass', 'sass/__overrides/**/*.sass', 'sass/__settings/**/*.sass', 'sass/__mixins/**/*.sass'],
    sassSource: 'sass/**/*.sass',
    sassDest: './dist/sass',
    json: appRoot + '**/*.json',
    output: outputRoot,
    doc: './doc',
    e2eSpecsSrc: 'test/e2e/src/*.js',
    e2eSpecsDist: 'test/e2e/dist/',
    release: 'release/',
    bundleSrc: ['config.js',
        'favicon.ico',
        'index.html',
        'images/**/*',
        'assets/**/*',
        'locales/**/*',
        'dist/*-bundle-*.js',
        'jspm_packages/system*',
        'jspm_packages/npm/font-awesome@*/**/*',
    ],
    bundleOutput: './release/'
};
