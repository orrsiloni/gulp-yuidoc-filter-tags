/**
 * Gulp plugin to filter YUIDoc tags.
 *
 * I wrote this plugin since the YUIDoc preprocessor on which it's based did not work with gulp-yuidoc (https://github.com/jsBoot/gulp-yuidoc).
 *
 * Based on https://github.com/limikael/yuidoc-filter-tags by https://github.com/limikael
 */

// through2 is a thin wrapper around node transform streams
var through = require('through2');

/** @namespace options.include */
/** @namespace options.exclude */

function shouldKeepItem(item, options) {
    var i;
    if (options.include) {
        var include = [].concat(options.include);
        for (i = 0; i < include.length; i++) {
            if (item.hasOwnProperty(include[i]))
                return true;
        }
        return false;
    }

    if (options.exclude) {
        var exclude = [].concat(options.exclude);

        for (i = 0; i < exclude.length; i++) {
            if (item.hasOwnProperty(exclude[i]))
                return false;
        }
        return true;
    }

    return true;
}

function YUIDocFilterTags(options) {
    // Creating a stream through which each file will pass
    return through.obj(function(file, enc, cb) {
        if (file.isNull()) {
            // return empty file
            return cb(null, file);
        }

        var str;
        if (file.isBuffer()) {
            str = file.contents.toString();
        }
        if (file.isStream()) {
            str = file.contents;
        }

        var data = JSON.parse(str);

        console.log("Filtering YIDOC tags...");

        if (options.include)
            console.log("Including only items with the tags: " + [].concat(options.include));

        if (options.exclude)
            console.log("Excluding items with the tags: " + [].concat(options.exclude));

        if (options.custom)
            console.log("Adding custom tags: " + [].concat(options.exclude));

        var allTags = [];

        if (options.include)
            allTags = allTags.concat(options.include);

        if (options.exclude)
            allTags = allTags.concat(options.exclude);

        if (options.custom)
            allTags = allTags.concat(options.custom);

        var acceptedWarnings = [];

        for (var t in allTags) {
            if (!allTags.hasOwnProperty(t)) continue;
            acceptedWarnings.push("unknown tag: " + allTags[t]);
        }

        var keepWarnings = [];

        for (var w in data.warnings) {
            if (!data.warnings.hasOwnProperty(w)) continue;
            if (acceptedWarnings.indexOf(data.warnings[w].message) < 0)
                keepWarnings.push(data.warnings[w]);
        }

        data.warnings = keepWarnings;

        var keepClasses = {};

        for (var c in data.classes) {
            if (!data.classes.hasOwnProperty(c)) continue;
            if (shouldKeepItem(data.classes[c], options))
                keepClasses[c] = data.classes[c];
        }

        data.classes = keepClasses;

        var keepItems = [];

        for (var i in data.classitems) {
            if (!data.classitems.hasOwnProperty(i)) continue;
            if (shouldKeepItem(data.classitems[i], options))
                keepItems.push(data.classitems[i])
        }

        data.classitems = keepItems;

        file.contents = new Buffer(JSON.stringify(data));

        cb(null, file);
    });
}

// Exporting the plugin main function
module.exports = YUIDocFilterTags;
