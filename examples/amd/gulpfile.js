'use strict';

var gulp = require('gulp');
var htmlbars = require('gulp-htmlbars');
var wrap = require('gulp-wrap-amd');
var concat = require('gulp-concat');

gulp.task('templates', function(){
  gulp.src('source/templates/*.hbs')
    .pipe(htmlbars())
    .pipe(wrap({
      deps:         ['exports'],          // dependency array
      params:       ['__exports__'],        // params for callback
      moduleRoot:   'source/templates/',
      modulePrefix: 'rocks/'
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('build/js/'));
});
