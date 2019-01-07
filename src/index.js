'use strict';

// core modules
const path = require('path');
// dep modules
const fs = require('fs-extra');
const _ = require('lodash');
const Promise = require('bluebird');
const glob = Promise.promisify(require('glob'));
// own modules
const helper = require('./lib/helper');
const utils = require('./lib/utils');
const sorter = require('./lib/sorter');

const ERR_SOURCE = 'Cannot process missing or invalid input files, or source code.';

/**
 *  Parser for outputting a Javascript object from documented code via JSDoc's
 *  explain (-X) command.
 *  @namespace
 */
const jsdocx = {};

// if the dependent project has jsdoc dependency, ours will not be
// installed. and since we don't use the jsdoc module via require but a
// specific file (jsdoc.js), we cannot be sure of its location. this method
// will try to find it if exists.
const jsdocjs = 'jsdoc/jsdoc.js';
try {
    const local = path.join('..', 'node_modules', jsdocjs);
    if (fs.pathExistsSync(local)) {
        jsdocx.path = local;
    } else {
        // Use the internal require() machinery to look up the location
        // of a module, but rather than loading the module, just return
        // the resolved filename.
        jsdocx.path = require.resolve(jsdocjs);
        // jsdoc module does not expose a main file. so instead of
        // require.resolve('jsdoc') - which will fail; we'll look for
        // 'jsdoc/jsdoc.js'.

        // for example, if the parent project has it, we'll get:
        // /path/to/parent-project/node_modules/jsdoc/jsdoc.js
    }
} catch (e) {
    throw new Error('Could not find jsdoc module.');
}

// ---------------------------
// HELPERS
// ---------------------------

function identity(o) {
    return o;
}

// http://usejsdoc.org/about-commandline.html
// http://usejsdoc.org/about-configuring-jsdoc.html
function buildArgs(options) {
    // access, private, readme, template, etc.. These CLI options do not
    // have affect when run with --explain (-X) flag. They are for
    // jsdoc-genrated docs. access is handled within the filter method.
    const opts = _.defaults(options, {
        // files: ... // non-jsdoc option
        encoding: 'utf8',
        package: null, // path
        recurse: false,
        pedantic: false,
        query: null
        // debug: false
        // verbose: false
    });

    let args = ['-X'];
    args = args.concat(helper.ensureArray(opts.files));
    args.push('-e', opts.encoding);
    if (_.isString(opts.package)) {
        args.push('-P', opts.package);
    }
    if (opts.recurse) args.push('-r');
    if (opts.pedantic) args.push('--pedantic');
    if (opts.query) args.push('-q', opts.query);
    // if (opts.debug) args.push('--debug');
    // if (opts.verbose) args.push('--verbose');
    return args;
}

// Builds the configuration object for JSDoc. JSDoc takes a filepath for
// configuration (-c command). So we need to create a temp JSON file. This
// function creates the conf object to be written to that temp file before
// passing to jsdoc as a command line argument.
function buildConf(options) {
    let opts = options || {};

    // updating default JSDoc configuration.
    // see http://usejsdoc.org/about-configuring-jsdoc.html
    return {
        tags: {
            allowUnknownTags: typeof opts.allowUnknownTags === 'boolean'
                ? opts.allowUnknownTags
                : true,
            dictionaries: !Array.isArray(opts.dictionaries)
                ? ['jsdoc', 'closure']
                : opts.dictionaries
        },
        source: {
            includePattern: opts.includePattern || '.+\\.js(doc|x)?$',
            excludePattern: opts.excludePattern || '(^|\\/|\\\\)_'
        },
        plugins: !Array.isArray(opts.plugins) ? [] : opts.plugins,
        templates: {
            cleverLinks: false,
            monospaceLinks: false
        }
    };
}

function relativePath(symbol, rPath) {
    if (!symbol || !rPath) return;
    var p = symbol.meta && helper.getStr(symbol.meta.path);
    if (p) {
        symbol.meta.path = helper.normalizePath(path.relative(p, rPath));
    }
}

