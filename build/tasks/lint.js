var gulp = require('gulp');
var paths = require('../paths');
var eslint = require('gulp-eslint');

function isFixed(file) {
    // Has ESLint fixed the file contents?
    return file.eslint != null && file.eslint.fixed;
}
// runs eslint on all .js files
gulp.task('lint', function() {
    return gulp.src(paths.source)
        .pipe(eslint({fix:true}))
        .pipe(eslint.format())
        .pipe(gulp.dest('./dist/fixtures'));
        //.pipe(eslint.failOnError());
});
