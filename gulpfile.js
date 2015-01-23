'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');

var globs = [
  '**/*.js',
  '!node_modules/**'
];

gulp.task('jshint', function(){
  gulp.src(globs)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter());
});
