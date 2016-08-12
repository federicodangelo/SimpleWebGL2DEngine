var gulp = require('gulp');
var ts = require('gulp-typescript');
var webserver = require('gulp-webserver');
var sourcemaps = require('gulp-sourcemaps');
 
var tsProject = ts.createProject('tsconfig.json');
 
gulp.task('scripts', function() {
    
    var tsResult = tsProject.src()
        .pipe(sourcemaps.init())
		.pipe(ts(tsProject));
        
    return tsResult.js
        .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: '../src/'}))
        .pipe(gulp.dest('web'));
});

gulp.task('watch', ['scripts'], function() {
    gulp.watch('src/**/*.ts', ['scripts']);
});

gulp.task('webserver', ['scripts', 'watch'], function() {
  gulp.src('')
    .pipe(webserver({
      livereload: true
      //directoryListing: false,
      //open: true
    }));
});
