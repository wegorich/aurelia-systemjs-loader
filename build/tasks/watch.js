import gulp from 'gulp';
import paths from '../paths';
import browserSync from 'browser-sync';
import colors from 'colors';
import padStart from 'string.prototype.padstart';

padStart.shim();

// outputs changes to files to the console
function printTime() {
    let time = new Date();
    return `[` + colors.gray(`${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}:${time.getSeconds().toString().padStart(2, "0")}`) + `]`;
}


function reportChange(event) {
    console.log(printTime(), `${'File'.padStart(8, " ")} '${colors.magenta(`${event.path}`)}' was ${colors.cyan(event.type)}`);
}

// this task wil watch for changes
// to js, html, and css files and call the
// reportChange method. Also, by depending on the
// serve task, it will instantiate a browserSync session
gulp.task('watch', ['serve'], function () {
    gulp.watch(paths.source, ['build-js']).on('change', reportChange);
    gulp.watch(paths.sass, ['sass:app:stream']).on('change', reportChange);
    gulp.watch(paths.html, ['build-html']).on('change', reportChange);
});
