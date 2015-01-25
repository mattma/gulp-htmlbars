'use strict';

// Assertion Library Docs:  https://github.com/hapijs/code
// Testing framework Docs:  https://github.com/hapijs/lab

exports.lab = require('./helpers/test-helper').lab;
var describe = require('./helpers/test-helper').describe;
var it = require('./helpers/test-helper').it;
var expect = require('./helpers/test-helper').expect;

var gulp = require('gulp');
var PluginError = require('gulp-util').PluginError;
var task = require('../');
var through = require('through2');
var path = require('path');
var fs = require('fs');
var objectAssign = require('object-assign');
var handlbarsTemplateCompiler = require('ember-template-compiler');

var Vinyl = require('vinyl');
var Readable = require('stream').Readable;

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

function stringStream () {
  var stream = new Readable();

  stream._read = function () {
    this.push('mattma');
    this.push(null);
  };

  return stream;
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

  describe('error', function () {
    var testNull = new Vinyl({
      cwd:      "/home/mattma/broken-promises/",
      base:     "/home/mattma/broken-promises/test",
      path:     "/home/mattma/broken-promises/test/test1.hbs",
      contents: null
    });

    var testStream = new Vinyl({
      cwd:      "/home/mattma/broken-promises/",
      base:     "/home/mattma/broken-promises/test",
      path:     "/home/mattma/broken-promises/test/test1.js",
      contents: stringStream()
    });

    var testError = new Vinyl({
      cwd:      "/home/mattma/broken-promises/",
      base:     "/home/mattma/broken-promises/test",
      path:     "/home/mattma/broken-promises/test/testError1.js",
      contents: new Buffer("<div> {invalidBracket} </div>")
    });

    function NoOps () { }
    NoOps.prototype.precompile = function() { };

    it('test null case when file.isNull() is true', function (done) {
      var stream = task();

      stream.on('data', function (newFile) {
        expect(newFile).to.be.exist();          // 'emits a file'
        expect(newFile.path).to.be.exist();     // 'file has a path'
        expect(newFile.relative).to.be.exist(); // 'file has relative path information'
        expect(newFile.contents).to.not.be.exist(); // 'file does not have contents'
        expect(newFile).to.be.an.instanceof(Vinyl); // 'file is Vinyl'

        expect(newFile.contents).to.be.null();
        done();
      });

      stream.write(testNull);
      stream.end();
    });

    it('test stream case when file.isStream() is true', function (done) {
      var stream = task();

      stream.on('error', function (e) {
        expect(e).to.be.an.instanceof(PluginError); // 'error is a PluginError'
        expect(e.plugin).to.equal('gulp-htmlbars'); // 'error is from gulp-htmlbars'
        expect(e.fileName).to.equal(testStream.path); // 'error reports the correct file name'
        expect(e.message).to.equal('Streaming not supported'); // 'error reports the correct file'
        expect(e.showStack).to.be.false(); // 'error is configured to not print stack'
        expect(e.showProperties).to.be.true(); // 'error is configured to show showProperties'
        done();
      });

      stream.write(testStream);
      stream.end();
    });

    it('test buffer(pass through) case and should report files in error', function (done) {
      var noOps = new NoOps();
      console.log('typeof noOps.precompile: ', typeof noOps.precompile);
      var stream = task({
        isHTMLBars:       true,
        // `templateCompiler` is a no-op, it does not have `precompile` method
        templateCompiler: noOps.precompile
      });

      stream.on('error', function (e) {
        expect(e).to.be.an.instanceof(Error); // 'argument should be of type error'
        expect(e.plugin).to.equal('gulp-htmlbars'); // 'error is from gulp-htmlbars'
        expect(e.fileName).to.equal(testError.path); // 'error reports the correct file name'
        expect(e.name).to.equal('TypeError');
        expect(e.message).to.equal('undefined is not a function');
        expect(e.stack).to.be.exist();     // 'error reports the correct file'
        expect(e.showStack).to.be.false(); // 'error is configured to not print stack'
        expect(e.showProperties).to.be.true(); // 'error is configured to show showProperties'
        done();
      });

      stream.write(testError);
      stream.end();
    });
  });
});
