/**
 * Gulp ContentToVariable will take content of files and make them available in a JS variable.
 * This can be used when creating inline workers. 
 * For an example, see here - https://blog.raananweber.com/2015/05/30/web-worker-without-a-separate-file/
 */

var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var path = require('path');
var File = gutil.File;

// Consts
const PLUGIN_NAME = 'gulp-contentToVariable';

/**
 * options: {
 *  variableName : string - the name of the variable that will be created.
 *  asMap : boolean (default: false) - should the content be delivered as one single string, or should the content b delivered as a map. Keys are set using the namingCallback
 *  namingCallback : function(filename) , optional - used when a map is returned. executed on each file to transform its filename. defaults to the filename.
 * }
 */

var contentToVariable = function(options) {

    var content;
    var firstFile;

    options.namingCallback = options.namingCallback || function (filename) { return filename; };

    function bufferContents(file, enc, cb) {
        // ignore empty files
        if (file.isNull()) {
            cb();
            return;
        }

        // no stream support, only files.
        if (file.isStream()) {
            this.emit('error', new PluginError('gulp-contentToVariable', 'Streaming not supported'));
            cb();
            return;
        }

        // set first file if not already set
        if (!firstFile) {
            firstFile = file;
        }

        // construct concat instance
        if (!content) {
            content = options.asMap ? {} : "";
        }
        // add file to concat instance
        if (options.asMap) {
            var name = options.namingCallback(file.relative);

            content[name] = file.contents.toString();
        } else {
            content += file.contents.toString();
        }
        cb();
    }

    function endStream(cb) {
        if (!firstFile || !content) {
            cb();
            return;
        }


        var joinedPath = path.join(firstFile.base, options.variableName);

        var joinedFile = new File({
            cwd: firstFile.cwd,
            base: firstFile.base,
            path: joinedPath,
            contents: new Buffer(options.variableName + '=' + JSON.stringify(content) + ';')
        });

        this.push(joinedFile);


        cb();
    }

    return through.obj(bufferContents, endStream);

}

module.exports = contentToVariable;