function normalizeAccess(access) {
    // ['public', 'protected', 'private', 'package']
    if (access === 'all') return access; // 'all'
    if (!_.isString(access) && !_.isArray(access)) {
        return ['public', 'protected'];
    }
    return helper.ensureArray(access);
}

// sorts documentation symbols and properties of each symbol, if any.
function sortDocs(docs, sortType) {
    if (!sortType) return;
    const fnSorter = sorter.getSymbolsComparer(sortType, '$longname');
    const fnPropSorter = sorter.getSymbolsComparer(sortType, 'name');
    docs.sort(fnSorter);
    docs.forEach(symbol => {
        if (symbol && Array.isArray(symbol.properties)) {
            symbol.properties.sort(fnPropSorter);
        }
    });
}

function hierarchy(docs, sortType) {
    let parent;
    const fnSorter = sorter.getSymbolsComparer(sortType, '$longname');
    // properties should be sorted alphabetically since they don't have kind or
    // scope. (they only have types.)
    const fnPropSorter = sorter.getSymbolsComparer('alphabetic', 'name');
    _.eachRight(docs, (symbol, index) => {
        // Move constructor (method definition) to class declaration symbol
        if (utils.isConstructor(symbol)) {
            parent = _.find(docs, o => {
                return o.$longname === symbol.$longname && utils.isClass(o);
            });
            if (parent) {
                parent.$constructor = symbol;
                docs.splice(index, 1);
            }
        // otherwise, move symbols with memberof property to corresponding parent member.
        } else if (symbol.memberof && symbol.longname !== 'module.exports') {
            // first check and sort if it has properties
            if (fnPropSorter && Array.isArray(symbol.properties)) {
                symbol.properties.sort(fnPropSorter);
            }

            parent = _.find(docs, sym => {
                return utils._cleanName(sym.longname) === utils._cleanName(symbol.memberof);
            });
            // parent cannot be constructor
            if (parent && !utils.isConstructor(parent)) {
                parent.$members = parent.$members || [];
                parent.$members.push(symbol);
                if (fnSorter) {
                    parent.$members.sort(fnSorter);
                } else {
                    // reverse bec. we used eachRight
                    parent.$members.reverse();
                }
                docs.splice(index, 1);
            }
        }
    });
    if (fnSorter) docs.sort(fnSorter);
    return docs;
}

function promiseGlobFiles(globs) {
    globs = helper.ensureArray(globs);
    return Promise.reduce(globs, (memo, pattern) => {
        return glob(pattern).then(paths => memo.concat(paths));
    }, []);
}

// ---------------------------
// PUBLIC METHODS
// ---------------------------

/**
 *  Filters the parsed documentation output array.
 *
 *  @param {Array} docs - Documentation output array.
 *  @param {Object|Function} [options] - Filter options.
 *  @param {Function|String} [predicate] - The function invoked per iteration.
 *  Returning a falsy value will remove the symbol from the output. Returning
 *  true will keep the original symbol. To keep the symbol and alter its
 *  contents, simply return an altered symbol object. If a RegExp string is
 *  passed, it will be executed on symbol's long name.
 *
 *  @returns {Array} - Filtered documentation array.
 */
