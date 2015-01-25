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
var objectAssign = require('object-assign');
var handlbarsTemplateCompiler = require('ember-template-compiler');

// Local Tests depends on `bower install ember`, so it could retrieve
// `ember-template-compiler.js` from the ember release bundle
var htmlBarsCompiler = require('../bower_components/ember/ember-template-compiler');

var filename = path.join(__dirname, './fixtures/template.hbs');
var componentFilename = path.join(__dirname, './fixtures/component-template.hbs');

function expectStream (options, done) {
  options = objectAssign({}, options);
  var wrapper;
  var compiler;

  if (options.isHTMLBars) {
    wrapper = 'export default Ember.HTMLBars.template(';
    // Compile handlebars template via Bundled compiler which comes with
    // each release of Ember core version (beta or stable)
    compiler = options.templateCompiler.precompile;
  } else {
    wrapper = 'export default Ember.Handlebars.template(';
    // Compile handlebars template via default `require('ember-template-compiler')`
    compiler = handlbarsTemplateCompiler.precompile;
  }

  return through.obj(function (file, enc, cb) {
    options.contents = fs.readFileSync(file.path, 'utf-8');
    var results = String(file.contents);
    var originalContent = (options.filepath) ?
      fs.readFileSync(options.filepath) :
      fs.readFileSync(filename);
    var expected = wrapper + compiler(String(originalContent), false) + ');';
    expect(results).to.deep.equal(expected);
    done();
    cb();
  });
}

describe('gulp-htmlbars', function () {
  // By default, isHTMLBars is false
  describe('htmlbars', function () {
    it('precompiles templates into htmlbars', function (done) {
      var opts = {
        isHTMLBars:       true,
        templateCompiler: htmlBarsCompiler
      };
      gulp.src(filename)
        .pipe(task(opts))
        .pipe(expectStream(opts, done));
    });

    it('precompiles component based template into htmlbars', function (done) {
      var opts = {
        isHTMLBars:       true,
        templateCompiler: htmlBarsCompiler,
        // this is convenient property ONLY for testing purpose
        filepath:         componentFilename
      };
      gulp.src(componentFilename)
        .pipe(task(opts))
        .pipe(expectStream(opts, done));
    });
  });

  describe('handlebars', function () {
    it('precompiles templates into handlebars', function (done) {
      var opts = {
        isHTMLBars: false
      };
      gulp.src(filename)
        .pipe(task(opts))
        .pipe(expectStream(opts, done));
    });

    it('precompiles component based template into handlebars', function (done) {
      var opts = {
        isHTMLBars: false,
        // this is convenient property ONLY for testing purpose
        filepath:   componentFilename
      };
      gulp.src(componentFilename)
        .pipe(task(opts))
        .pipe(expectStream(opts, done));
    });
  });
});
