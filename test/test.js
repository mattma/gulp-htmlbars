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
var handlbarsTemplateCompiler = require('ember-template-compiler');

var filename = path.join(__dirname, './fixtures/template.hbs');

function expectStream (options, done) {
  options = _.defaults(options || {}, {});
  var wrapper = options.isHTMLBars ?
    'export default Ember.HTMLBars.template(' :
    'export default Ember.Handlebars.template(';

  return through.obj(function (file, enc, cb) {
    options.contents = fs.readFileSync(file.path, 'utf-8');
    var results = String(file.contents);
    var originalContent = fs.readFileSync(filename);
    var expected = wrapper +
      handlbarsTemplateCompiler.precompile(String(originalContent), false) + ');';
    expect(results).to.deep.equal(expected);
    done();
    cb();
  });
}

describe('gulp-htmlbars', function () {
  // By default, isHTMLBars is false
  describe('htmlbars', function() {
    it('precompiles templates into htmlbars', function(done){
      var opts = {
        isHTMLBars : true,
        templateCompiler: handlbarsTemplateCompiler
      };
      gulp.src(filename)
        .pipe(task(opts))
        .pipe(expectStream(opts, done));
    });
  });

  describe('handlebars', function() {
    it('precompiles templates into handlebars', function(done) {
      var opts = {
        isHTMLBars: false
      };
      gulp.src(filename)
        .pipe(task(opts))
        .pipe(expectStream(opts, done));
    });
  });
});
