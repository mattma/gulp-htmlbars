'use strict';

var through = require('through2');
var clone = require('lodash').clone;
var defaults = require('lodash').defaults;
var PluginError = require('gulp-util').PluginError;
var HtmlbarsCompiler = require('ember-cli-htmlbars');

function compile (contents, opts) {
  var contentsToString = String(contents);
  var htmlBarsCompiler = new HtmlbarsCompiler(null, opts);
  var operation = htmlBarsCompiler.processString(contentsToString);
  return new Buffer(operation);
}

function getOptions (opts) {
  // opts will always win, override default values
  return defaults(clone(opts) || {}, {
    isHTMLBars:       false,
    templateCompiler: null

    // `templateCompiler` that is paired with your Ember version
    // only available when used conjunction with `isHTMLBars: true,`
    // isHTMLBars: true,
    // Whatever comes with your Ember package template compiler
    // templateCompiler: require('../bower_components/ember/ember-template-compiler')
  });
}

module.exports = function (options) {
  function HtmlBars (file, enc, cb) {
    var opts = getOptions(options);

    // Optional: handle the `file` is not existed
    if (file.isNull()) {
      cb(null, file);  // return an empty file
      return;
    }

    // Do not do streams by gulp design
    if (file.isStream()) {
      cb(new PluginError('gulp-htmlbars', 'Streaming not supported'));
      return;
    }

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
