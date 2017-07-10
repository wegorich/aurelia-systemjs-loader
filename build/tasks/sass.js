import gulp from 'gulp';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import cssBase64 from 'gulp-css-base64';
import sassGlob from 'gulp-sass-glob';
import browserSync from 'browser-sync';
//some performance optimization
//have no sense render bootstrap each time
//

function baseSassPipe(params) {
    let pipe = gulp.src(params.sassFile)
        .pipe(sassGlob());

    if (params.useMaps)
        pipe = pipe.pipe(sourcemaps.init());

    pipe = pipe.pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 4 versions'],
            cascade: false
        }))
        .pipe(cssBase64({
            extensionsAllowed: ['.gif', '.jpg', '.png']
        }));

    if (params.useMaps)
        pipe = pipe.pipe(sourcemaps.write(params.mapDist));

    return pipe.pipe(gulp.dest(params.dist));
}

function gulpSassApp(useMaps = false) {
    return baseSassPipe({
        sassFile: 'sass/app.sass',
        useMaps,
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

function gulpSassVendor(useMaps = false) {
    return baseSassPipe({
        sassFile: 'sass/vendor.sass',
        useMaps,
        mapDist: './dist/css/maps-vendor',
        dist: './dist/css'
    });
}

gulp.task('sass:vendor', () => {
    gulpSassVendor(true);
});

gulp.task('sass:vendor:stream', () => {
    gulpSassVendor().pipe(browserSync.stream());
});
