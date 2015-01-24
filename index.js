'use strict';

var through = require('through2');
var clone = require('lodash').clone;
var defaults = require('lodash').defaults;
var PluginError = require('gulp-util').PluginError;
var HtmlbarsCompiler = require('ember-cli-htmlbars');

var PLUGIN_NAME = 'gulp-htmlbars';

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
      return cb(null, file);  // return an empty file
    }

    // Do not do streams by gulp design
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return cb();
    }

    if (file.isBuffer()) {
      // `file.contents` type should always be the same going out as it was when it came in
      try {
        file.contents = compile(file.contents, opts);
      } catch (err) {
        this.emit('error', new PluginError(PLUGIN_NAME, err, {
          fileName: file.path
        }));
        return cb();
      }
    }

    this.push(file);
    cb();
  }

  return through.obj(HtmlBars);
};
