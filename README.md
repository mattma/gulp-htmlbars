# gulp-htmlbars

[![NPM][npm-badge-image]][npm-badge-url]

[![NPM version][npm-image]][npm-url]   [![Build Status][travis-image]][travis-url]   [![Dependency Status][dependency-image]][dependency-url]

> To compile htmlbars and handlebars templates for gulp

## Usage

Install `gulp-htmlbars` as a development dependency:

```bash
npm install --save-dev gulp-htmlbars
```

## [Compiling *handlebars* templates for the browser](examples/amd). (**AMD format**)

[`gulp-wrap-amd`](https://github.com/phated/gulp-wrap-amd.git), is maintained by [@phated](blaine@iceddev.com) and myself, can be used to safely convert templates into AMD syntax available for use in the browser.

First, install development dependencies:

```shell
npm install --save-dev gulp-htmlbars gulp-wrap-amd gulp-concat gulp
```

Given the following directory structure:

```
├── gulpfile.js              # Your gulpfile
└── source/                  # Your application's source files
    └── templates/           # A folder containing templates named with dot notation
        └── header.hbs       # A template that will be available as MyApp.templates.home.header
```

To compile all templates in `source/templates/` to `build/js/templates.js` under the `MyApp.templates` namespace:

#### gulpfile.js

```js
var gulp = require('gulp');
var htmlbars = require('gulp-htmlbars');
var wrap = require('gulp-wrap-amd');
var concat = require('gulp-concat');

gulp.task('templates', function(){
  gulp.src('source/templates/*.hbs')
    .pipe(htmlbars())
    .pipe(wrap({
      deps:         ['exports'],          // optional, dependency array
      params:       ['__exports__'],      // optional, params for callback
      moduleRoot:   'source/templates/',  // optional
      modulePrefix: 'rocks/'              // optional
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('build/js/'));
});
```

The template's definition is combined with the namespace, add optional module dependency and local variable, so the resulting `build/js/templates.js` would look like:

```js
define("rocks/header", ["exports"], function(__exports__) {
  return export default Ember.Handlebars.template({
    "compiler": [6, ">= 2.0.0-beta.1"],
    "main": function(depth0, helpers, partials, data) {
      var stack1, buffer = '';
      data.buffer.push("<header>\n  ");
      stack1 = helpers._triageMustache.call(depth0, "header_content", {
        "name": "_triageMustache",
        "hash": {},
        "hashTypes": {},
        "hashContexts": {},
        "types": ["ID"],
        "contexts": [depth0],
        "data": data
      });
      if (stack1 != null) {
        data.buffer.push(stack1);
      }
      data.buffer.push("\n</header>\n");
      return buffer;
    },
    "useData": true
  });
});
```

## Compiling *htmlbars* templates for the browser. (**AMD format**)

#### gulpfile.js

```js
gulp.task('templates', function(){
  gulp.src('source/templates/*.hbs')
    .pipe(htmlbars({
      isHTMLBars:       true,
      // see #API section for more details
      templateCompiler: require('../bower_components/ember/ember-template-compiler')
    }))
    .pipe(wrap({
      deps:         ['exports'],          // optional, dependency array
      params:       ['__exports__'],      // optional, params for callback
      moduleRoot:   'source/templates/',  // optional
      modulePrefix: 'rocks/'              // optional
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('build/js/'));
});
```

## Compiling templates for use in Ember applications

See the [ember-rocks](https://github.com/mattma/ember-rocks) for a full example of compiling templates for Ember.

You can use [`gulp-replace`](https://www.npmjs.com/package/gulp-replace) to modfiy the output, and then use within *Ember*, *Ember-Rocks*, or *Ember-Cli*:

#### gulpfile.js

```js
gulp.task('templates', function(){
  gulp.src('source/templates/*.hbs')
    .pipe(htmlbars())
    .pipe(wrap({
      deps:         ['exports'],          // dependency array
      params:       ['__exports__'],        // params for callback
      moduleRoot:   'source/templates/',
      modulePrefix: 'rocks/'
    }))
    .pipe(replace(
      /return export default/, 'return __exports__["default"] ='
    ))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('build/js/'));
});
```

## API

### htmlbars(options)

#### options.isHTMLBars
Type: `Boolean`

By default, `options.isHTMLBars` is false. It will wrap the compiled template inside *Handlebars*, ex: "Ember.Handlebars.template(...)". If true,
It will wrap the compiled template inside *HTMLBars*, ex: "Ember.HTMLBars.template(...)".

Note: When `options.isHTMLBars` is true, you need to define the template compiler function via `options.templateCompiler`

#### options.templateCompiler
Type: `Function`

By default, `options.templateCompiler` is null. It is used in conjunction with `options.isHTMLBars: true`. Each `Ember` core version (beta or stable)
will bundle the `ember-template-compiler.js` script to compile HTMLBars template. It is because the HTMLBars project is in the heavy development cycle.

Ex: `templateCompiler: require('../bower_components/ember/ember-template-compiler')`


## LICENSE

Copyright (c) 2015 [Matt Ma](http://mattmadesign.com)

gulp-htmlbars is [MIT Licensed](./LICENSE).

[npm-badge-url]: https://nodei.co/npm/gulp-htmlbars/
[npm-badge-image]: https://nodei.co/npm/gulp-htmlbars.png

[npm-url]: https://www.npmjs.org/package/gulp-htmlbars
[npm-image]: http://img.shields.io/npm/v/npm.svg

[travis-image]: https://travis-ci.org/mattma/gulp-htmlbars.svg
[travis-url]: https://travis-ci.org/mattma/gulp-htmlbars

[dependency-image]: http://img.shields.io/david/strongloop/express.svg
[dependency-url]: https://david-dm.org/mattma/gulp-htmlbars
