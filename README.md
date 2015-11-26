gulp-yuidoc-filter-tags
=======================

Gulp plugin for yuidoc that makes it possible to filter out parts of the documentation.

This plugin is based on [yuidoc-filter-tags](https://github.com/limikael/yuidoc-filter-tags). 
It solves the problem that the original does not play well with [gulp-yuidoc](https://github.com/jsBoot/gulp-yuidoc).

-------------

## Install

Install `gulp-yuidoc-filter-tags` as a development dependency:

```shell
npm install --save-dev gulp-yuidoc-filter-tags
```

## Usage

Then, add it to your `gulpfile.js`:

```javascript
var yuidoc = require("gulp-yuidoc");
var yuidocFilterTags = require("gulp-yuidoc-filter-tags");

// exclude comments with 'notthis' or 'notthat' tags 
gulp.src("./src/*.js")
    .pipe( yuidoc.parser() )
    .pipe( yuidocFilterTags({ exclude : ['notthis', 'notthat'] }) )
    .pipe( yuidoc.generator() )
    .pipe( gulp.dest('./docs') );
    
// include only comments with 'onlythis' or 'onlythat' tags
gulp.src("./src/*.js")
    .pipe( yuidoc.parser() )
    .pipe( yuidocFilterTags({ exclude : ['onlythis', 'onlythat'] }) )
    .pipe( yuidoc.generator() )
    .pipe( gulp.dest('./docs') );
```

## API

### yuidocFilterTags(options)

Pipe the call to `yuidocFilterTags()` between the `yuidoc.parser()` and `yuidoc.generator`.

## Options

### include

Array of yuidoc comment tags. Only comments containing these tags will be included in the output docs.

### exclude

Array of yuidoc comment tags. Comments containing these tags will NOT be included in the output docs.

### custom 

Array of yuidoc comment tags. Allows adding custom tags so that yuidoc will not throw warnings.
Note that yuidoc will not warn about tags appearing in `include` and `exclude` either. `custom`'s only function is to suppress warnings on custom tags.
