(function () {

    // core modules
    var path = require('path');
    // dep modules
    var _ = require('lodash');
    // own modules
    var jsdocx = require('../src/index'),
        helper = require('../src/lib/helper');

    describe('Parser Suite', function () {
        var options;

        // beforeAll(function () {});

        it('should throw on invalid source file(s)', function (done) {
            console.log('options', options);
            var throwTest = function () {
                try {
                    jsdocx.parse(options).finally(done);
                } catch (e) {
                    done();
                }
            };
            expect(throwTest).toThrow();
        });

        it('should parse file (options 1)', function (done) {
            options = {
                files: './test/input',
                encoding: 'utf8',
                recurse: false,
                pedantic: false,
                access: null,
                package: null,
                module: true,
                undocumented: true,
                undescribed: true,
                relativePath: null,
                filter: null
            };
            jsdocx.parse(options)
                .then(function (docs) {
                    expect(docs).toEqual(jasmine.any(Array));
                    var result = _.filter(docs, { undocumented: true });
                    expect(result.length).toBeGreaterThan(0);
                    result = _.find(docs, { longname: 'module.exports' });
                    expect(result).toBeDefined();
                    result = _.find(docs, { kind: 'package' });
                    expect(result).toBeUndefined();
                })
                .catch(function (err) {
                    expect(Boolean(err)).toEqual(false);
                    console.log(err.stack || err);
                })
                .finally(done);
        });

        it('should parse file (options 2)', function (done) {
            options = {
                files: './test/input/code.es6.js',
                access: null,
                package: './test/input/package.json',
                module: false,
                undocumented: false,
                undescribed: false,
                relativePath: path.join(__dirname, '../code'),
                filter: null
            };
            jsdocx.parse(options)
                .then(function (docs) {
                    expect(docs).toEqual(jasmine.any(Array));
                    var result = _.filter(docs, { undocumented: true });
                    expect(result.length).toEqual(1); // constructor is marked undocumented
                    result = _.find(docs, { longname: 'module.exports' });
                    expect(result).toBeUndefined();
                    result = _.find(docs, { kind: 'kind' });
                    expect(result).toBeUndefined();
                })
                .catch(function (err) {
                    expect(Boolean(err)).toEqual(false);
                    console.log(err.stack || err);
                })
                .finally(done);
        });

        it('should parse multiple files', function (done) {
            options = {
                files: ['./test/input/code.es6.js', './test/input/test2.es6.js'],
                encoding: 'utf8',
                recurse: false,
                pedantic: false,
                access: null,
                package: null,
                module: true,
                undocumented: true,
                undescribed: true,
                relativePath: null,
                filter: null
            };
            jsdocx.parse(options)
                .then(function (docs) {
                    expect(docs).toEqual(jasmine.any(Array));
                    var result = _.filter(docs, { meta: { filename: 'code.es6.js' } });
                    expect(result.length).toBeGreaterThan(0);
                    result = _.filter(docs, { meta: { filename: 'test2.es6.js' } });
                    expect(result.length).toBeGreaterThan(0);
                })
                .catch(function (err) {
                    expect(Boolean(err)).toEqual(false);
                    console.log(err.stack || err);
                })
                .finally(done);
        });

        it('should parse source code', function (done) {
            options.files = null;
            options.source = '/**\n *  describe\n *  @namespace\n *  @type {Object}\n */\nconst nspace = {};\nclass Test { constructor() {} }';
            jsdocx.parse(options)
                .then(function (docs) {
                    // console.log(docs);
                    expect(docs).toEqual(jasmine.any(Array));
                    var nspace = _.find(docs, { longname: 'nspace' });
                    expect(nspace).toBeDefined();
                    var testClass = _.find(docs, { longname: 'Test' });
                    expect(testClass).toBeDefined();
                })
                .catch(function (err) {
                    console.log(err);
                    expect(Boolean(err)).toEqual(false);
                })
                .finally(done);
        });

        it('should fail to create output file', function (done) {
            // non-existing dir and `force` is not set
            options.output = './test/non-existing-dir/docs.json';
            jsdocx.parse(options)
                .catch(function (err) {
                    expect(Boolean(err)).toEqual(true);
                })
                .finally(done);
        });

        it('should create output file', function (done) {
            options.output = {
                path: './test/output/docs.json',
                force: true,
                indent: true
            };
            jsdocx.parse(options)
                .then(function (docs) {
                    expect(docs).toEqual(jasmine.any(Array));
                    return helper.exists(options.output.path);
                })
                .then(function (exists) {
                    expect(exists).toEqual(true);
                })
                .catch(function (err) {
                    expect(Boolean(err)).toEqual(false);
                    console.log(err.stack || err);
                })
                .finally(done);
        });

    });

})();
