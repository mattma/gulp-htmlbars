'use strict';

var through = require('through2');
var PluginError = require('gulp-util').PluginError;
var HtmlbarsCompiler = require('ember-cli-htmlbars');
var objectAssign = require('object-assign');

var defaultOptions = {
  isHTMLBars:       false,
  templateCompiler: null

  // `templateCompiler` that is paired with your Ember version
  // only available when used conjunction with `isHTMLBars: true,`
  // isHTMLBars: true,
  // Whatever comes with your Ember package template compiler
  // templateCompiler: require('../bower_components/ember/ember-template-compiler')
};

function compile (contents, opts) {
  var contentsToString = String(contents);
  var htmlBarsCompiler = new HtmlbarsCompiler(null, opts);
  var operation = htmlBarsCompiler.processString(contentsToString);
  return new Buffer(operation);
}

module.exports = function (options) {
  options = options || {};

  function HtmlBars (file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);  // return an empty file
      return;
    }

    // Do not do streams by gulp design
    if (file.isStream()) {
      cb(new PluginError('gulp-htmlbars', 'Streaming not supported', {fileName: file.path}));
      return;
    }

    var opts = objectAssign(defaultOptions, options);

    // `file.contents` type should always be the same going out as it was when it came in
    try {
      file.contents = compile(file.contents, opts);
      this.push(file);
    } catch (err) {
      this.emit('error', new PluginError('gulp-htmlbars', err, {fileName: file.path}));
    }

    cb();
  }

  return through.obj(HtmlBars);
};
