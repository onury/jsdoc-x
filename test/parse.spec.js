'use strict';

// core modules
const path = require('path');
// dep modules
const _ = require('lodash');
const fs = require('fs-extra');
// own modules
const jsdocx = require('../src/index');
// const utils = require('../src/lib/utils');

describe('Test: Parser', () => {
    let options;
    const JS_SOURCE = '/**\n *  describe\n *  @namespace\n *  @type {Object}\n */\nconst nspace = {};\nclass Test { constructor() {} }';

    // beforeAll(function () {});

    it('should throw on invalid options/source', () => {
        function throwTest() {
            jsdocx.parse(undefined);
        }
        expect(throwTest).toThrow();
    });

    it('should parse file (options 1)', done => {
        options = {
            files: './test/input-parse',
            encoding: 'utf8',
            recurse: false,
            pedantic: false,
            access: null,
            package: null,
            module: true,
            undocumented: true,
            undescribed: true,
            ignored: false,
            relativePath: null,
            filter: null
        };
        jsdocx.parse(options)
            .then(docs => {
                // console.log(JSON.stringify(docs, null, '  '));
                expect(docs).toEqual(jasmine.any(Array));
                let result = _.filter(docs, { undocumented: true });
                expect(result.length).toBeGreaterThan(0);
                result = _.find(docs, { longname: 'module.exports' });
                expect(result).toBeDefined();
                result = _.find(docs, { kind: 'package' });
                expect(result).toBeUndefined();
                result = _.find(docs, { longname: 'Code.ignored' });
                expect(result).toBeUndefined();
            })
            .catch(err => {
                expect(Boolean(err)).toEqual(false);
                console.log(err.stack || err);
            })
            .finally(done);
    });

    it('should parse file (options 2)', done => {
        options = {
            files: './test/input-parse/code.es6.js',
            access: null,
            package: './test/input-parse/package.json',
            module: false,
            undocumented: false,
            undescribed: false,
            relativePath: path.join(__dirname, '../code')
        };
        jsdocx.parse(options)
            .then(docs => {
                expect(docs).toEqual(jasmine.any(Array));
                let result = _.filter(docs, { undocumented: true });
                expect(result.length).toEqual(1); // constructor is marked undocumented
                result = _.find(docs, { longname: 'module.exports' });
                expect(result).toBeUndefined();
                result = _.find(docs, { kind: 'kind' });
                expect(result).toBeUndefined();
            })
            .catch(err => {
                expect(Boolean(err)).toEqual(false);
                console.log(err.stack || err);
            })
            .finally(done);
    });

    it('should parse multiple files', done => {
        options = {
            files: [
                './test/input-parse/**/*.js'
            ],
            encoding: 'utf8',
            recurse: false,
            pedantic: false,
            access: null,
            package: null,
            module: true,
            undocumented: true,
            undescribed: true,
            relativePath: null,
            // filter: symbol => symbol.name !== 'ignoredByPredicate',
            filter: '^((?!(ignoredByPredicate)).)*$',
            output: {
                path: './test/output/docs-multiple-files.json',
                indent: true
            }
        };
        jsdocx.parse(options)
            .then(docs => {
                expect(docs).toEqual(jasmine.any(Array));
                let result;
                result = _.filter(docs, { meta: { filename: 'code.es6.js' } });
                expect(result.length).toBeGreaterThan(0);
                result = _.filter(docs, { meta: { filename: 'test2.es6.js' } });
                expect(result.length).toBeGreaterThan(0);
                result = _.filter(docs, { meta: { filename: 'test3.es5.js' } });
                expect(result.length).toBeGreaterThan(0);
                result = _.find(docs, { name: 'ignoredByPredicate' });
                expect(result).toBeUndefined();
            })
            .catch(err => {
                expect(Boolean(err)).toEqual(false);
                console.log(err.stack || err);
            })
            .finally(done);
    });

    it('should parse source code and output', done => {
        options.files = null;
        options.source = JS_SOURCE;
        options.output = {
            path: './test/output/docs-from-source.json',
            force: true,
            indent: true
        };
        jsdocx.parse(options)
            .then(docs => {
                // console.log(docs);
                expect(docs).toEqual(jasmine.any(Array));
                const nspace = _.find(docs, { longname: 'nspace' });
                expect(nspace).toBeDefined();
                const testClass = _.find(docs, { longname: 'Test' });
                expect(testClass).toBeDefined();
                return fs.pathExists(options.output.path);
            })
            .then(exists => {
                expect(exists).toEqual(true);
            })
            .catch(err => {
                expect(Boolean(err)).toEqual(false);
                console.log(err.stack || err);
            })
            .finally(done);
    });

    it('should fail to create output file', done => {
        // non-existing dir and `force` is not set
        options.output = './test/non-existing-dir/docs.json';
        jsdocx.parse(options)
            .catch(err => {
                expect(Boolean(err)).toEqual(true);
            })
            .finally(done);
    });

    it('should mark @hideconstructor, document ES2015 code', done => {
        options = {
            files: './test/input-parse/test4.es6.js',
            output: {
                path: './test/output/docs-test4.json',
                indent: true
            },
            access: null,
            package: './test/input-parse/package.json',
            module: false,
            undocumented: false,
            undescribed: false,
            relativePath: path.join(__dirname, '../code'),
            filter: null
        };
        jsdocx.parse(options)
            .then(docs => {
                expect(docs).toEqual(jasmine.any(Array));
                let result = _.filter(docs, { longname: 'TestClass#TestClass' });
                expect(result.length).toEqual(1);
                const cons = result[0];
                expect(cons.hideconstructor).toEqual(true);
                result = _.filter(docs, { name: 'arrowMethod' });
                expect(result.length).toEqual(1);

                // static property is ES2015 stage-1 proposal, not yet supported by JSDoc.
                result = _.filter(docs, { name: 'prop' });
                expect(result.length).toEqual(0);
            })
            .catch(err => {
                expect(Boolean(err)).toEqual(false);
                console.log(err.stack || err);
            })
            .finally(done);
    });

});
