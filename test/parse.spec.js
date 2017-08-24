'use strict';

// core modules
const path = require('path');
// dep modules
const _ = require('lodash');
const fs = require('fs-extra');
// own modules
const jsdocx = require('../src/index');

describe('Parser Suite', () => {
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
            relativePath: path.join(__dirname, '../code'),
            filter: null
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
            filter: null,
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
            })
            .catch(err => {
                expect(Boolean(err)).toEqual(false);
                console.log(err.stack || err);
            })
            .finally(done);
    });

    it('should sort symbols (ungrouped)', done => {
        options.sort = true;
        // options.output = false;
        jsdocx.parse(options)
            .then(docs => {
                expect(docs).toEqual(jasmine.any(Array));

                const cache = {};
                function index(longname) {
                    cache[longname] = cache[longname]
                        || _.findIndex(docs, { longname: longname });
                    return cache[longname];
                }

                expect(index('_opt')).toBeLessThan(index('<anonymous>~namespace'));
                expect(index('aOption')).toBeLessThan(index('Code'));
                expect(index('Code')).toBeLessThan(index('Code#_'));
                expect(index('Code')).toBeLessThan(index('module:test2'));
                expect(index('Code')).toBeLessThan(index('namespace'));
                expect(index('module:test2')).toBeLessThan(index('namespace'));
                expect(index('namespace')).toBeLessThan(index('namespace.location'));
                expect(index('aOption')).toBeLessThan(index('zOption'));
                expect(index('aOption')).toBeLessThan(index('bOption'));
                expect(index('bOption')).toBeLessThan(index('zOption'));
                expect(index('Code.aStaticMethod')).toBeLessThan(index('Code#bInstanceMethod'));
                expect(index('Code#bInstanceMethod')).toBeLessThan(index('Code.xStaticMethod'));
                expect(index('Code.utils')).toBeLessThan(index('Code.xStaticMethod'));
                expect(index('Code#instanceMethod')).toBeLessThan(index('Code.utils'));

                // docs.forEach(function (symbol) {
                //     console.log(symbol.longname);
                //     if (Array.isArray(symbol.properties)) {
                //         symbol.properties.forEach(function (prop) {
                //             console.log('prop:', prop.name);
                //         });
                //     }
                // });
                // console.log('-------------------');
            })
            .catch(err => {
                expect(Boolean(err)).toEqual(false);
                console.log(err.stack || err);
            })
            .finally(done);
    });

    it('should sort symbols (grouped)', done => {
        options.sort = 'grouped';
        // options.output = false;
        jsdocx.parse(options)
            .then(docs => {
                expect(docs).toEqual(jasmine.any(Array));

                const cache = {};
                function index(longname) {
                    cache[longname] = cache[longname]
                        || _.findIndex(docs, { longname: longname });
                    return cache[longname];
                }

                expect(index('_opt')).toBeLessThan(index('<anonymous>~namespace'));
                expect(index('aOption')).toBeLessThan(index('Code'));
                expect(index('Code')).toBeLessThan(index('Code#_'));
                expect(index('Code')).toBeLessThan(index('module:test2'));
                expect(index('Code')).toBeLessThan(index('namespace'));
                expect(index('module:test2')).toBeLessThan(index('namespace'));
                expect(index('namespace')).toBeLessThan(index('namespace.location'));
                expect(index('aOption')).toBeLessThan(index('zOption'));
                expect(index('aOption')).toBeLessThan(index('bOption'));
                expect(index('bOption')).toBeLessThan(index('zOption'));
                expect(index('Code.aStaticMethod')).toBeLessThan(index('Code#bInstanceMethod'));
                expect(index('Code#bInstanceMethod')).not.toBeLessThan(index('Code.xStaticMethod'));
                expect(index('Code#instanceMethod')).not.toBeLessThan(index('Code.utils'));

                // docs.forEach(function (item) {
                //     console.log(item.longname);
                // });
            })
            .catch(err => {
                expect(Boolean(err)).toEqual(false);
                console.log(err.stack || err);
            })
            .finally(done);
    });

    it('should build hierarchical symbols (grouped)', done => {
        options.files = [
            './test/input-parse/code.es6.js',
            './test/input-parse/test3.es5.js'
        ];
        options.sort = 'grouped';
        options.hierarchy = true;
        options.module = false;
        options.undocumented = false;
        options.undescribed = false;
        options.output = {
            path: './test/output/docs-hierarchy.json',
            indent: true
        };

        jsdocx.parse(options)
            .then(docs => {
                expect(docs).toEqual(jasmine.any(Array));
                expect(docs.length).toEqual(2);

                function getIndexer(symbol, prop, nameProp) {
                    nameProp = nameProp || 'longname';
                    const cache = {};
                    return val => {
                        const i = _.findIndex(symbol[prop], s => s[nameProp] === val); // eslint-disable-line max-nested-callbacks
                        cache[val] = cache[val] || i;
                        return cache[val];
                    };
                }

                let index;

                expect(docs[0].$members).toEqual(jasmine.any(Array));
                expect(docs[0].$members.length).toBeGreaterThan(5);
                index = getIndexer(docs[0], '$members');
                expect(index('Code.aStaticMethod')).toBeLessThan(index('Code#bInstanceMethod'));
                expect(index('Code#bInstanceMethod')).not.toBeLessThan(index('Code.xStaticMethod'));
                expect(index('Code#instanceMethod')).not.toBeLessThan(index('Code.utils'));

                expect(docs[1].$members).toEqual(jasmine.any(Array));
                expect(docs[1].$members.length).toEqual(1); // namespace.location

                const sym = docs[1].$members[0]; // location symbol
                expect(sym.properties.length).toBeGreaterThan(5);
                index = getIndexer(sym, 'properties', 'name'); // properties of location
                expect(index('href')).toBeLessThan(index('query'));
                expect(index('host')).toBeLessThan(index('hostname'));
                expect(index('path')).toBeLessThan(index('pathname'));
                expect(index('hash')).toBeLessThan(index('host'));
                expect(index('origin')).toBeLessThan(index('query'));

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
