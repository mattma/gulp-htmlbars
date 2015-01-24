'use strict';

var through = require('through2');
var clone = require('lodash').clone;
var defaults = require('lodash').defaults;
var PluginError = require('gulp-util').PluginError;
var HtmlbarsCompiler = require('ember-cli-htmlbars');
var handlbarsTemplateCompiler = require('ember-template-compiler');

var PLUGIN_NAME = 'gulp-ember-htmlbars';

function compile(contents, opts){
  var htmlbarsCompiler = new HtmlbarsCompiler(null, opts);
  return htmlbarsCompiler.processString(contents);
}

function getOptions(opts){
  // opts will always win, override default values
  return defaults(clone(opts) || {}, {
    isHTMLBars: true,
    // provide the templateCompiler that is paired with your Ember version
    templateCompiler: handlbarsTemplateCompiler
  });
}

module.exports = function(options){
  function emberHtmlbars(file, enc, cb){
    var opts = getOptions(options);

    // Optional: handle the `file` is not existed
    if (file.isNull()) {
      return cb(null, file);  // return an empty file
    }

    // Do not do streams by gulp design
    if(file.isStream()){
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return cb();
    }

    if(file.isBuffer()){
      // Transformation magic happens here.
      // `file.contents` type should always be the same going out as it was when it came in
      var operation = compile(String(file.contents), opts);
      var contents = new Buffer(operation);
      file.contents = contents;
    }

    this.push(file);
    cb();
  }

  return through.obj(emberHtmlbars);
};
