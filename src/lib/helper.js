'use strict';

// core modules
const path = require('path');
const childProcess = require('child_process');
// dep modules
const _ = require('lodash');
const Promise = require('bluebird');
const fs = require('fs-extra');
const stringifySafe = require('json-stringify-safe');
const tmp = require('tmp');
tmp.setGracefulCleanup();

const spawn = childProcess.spawn;

const helper = {

    ensureArray(value) {
        if (value === undefined || value === null) return;
        return _.isArray(value) ? value : [value];
    },

    getStr(value) {
        return value && value.trim() !== '' ? value : null;
    },

    normalizePath(p) {
        const first = path.normalize(p).slice(0, 1);
        if (first === '.') return p;
        if (first !== '/') return '/' + p;
        return p;
    },

    safeJsonParse(string) {
        let out;
        try {
            out = JSON.parse(string);
        } catch (e) {}
        return out;
    },

    createTempFile(source, tmpOptions) {
        const tmpOpts = _.defaults(tmpOptions, {
            mode: 0o666,
            prefix: 'jsdocx-',
            postfix: '.js',
            // use cleanupCallback if `keep` is `true` (or tmp.setGracefulCleanup())
            keep: false
        });
        return new Promise((resolve, reject) => {
            tmp.file(tmpOpts, (err, path, fd, cleanupCallback) => {
                if (err) return reject(err);
                // console.log("File: ", path);
                // console.log("Filedescriptor: ", fd);
                if (typeof source !== 'string') source = stringifySafe(source);
                fs.write(fd, source || '', 'utf8', err => { // , written, string
                    if (err) return reject(err);
                    fs.close(fd, err => {
                        if (err) return reject(err);
                        resolve({
                            path: path,
                            descriptor: fd,
                            cleanup() {
                                try {
                                    cleanupCallback();
                                } catch (e) { }
                            }
                        });
                    });
                });
            });
        });
    },

    execJSDoc(jsdocPath, args, conf) {
        if (!conf) return helper.exec(jsdocPath, args);
        // console.log(stringifySafe(conf));

        const tmpOpts = {
            mode: 0o666,
            prefix: 'jsdoc-conf-',
            postfix: '.json',
            keep: false
        };
        return helper.createTempFile(conf, tmpOpts)
            .then(file => {
                const cmdArgs = args.concat();
                cmdArgs.push('-c', file.path);
                return helper.exec(jsdocPath, cmdArgs);
            });
    },

    // write output file and return the original object.
    // `force` will create the parent directories if they don't exist.
    writeJSON(options, object) {
        let opts = options;
        if (_.isString(options)) opts = { path: options };

        opts = _.extend({
            indent: false,
            force: false
        }, opts);

        if (opts.indent === true) {
            opts.indent = 2;
        } else if (!_.isNumber(opts.indent)) {
            opts.indent = 0;
        }

        const json = !_.isString(object)
            ? JSON.stringify(object, null, opts.indent)
            : object;

        const promise = opts.force
            ? fs.ensureDir(path.dirname(opts.path))
            : Promise.resolve();

        return promise
            .then(() => fs.writeFile(opts.path, json, 'utf8'))
            .then(() => object);
    },

    // using spawn instead of execFile, since the latter has 200kb limit.
    exec(file, args) {
        const cmdArgs = (args || []).concat();
        cmdArgs.unshift(file);
        return new Promise((resolve, reject) => {
            const proc = spawn('node', cmdArgs);
            let output = '';
            let err = '';

            proc.stdout.on('data', data => {
                output += data;
            });

            proc.stderr.on('data', data => {
                err += data;
            });

            proc.on('close', code => {
                if (code !== 0 || err) return reject(new Error(err));
                resolve(output);
            });
        });

    }
};

module.exports = helper;