jsdocx.filter = (docs, options, predicate) => {
    if (!options && !predicate) return docs;
    if (!predicate && _.isFunction(options)) {
        predicate = options;
        options = {};
    }

    if (_.isString(predicate)) {
        const re = new RegExp(String(predicate));
        predicate = symbol => re.test(symbol.longname);
    } else if (!_.isFunction(predicate)) {
        predicate = identity;
    }

    docs = helper.ensureArray(docs);

    options = _.defaults(options, {
        access: undefined,
        package: true,
        module: true,
        undocumented: true,
        undescribed: true,
        ignored: true,
        hierarchy: false,
        sort: false, // (true|"alphabetic")|"grouped"|false
        relativePath: null
    });

    const access = normalizeAccess(options.access);
    let isCon, undoc, undesc, pkg, mdl, acc, ignored, o;
    docs = _.reduce(docs, (memo, symbol) => {
        // console.log(symbol.longname, symbol.kind, symbol.access, symbol.meta ? symbol.meta.code.type : '');

        // JSDoc overwrites the `longname` and `name` of the symbol, if it
        // has an alias. See https://github.com/jsdoc3/jsdoc/issues/1217 and
        // documentation of jsdocx.utils.getFullName()
        symbol.$longname = utils.getLongName(symbol);
        // i.e.JSDoc generates a constructor's kind as `"class"`. This will
        // set it as `"constructor"`. See getKind() method.
        symbol.$kind = utils.getKind(symbol);

        undoc = options.undocumented || symbol.undocumented !== true;
        undesc = options.undescribed || utils.hasDescription(symbol);
        pkg = options.package || symbol.kind !== 'package';
        mdl = options.module || symbol.longname !== 'module.exports';
        ignored = options.ignored || symbol.ignore !== true;
        // access might not be explicitly set for the symbol.
        // in this case, we'll include the symbol.
        acc = access === 'all' || !symbol.access || access.indexOf(symbol.access) >= 0;
        // constructor symbol is undocumented=true even if it's documented
        isCon = acc && utils.isConstructor(symbol);
        if (isCon || (undoc && undesc && pkg && mdl && acc && ignored)) {
            relativePath(symbol, options.relativePath);
            o = predicate(symbol);
            if (_.isPlainObject(o)) {
                memo.push(o); // filtered symbol pushed
            } else if (o) { // boolean check
                memo.push(symbol); // original symbol pushed
            }
        }
        return memo;
    }, []);

    if (options.hierarchy) {
        docs = hierarchy(docs, options.sort);
    } else if (options.sort) {
        sortDocs(docs, options.sort);
    }
    return docs;
};

/**
 * Executes the `jsdoc` command and parses the output into a Javascript
 * object/array; with the specified options.
 *
 * @param {Object|String|Array} options - Either an options object or one
 * or more source files to be processed.
 * @param {Function} [callback] - Callback function to be executed
 * in the following signature: function (err, array) { ... }`
 * Omit this callback to return a `Promise`.
 *
 * @returns {void|Promise} - Returns a `Promise` if `callback` is omitted.
 */
jsdocx.parse = (options, callback) => {
    if (!options) throw new Error(ERR_SOURCE);
    const opts = !_.isPlainObject(options)
        ? { files: options }
        : options;
    opts.files = opts.files || opts.file;
    const debug = opts.debug === undefined ? true : opts.debug;

    let args, conf;
    const hasFiles = _.isString(opts.files) || (_.isArray(opts.files) && opts.files.length > 0);
    const hasSource = _.isString(opts.source);

    if (!hasFiles && !hasSource) throw new Error(ERR_SOURCE);

    // let cleanupTemp;
    return Promise.resolve()
        .then(() => {
            if (hasFiles) {
                // expand glob patterns in opts.files array, if any
                return promiseGlobFiles(opts.files)
                    .then(files => {
                        opts.files = files;
                        return opts;
                    });
            }
            if (hasSource) {
                return helper.createTempFile(opts.source)
                    .then(file => {
                        opts.files = [file.path];
                        // cleanupTemp = file.cleanup;
                        return opts;
                    });
            }
        })
        .then(opts => {
            args = buildArgs(opts);
            conf = buildConf(opts);
            // return helper.exec(jsdocx.path, args);
            return helper.execJSDoc(jsdocx.path, args, conf);
        })
        .then(json => {
            var docs = helper.safeJsonParse(json);
            if (!docs) throw new Error('Output: ' + json);
            docs = jsdocx.filter(docs, opts, opts.predicate || opts.filter);
            if (options.output) {
                return helper.writeJSON(options.output, docs);
            }
            return docs;
        })
        .catch(err => {
            if (debug) {
                // jsdoc err might not be very useful when some arguments are
                // invalid. so, we'll prepend the full command, in case of an
                // error and re-throw.
                const cmd = 'jsdoc ' + args.join(' ');
                err.message = err.message + ' \nExecuted JSDoc Command: ' + cmd + '\n'
                    + 'with JSON configuration: ' + JSON.stringify(conf || {});
            }
            throw err;
        })
        .nodeify(callback);
};

jsdocx.utils = utils;
module.exports = jsdocx;
