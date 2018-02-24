'use strict';

// core modules
// const path = require('path');
// dep modules
// const _ = require('lodash');
// const fs = require('fs-extra');
// own modules
const jsdocx = require('../src/index');
const utils = require('../src/lib/utils');

function pad(str, len) {
    const spaces = (len - String(str).length) + 1;
    return str + new Array(spaces).join(' ');
}

function logSortedDocs(docs, nPrefix = '') {
    var i = nPrefix ? 1 : 0;
    var s = nPrefix ? '  ' : '';
    docs.forEach(function (symbol) {
        // console.log(i++, symbol.$longname, '        ', symbol.access, symbol.kind, symbol.scope); // also log original name if different
        console.log(` ${pad(nPrefix + i, 6)}  ${pad(s + symbol.$longname, 32)}  ${pad(symbol.scope, 10)} ${pad(symbol.access || 'public', 10)} ${pad(symbol.$kind, 10)}`);
        if (Array.isArray(symbol.properties)) {
            symbol.properties.forEach(function (prop) {
                console.log(` ${pad(i++, 4)}  > prop: ${prop.name}`);
            });
        }
        if (Array.isArray(symbol.$members)) {
            logSortedDocs(symbol.$members, i + '.');
        }
        i++;
    });
}

describe('Test: Sorter', () => {
    let options;

    // beforeAll(function () {});

    it('sort: true (alphabetic), hierarchy: false (default)', done => {
        options = {
            files: [
                './test/input-parse/sort-test.js'
            ],
            sort: true, // <——— alphabetic
            // hierarchy: false,
            output: {
                path: './test/output/docs-sort-true.json',
                indent: true
            }
        };
        jsdocx.parse(options)
            .then(docs => {
                expect(docs).toEqual(jasmine.any(Array));

                // logSortedDocs(docs);

                const sorted = docs.map(symbol => symbol.$longname);
                // aphabetic
                const expectedOrder = [
                    'aGlobalObject',
                    'aGlobalObject2',
                    'Code', // class
                    'Code', // constructor
                    'Code#bProtectedInstanceProp',
                    'Code.bStaticMethod',
                    'Code#config',
                    'Code#config._opt',
                    'Code#config.pOption',
                    'Code.Error',
                    'Code#instanceMethod',
                    'Code#options',
                    'Code.staticMethod',
                    'Code.xStaticMethod',
                    'fGlobalObjExt',
                    'gGlobalArray',
                    'gGlobalArray2',
                    'hGlobalFunction',
                    'kGlobalObjExt',
                    'module.exports',
                    'oGlobalObjExt',
                    'vGlobalVar',
                    'xGlobalFunction',
                    'zGlobalObjExt'
                ];
                expect(sorted).toEqual(expectedOrder);
            })
            .catch(err => {
                expect(Boolean(err)).toEqual(false);
                console.log(err.stack || err);
                // done();
            })
            .finally(done);
    });

    it('sort: scope, hierarchy: false', done => {
        options = {
            files: [
                './test/input-parse/sort-test.js'
            ],
            sort: 'scope', // <———
            hierarchy: false,
            output: {
                path: './test/output/docs-sort-scope.json',
                indent: true
            }
        };
        jsdocx.parse(options)
            .then(docs => {
                expect(docs).toEqual(jasmine.any(Array));

                // logSortedDocs(docs);

                const sorted = docs.map(symbol => symbol.$longname);
                // scope ➔ alphabetic
                const expectedOrder = [
                    'aGlobalObject',                     // global
                    'aGlobalObject2',                    // global
                    'Code',                              // global
                    'Code',                              // global
                    'fGlobalObjExt',                     // global
                    'gGlobalArray',                      // global
                    'gGlobalArray2',                     // global
                    'hGlobalFunction',                   // global
                    'kGlobalObjExt',                     // global
                    'oGlobalObjExt',                     // global
                    'vGlobalVar',                        // global
                    'xGlobalFunction',                   // global
                    'zGlobalObjExt',                     // global
                    'Code.bStaticMethod',                // static
                    'Code#config._opt',                  // static
                    'Code#config.pOption',               // static
                    'Code.Error',                        // static
                    'Code.staticMethod',                 // static
                    'Code.xStaticMethod',                // static
                    'module.exports',                    // static
                    'Code#bProtectedInstanceProp',       // instance
                    'Code#config',                       // instance
                    'Code#instanceMethod',               // instance
                    'Code#options'                       // instance
                ];
                expect(sorted).toEqual(expectedOrder);
            })
            .catch(err => {
                expect(Boolean(err)).toEqual(false);
                console.log(err.stack || err);
                // done();
            })
            .finally(done);
    });

    it('sort: access, hierarchy: false', done => {
        options = {
            files: [
                './test/input-parse/sort-test.js'
            ],
            sort: 'access', // <———
            hierarchy: false,
            access: ['public', 'protected', 'private', 'package'],
            output: {
                path: './test/output/docs-sort-access.json',
                indent: true
            }
        };
        jsdocx.parse(options)
            .then(docs => {
                expect(docs).toEqual(jasmine.any(Array));

                // logSortedDocs(docs);

                const sorted = docs.map(symbol => symbol.$longname);
                // access ➔ alphabetic
                const expectedOrder = [
                    'aGlobalObject',                     // public
                    'aGlobalObject2',                    // public
                    'Code',                              // public
                    'Code',                              // public
                    'Code.bStaticMethod',                // public
                    'Code#config',                       // public
                    'Code#config._opt',                  // public
                    'Code#config.pOption',               // public
                    'Code.Error',                        // public
                    'Code#instanceMethod',               // public
                    'Code#options',                      // public
                    'Code.staticMethod',                 // public
                    'Code.xStaticMethod',                // public
                    'fGlobalObjExt',                     // public
                    'gGlobalArray',                      // public
                    'gGlobalArray2',                     // public
                    'hGlobalFunction',                   // public
                    'kGlobalObjExt',                     // public
                    'module.exports',                    // public
                    'oGlobalObjExt',                     // public
                    'vGlobalVar',                        // public
                    'xGlobalFunction',                   // public
                    'zGlobalObjExt',                     // public
                    'Code#bProtectedInstanceProp',       // protected
                    'Code#aPrivateInstanceProp',         // private
                    'Code#cPrivateInstanceProp',         // private
                    'Code#privateInstanceProp'           // private
                ];
                expect(sorted).toEqual(expectedOrder);
            })
            .catch(err => {
                expect(Boolean(err)).toEqual(false);
                console.log(err.stack || err);
                // done();
            })
            .finally(done);
    });

    it('sort: kind, hierarchy: false', done => {
        options = {
            files: [
                './test/input-parse/sort-test.js'
            ],
            sort: 'kind', // <———
            hierarchy: false,
            access: ['public', 'protected', 'private', 'package'],
            output: {
                path: './test/output/docs-sort-kind.json',
                indent: true
            }
        };
        jsdocx.parse(options)
            .then(docs => {
                expect(docs).toEqual(jasmine.any(Array));

                // logSortedDocs(docs);

                const sorted = docs.map(symbol => symbol.$longname);
                // kind ➔ alphabetic
                const expectedOrder = [
                    'kGlobalObjExt',                   // constant
                    'Code',                            // constructor
                    'Code',                            // class
                    'Code.bStaticMethod',              // method
                    'Code#instanceMethod',             // method
                    'Code.staticMethod',               // method
                    'Code.xStaticMethod',              // method
                    'hGlobalFunction',                 // method
                    'xGlobalFunction',                 // method
                    'aGlobalObject',                   // property
                    'aGlobalObject2',                  // property
                    'Code#aPrivateInstanceProp',       // property
                    'Code#bProtectedInstanceProp',     // property
                    'Code#config',                     // property
                    'Code#config._opt',                // property
                    'Code#config.pOption',             // property
                    'Code#cPrivateInstanceProp',       // property
                    'Code.Error',                      // property
                    'Code#options',                    // property
                    'Code#privateInstanceProp',        // property
                    'fGlobalObjExt',                   // property
                    'gGlobalArray',                    // property
                    'gGlobalArray2',                   // property
                    'module.exports',                  // property
                    'oGlobalObjExt',                   // property
                    'vGlobalVar',                      // property
                    'zGlobalObjExt'                    // property
                ];
                expect(sorted).toEqual(expectedOrder);
            })
            .catch(err => {
                expect(Boolean(err)).toEqual(false);
                console.log(err.stack || err);
                // done();
            })
            .finally(done);
    });

    it('sort: grouped, hierarchy: false', done => {
        options = {
            files: [
                './test/input-parse/sort-test.js'
            ],
            sort: 'grouped', // <———
            hierarchy: false,
            access: ['public', 'protected', 'private', 'package'],
            output: {
                path: './test/output/docs-sort-grouped.json',
                indent: true
            }
        };
        jsdocx.parse(options)
            .then(docs => {
                expect(docs).toEqual(jasmine.any(Array));

                // const cache = {};
                // function index(longname) {
                //     cache[longname] = cache[longname]
                //         || _.findIndex(docs, { longname: longname });
                //     return cache[longname];
                // }

                // logSortedDocs(docs);

                const sorted = docs.map(symbol => symbol.$longname);
                // sort by: scope ➔ access ➔ kind ➔ alphabetic
                const expectedOrder = [
                    'aGlobalObject',                  // global     public     property
                    'aGlobalObject2',                 // global     public     property
                    'Code',                           // global     public     constructor
                    'Code',                           // global     public     class
                    'fGlobalObjExt',                  // global     public     property
                    'gGlobalArray',                   // global     public     property
                    'gGlobalArray2',                  // global     public     property
                    'hGlobalFunction',                // global     public     method
                    'kGlobalObjExt',                  // global     public     constant
                    'oGlobalObjExt',                  // global     public     property
                    'vGlobalVar',                     // global     public     property
                    'xGlobalFunction',                // global     public     method
                    'zGlobalObjExt',                  // global     public     property
                    'Code.bStaticMethod',             // static     public     method
                    'Code.staticMethod',              // static     public     method
                    'Code.xStaticMethod',             // static     public     method
                    'Code#config._opt',               // static     public     property
                    'Code#config.pOption',            // static     public     property
                    'Code.Error',                     // static     public     property
                    'module.exports',                 // static     public     property
                    'Code#instanceMethod',            // instance   public     method
                    'Code#config',                    // instance   public     property
                    // '_opt',                           // prop
                    // 'pOption',                        // prop
                    'Code#options',                   // instance   public     property
                    'Code#bProtectedInstanceProp',    // instance   protected  property
                    'Code#aPrivateInstanceProp',      // instance   private    property
                    'Code#cPrivateInstanceProp',      // instance   private    property
                    'Code#privateInstanceProp'        // instance   private    property
                ];
                expect(sorted).toEqual(expectedOrder);
            })
            .catch(err => {
                expect(Boolean(err)).toEqual(false);
                console.log(err.stack || err);
            })
            .finally(done);
    });

    it('sort: grouped, hierarchy: true', done => {
        options = {
            files: [
                './test/input-parse/sort-test.js'
            ],
            sort: 'grouped', // <———
            hierarchy: true,
            access: ['public', 'protected', 'private', 'package'],
            output: {
                path: './test/output/docs-sort-grouped-hierarchy.json',
                indent: true
            }
        };
        jsdocx.parse(options)
            .then(docs => {
                expect(docs).toEqual(jasmine.any(Array));

                // logSortedDocs(docs);

                const sorted = docs.map(symbol => symbol.$longname);
                // sort by: scope ➔ access ➔ kind ➔ alphabetic
                const expectedOrder = [
                    'aGlobalObject',                   // global     public     property
                    'aGlobalObject2',                  // global     public     property
                    'Code',                            // global     public     class
                    'fGlobalObjExt',                   // global     public     property
                    'gGlobalArray',                    // global     public     property
                    'gGlobalArray2',                   // global     public     property
                    'hGlobalFunction',                 // global     public     method
                    'kGlobalObjExt',                   // global     public     constant
                    'oGlobalObjExt',                   // global     public     property
                    'vGlobalVar',                      // global     public     property
                    'xGlobalFunction',                 // global     public     method
                    'zGlobalObjExt',                   // global     public     property
                    'module.exports'                   // static     public     property
                ];
                expect(sorted).toEqual(expectedOrder);

                const c = utils.getSymbolByName(docs, 'Code');
                expect(c).toBeDefined();
                expect(c.$constructor).toBeDefined();
                expect(c.$members).toEqual(jasmine.any(Array));
                const sortedCNames = c.$members.map(symbol => symbol.$longname);
                const expectedCMembers = [
                    'Code.bStaticMethod',              // static     public     method
                    'Code.staticMethod',               // static     public     method
                    'Code.xStaticMethod',              // static     public     method
                    'Code.Error',                      // static     public     property
                    'Code#instanceMethod',             // instance   public     method
                    'Code#config',                     // instance   public     property
                    'Code#options',                    // instance   public     property
                    'Code#bProtectedInstanceProp',     // instance   protected  property
                    'Code#aPrivateInstanceProp',       // instance   private    property
                    'Code#cPrivateInstanceProp',       // instance   private    property
                    'Code#privateInstanceProp'         // instance   private    property
                ];
                expect(sortedCNames).toEqual(expectedCMembers);

                const conf = utils.getSymbolByName(docs, 'Code#config');
                expect(conf).toBeDefined();
                expect(conf.$members).toEqual(jasmine.any(Array));
                const sortedConfProps = conf.$members.map(symbol => symbol.$longname);
                const expectedConfProps = [
                    'Code#config._opt',                // static     public     property
                    'Code#config.pOption'              // static     public     property
                ];
                expect(sortedConfProps).toEqual(expectedConfProps);

            })
            .catch(err => {
                expect(Boolean(err)).toEqual(false);
                console.log(err.stack || err);
            })
            .finally(done);
    });

});
