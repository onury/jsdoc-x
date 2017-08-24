'use strict';

// dep modules
const _ = require('lodash');
// own modules
const jsdocx = require('../src/index');

const utils = jsdocx.utils;

describe('Utils Suite', () => {
    let options, docs;

    // get symbol by description (see name-test.js)
    function symbolByDesc(desc) {
        return _.find(docs, { description: desc });
    }

    beforeAll(function (done) {
        options = {
            files: './test/input-parse/name-test.js',
            undocumented: false,
            output: {
                path: './test/output/docs-name-test.json',
                force: true,
                indent: true
            }
        };
        jsdocx.parse(options)
            .then(data => {
                docs = data;
                expect(docs).toEqual(jasmine.any(Array));
            })
            .catch(err => {
                expect(Boolean(err)).toEqual(false);
                console.log(err.stack || err);
            })
            .finally(done);
    });

    it('utils.getLongName', () => {
        let symbol;

        symbol = symbolByDesc('foo.bar');
        expect(utils.getLongName(symbol)).toEqual('foo.bar');

        symbol = symbolByDesc('foo.baz');
        expect(utils.getLongName(symbol)).toEqual('foo.baz');

        symbol = symbolByDesc('foo.qux');
        expect(utils.getLongName(symbol)).toEqual('foo.qux');

        symbol = symbolByDesc('foo.ns.m1');
        expect(utils.getLongName(symbol)).toEqual('foo.ns.m1');

        symbol = symbolByDesc('foo.ns.m2');
        expect(utils.getLongName(symbol)).toEqual('foo.ns.mx');

        symbol = symbolByDesc('foo.ns.m3');
        expect(utils.getLongName(symbol)).toEqual('m3name');

        symbol = symbolByDesc('foo.ns.m4');
        expect(utils.getLongName(symbol)).toEqual('ns.m4name');

        symbol = symbolByDesc('m5');
        expect(utils.getLongName(symbol)).toEqual('foo.ns.m5');

        symbol = symbolByDesc('m6');
        expect(utils.getLongName(symbol)).toEqual('foo.ns.m6');

        symbol = symbolByDesc('m7');
        expect(utils.getLongName(symbol)).toEqual('foo.o.m7');

    });

});
