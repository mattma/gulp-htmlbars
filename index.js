'use strict';

var through = require('through2');
var clone = require('lodash').clone;
var defaults = require('lodash').defaults;
var PluginError = require('gulp-util').PluginError;

var PLUGIN_NAME = 'gulp-plugin-name';

function compile(contents, opts){
  // contents: `file.contents` infomration
  // opts: user passed in options or default options
  return something_useful;
}

function getOptions(opts){
  // opts will always win, override default values
  return defaults(clone(opts) || {}, {
    deps: null
  });
}

module.exports = function(options){
  function pluginName(file, enc, cb){
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
      file.contents = new Buffer(operation);
    }

    this.push(file);
    cb();
  }

  return through.obj(pluginName);
};
