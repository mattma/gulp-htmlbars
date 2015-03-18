'use strict';

var through = require('through2');
var PluginError = require('gulp-util').PluginError;
var objectAssign = require('object-assign');

var defaultOptions = {
  templateCompiler: null
  // Whatever comes with your Ember package template compiler
  // templateCompiler: require('../bower_components/ember/ember-template-compiler')
};

function compile (contents, opts) {
  var contentsToString = String(contents);
  var content = "export default Ember.HTMLBars.template(" + opts.templateCompiler.precompile(contentsToString, false) + ');';
  return new Buffer(content);
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

    if (!opts.templateCompiler) {
      cb(new PluginError('gulp-htmlbars', 'Missing value of templateCompiler from options'));
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
