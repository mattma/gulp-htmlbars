/*jshint bitwise: false*/
'use strict';

exports.lab = require('./helpers/test-helper').lab;
var describe = require('./helpers/test-helper').describe;
var it = require('./helpers/test-helper').it;
var expect = require('./helpers/test-helper').expect;

var gulp = require('gulp');
var task = require('../');
var through = require('through2');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');

function expectStream(options, done){
  options = _.defaults(options || {}, {

  });
  return through.obj(function(file, enc, cb){
    options.contents = fs.readFileSync(file.path, 'utf-8');
    var expected = _.template(jst, options);
    var results = String(file.contents);
    expect(results).to.deep.equal(expected);
    done();
    cb();
  });
}

describe('EmberHtmlbars module', function(){
  it('should some description goes here', function(done){
    var opts = {

    };
    gulp.src(filename)
      .pipe(task(opts))
      .pipe(expectStream({}, done));
  });
});
