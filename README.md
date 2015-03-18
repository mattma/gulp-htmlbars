# gulp-htmlbars

[![NPM][npm-badge-image]][npm-badge-url]

[![Build Status][travis-image]][travis-url]  [![NPM version][npm-image]][npm-url]  [![NPM download](http://img.shields.io/npm/dm/gulp-htmlbars.svg?style=flat)](https://www.npmjs.org/package/gulp-htmlbars)  [![Dependency Status][dependency-image]][dependency-url]

[![Code Climate][code-climate-image]][code-climate-url] [![Test Coverage][coverage-image]][coverage-url]

## Warning

This repo is going to be deprecated and merged its features into [gulp-handlebars](https://github.com/lazd/gulp-handlebars). At the same time, I would be joining as a maintainer of [gulp-handlebars](https://github.com/lazd/gulp-handlebars) repository along with [lzad](https://github.com/lazd). Migration should be done by the **end of March, 2015**.

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

## Compiling *htmlbars* templates for the browser. (**AMD format**)

#### gulpfile.js

```js
gulp.task('templates', function(){
  gulp.src('source/templates/*.hbs')
    .pipe(htmlbars({
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
      .pipe(htmlbars({
        templateCompiler: require('../bower_components/ember/ember-template-compiler')
      }))
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

## Test

Before running the tests, need to run `bower install` at the root level, to have an `Ember` package in the local directory ("./bower_components").
**HTMLBars** is in a heavy development along with `Ember` project, each `Ember` release (Beta or Stable) will ship its bundled compiler for specific `Ember` version.

Once you have the `Ember-template-compiler` dependency ready, you could run

```bash
npm test  # kick start your local tests
```

## API

### htmlbars(options)

#### options.templateCompiler [required]
Type: `Function`
Default: null

The file path of `ember-template-compiler` script which bundled with each version of Ember.js. Each `Ember` core version (beta or stable) will bundle the `ember-template-compiler.js` script to compile HTMLBars template.

Ex: `templateCompiler: require('../bower_components/ember/ember-template-compiler')`

## LICENSE

Copyright (c) 2015 [Matt Ma](http://mattmadesign.com)

gulp-htmlbars is [MIT Licensed](./LICENSE.md).

[npm-badge-url]: https://nodei.co/npm/gulp-htmlbars/
[npm-badge-image]: https://nodei.co/npm/gulp-htmlbars.png

[npm-url]: https://www.npmjs.org/package/gulp-htmlbars
[npm-image]: http://img.shields.io/npm/v/npm.svg

[travis-image]: https://travis-ci.org/mattma/gulp-htmlbars.svg
[travis-url]: https://travis-ci.org/mattma/gulp-htmlbars

[dependency-image]: http://img.shields.io/david/strongloop/express.svg
[dependency-url]: https://david-dm.org/mattma/gulp-htmlbars

[code-climate-image]: https://codeclimate.com/github/mattma/gulp-htmlbars/badges/gpa.svg
[code-climate-url]: https://codeclimate.com/github/mattma/gulp-htmlbars

[coverage-image]: https://codeclimate.com/github/mattma/gulp-htmlbars/badges/coverage.svg
[coverage-url]: https://codeclimate.com/github/mattma/gulp-htmlbars
