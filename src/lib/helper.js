/* eslint camelcase:0 */

// core modules
var path = require('path'),
    child_process = require('child_process');
// dep modules
var _ = require('lodash'),
    Promise = require('bluebird'),
    fs = require('fs-extra'),
    tmp = require('tmp');

module.exports = (function () {

    var helper = {},
        spawn = child_process.spawn,
        promiseWriteFile = Promise.promisify(fs.writeFile),
        promiseEnsureDir = Promise.promisify(fs.ensureDir);

    var ERR = {
        SOURCE: 'There are no input files or source code to process.',
        INVALID_OUTPUT: 'Could not parse invalid output.'
    };
    helper.ERR = ERR;

    helper.ensureArray = function (value) {
        if (value === undefined || value === null) return;
        return _.isArray(value) ? value : [value];
    };

    helper.getStr = function (value) {
        return value && value.trim() !== '' ? value : null;
    };

    helper.normalizePath = function (p) {
        var first = path.normalize(p).slice(0, 1);
        if (first === '.') return p;
        if (first !== '/') return '/' + p;
        return p;
    };

    helper.safeJsonParse = function (string) {
        var out;
        try {
            out = JSON.parse(string);
        } catch (e) {}
        return out;
    };

    helper.createTempSource = function (source) {
        var tmpOpts = {
            mode: 0o666,
            prefix: 'jsdocx-',
            postfix: '.js',
            // use cleanupCallback if `keep` is `true`
            keep: false
        };
        return new Promise(function (resolve, reject) {
            tmp.file(tmpOpts, function _tempFileCreated(err, path, fd, cleanupCallback) {
                if (err) return reject(err);
                // console.log("File: ", path);
                // console.log("Filedescriptor: ", fd);
                fs.write(fd, source || '', 'utf8', function (err, written, string) {
                    if (err) return reject(err);
                    fs.close(fd, function (err) {
                        if (err) return reject(err);
                        resolve({
                            path: path,
                            descriptor: fd,
                            cleanup: cleanupCallback
                        });
                    });
                });
            });
        });
    };

    // write output file and return the original object.
    // `force` will create the parent directories if they don't exist.
    helper.writeJSON = function (options, object) {
        var opts = options;
        if (_.isString(options)) {
            opts = { path: options };
        }

        opts = _.extend({
            indent: false,
            force: false
        }, opts);

        if (opts.indent === true) {
            opts.indent = 2;
        } else if (!_.isNumber(opts.indent)) {
            opts.indent = 0;
        }

        var json = !_.isString(object)
            ? JSON.stringify(object, null, opts.indent)
            : object;

        var promise = opts.force
            ? promiseEnsureDir(path.dirname(opts.path))
            : Promise.resolve();

        return promise
            .then(function () {
                return promiseWriteFile(opts.path, json, 'utf8');
            })
            .then(function () {
                return object;
            });
    };

    // fs.exists does not conform with the Node callback signature e.g.
    // `function (err, result) {...}`. so we promisify this manually.
    helper.exists = function (filePath) {
        return new Promise(function (resolve, reject) {
            fs.exists(filePath, function (exists) {
                resolve(exists);
            });
        });
    };

    // using spawn instead of execFile, since the latter has 200kb limit.
    helper.exec = function (file, args) {
        var cmdArgs = (args || []).concat();
        cmdArgs.unshift(file);
        return new Promise(function (resolve, reject) {
            var proc = spawn('node', cmdArgs),
                output = '',
                err = '';

            proc.stdout.on('data', function (data) {
                output += data;
            });

            proc.stderr.on('data', function (data) {
                err += data;
            });

            proc.on('close', function (code) {
                // console.log(`child process exited with code ${code}`);
                if (code !== 0 || err) {
                    return reject(new Error(err));
                }
                if (output.indexOf(' no input ') >= 0) {
                    return reject(new Error(helper.ERR.SOURCE));
                }
                resolve(output);
            });
        });

    };

    // ---------------------------

    return helper;

})();
