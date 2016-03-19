// core modules
var path = require('path');
// dep modules
var _ = require('lodash');
// own modules
var helper = require('./lib/helper');

module.exports = (function () {

    var jsdocx = {
        path: './node_modules/jsdoc/jsdoc.js'
    };

    // ---------------------------
    // HELPERS
    // ---------------------------

    function pass(o) {
        return o;
    }

    // http://usejsdoc.org/about-commandline.html
    // http://usejsdoc.org/about-configuring-jsdoc.html
    function buildArgs(options) {
        // access, private, readme, template, etc.. These CLI options do not
        // have affect when run with --explain (-X) flag. They are for
        // jsdoc-genrated docs. access is handled within the filter method.
        var opts = _.extend({
            // files: ... // non-jsdoc option
            encoding: 'utf8',
            package: null, // path
            recurse: false,
            pedantic: false,
            query: null
            // debug: false
            // verbose: false
        }, options);

        var args = ['-X'];
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

    // we could use the `undocumented` property but it still seems buggy.
    // https://github.com/jsdoc3/jsdoc/issues/241
    // `undocumented` is omitted (`undefined`) for documented symbols.
    // return item.undocumented !== true;
    function hasDescription(item) {
        // return Boolean(getStr(item.comments));
        return Boolean(helper.getStr(item.classdesc) || helper.getStr(item.description));
    }

    function relativePath(item, rPath) {
        if (!item || !rPath) return;
        var p = item.meta && helper.getStr(item.meta.path);
        if (p) {
            item.meta.path = helper.normalizePath(path.relative(p, rPath));
        }
    }

    function normalizeAccess(access) {
        // ['public', 'protected', 'private'];
        if (access === 'all') return access; // all
        if (!_.isString(access) && !_.isArray(access)) {
            return ['public', 'protected'];
        }
        return helper.ensureArray(access);
    }

    function filter(docs, options) {
        if (!options) return docs;
        docs = helper.ensureArray(docs);

        options = _.extend({
            access: undefined,
            package: true,
            module: true,
            undocumented: true,
            undescribed: true,
            relativePath: null,
            filter: null
        }, options);

        var access = normalizeAccess(options.access),
            userFilter = _.isFunction(options.filter)
                ? options.filter
                : pass;

        var undoc, undesc, pkg, mdl, acc, o;
        return _.reduce(docs, function (memo, item) {
            undoc = options.undocumented || item.undocumented !== true;
            undesc = options.undescribed || hasDescription(item);
            pkg = options.package || item.kind !== 'package';
            mdl = options.module || item.longname !== 'module.exports';
            // access might not be explicitly set for the item.
            // in this case, we'll include the item.
            acc = access === 'all' || !item.access || access.indexOf(item.access) >= 0;
            if (undoc && undesc && pkg && mdl && acc) {
                relativePath(item, options.relativePath);
                o = userFilter(item);
                if (_.isPlainObject(o)) {
                    memo.push(o); // filtered item pushed
                } else if (o) { // boolean check
                    memo.push(item); // original item pushed
                }
            }
            return memo;
        }, []);
    }

    // ---------------------------
    // PUBLIC METHODS
    // ---------------------------

    /**
     * Executes the `jsdoc` command and parses the output into a Javascript
     * object/array; with the specified options.
     *
     * @param {Object|String|Array} options - Required.
     * Either an options object or one or more source files to be processed.
     * See documentation for details.
     * @param {Function} callback - Optional. Callback function to be executed
     * in the following signature: function (err, array) { ... }`
     * Omit this callback to return a `Promise`.
     *
     * @returns {void|Promise} - Returns a `Promise` if `callback` is omitted.
     */
    jsdocx.parse = function (options, callback) {
        var opts = !_.isPlainObject(options)
            ? { files: options }
            : options;
        opts.files = opts.files || opts.file;

        if (!_.isString(opts.files) && !_.isArray(opts.files) && opts.files.length === 0) {
            throw new Error(helper.ERR.SOURCE);
        }

        var args = buildArgs(opts);
        return helper.exec(jsdocx.path, args)
            .then(function (json) {
                var docs = helper.safeJsonParse(json);
                if (!docs) {
                    throw new Error(helper.ERR.INVALID_OUTPUT);
                }
                docs = filter(docs, opts);
                if (options.output) {
                    return helper.writeJSON(options.output, docs);
                }
                return docs;
            })
            .catch(function (err) {
                // jsdoc err might not be very useful when some arguments are
                // invalid. so, we'll prepend the full command, in case of an
                // error and re-throw.
                var cmd = 'jsdoc ' + args.join(' ');
                err.message = err.message + ' \nExecuted JSDoc Command: ' + cmd;
                throw err;
            })
            .nodeify(callback);
    };

    // ---------------------------

    return jsdocx;

})();
