'use strict';

// dep modules
const _ = require('lodash');
// own modules
const jsdocx = require('../src/index');

const utils = jsdocx.utils;

describe('Test: Utils', () => {
    let options, docs;

    // get symbol by description (see name-test.js)
    function symbolByDesc(desc) {
        return _.find(docs, { classdesc: desc })
            || _.find(docs, { description: desc });
    }

    beforeAll(function (done) {
        options = {
            files: [
                './test/input-parse/name-test.js',
                './test/input-conf/utils-test.js'
            ],
            undocumented: false,
            access: ['public', 'private', 'protected'],
            output: {
                path: './test/output/docs-utils-test.json',
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

    it('.getName(), .getLongName(), .getCodeName()', () => {
        let symbol;

        symbol = symbolByDesc('foo');
        expect(utils.getName(symbol)).toEqual('foo');
        expect(utils.getLongName(symbol)).toEqual('foo');
        expect(utils.getCodeName(symbol)).toEqual('foo');

        symbol = symbolByDesc('foo.bar');
        expect(utils.getName(symbol)).toEqual('bar');
        expect(utils.getLongName(symbol)).toEqual('foo.bar');
        expect(utils.getCodeName(symbol)).toEqual('foo.bar');

        symbol = symbolByDesc('foo.baz');
        expect(utils.getName(symbol)).toEqual('baz');
        expect(utils.getLongName(symbol)).toEqual('foo.baz');
        expect(utils.getCodeName(symbol)).toEqual('foo.baz');

        symbol = symbolByDesc('foo.qux');
        expect(utils.getName(symbol)).toEqual('qux');
        expect(utils.getLongName(symbol)).toEqual('foo.qux');
        expect(utils.getCodeName(symbol)).toEqual('foo.qux');

        symbol = symbolByDesc('foo.ns.m1');
        expect(utils.getLongName(symbol)).toEqual('foo.ns.m1');
        expect(utils.getCodeName(symbol)).toEqual('foo.ns.m1');

        symbol = symbolByDesc('foo.ns.m2');
        expect(utils.getLongName(symbol)).toEqual('foo.ns.mx');
        expect(utils.getCodeName(symbol)).toEqual('foo.ns.mx');

        symbol = symbolByDesc('foo.ns.m3');
        expect(utils.getLongName(symbol)).toEqual('m3name');

        symbol = symbolByDesc('foo.ns.m4');
        expect(utils.getLongName(symbol)).toEqual('ns.m4name');

        symbol = symbolByDesc('m5');
        expect(utils.getName(symbol)).toEqual('m5');
        expect(utils.getLongName(symbol)).toEqual('foo.ns.m5');
        expect(utils.getCodeName(symbol)).toEqual('m5');

        symbol = symbolByDesc('m6');
        expect(utils.getLongName(symbol)).toEqual('foo.ns.m6');

        symbol = symbolByDesc('m7');
        expect(utils.getLongName(symbol)).toEqual('foo.o.m7');
    });

    it('.getLevels(), .getParentName(), .getParent()', () => {
        let symbol;

        expect(utils.getLevels('')).toEqual(0);
        expect(utils.getLevels('a')).toEqual(1);
        expect(utils.getLevels('a.b')).toEqual(2);
        expect(utils.getParentName('a.b')).toEqual('a');
        expect(utils.getLevels('a#b.c')).toEqual(3);
        expect(utils.getParentName('a#b.c')).toEqual('a#b');
        expect(utils.getLevels('a~b.c#d')).toEqual(4);
        expect(utils.getParentName('a~b.c#d')).toEqual('a~b.c');
        expect(utils.getLevels('<anonymous>')).toEqual(0);
        expect(utils.getParentName('<anonymous>')).toEqual('');
        expect(utils.getLevels('<anonymous>~x')).toEqual(1);
        expect(utils.getParentName('<anonymous>~x')).toEqual('');
        expect(utils.getLevels('<anonymous>~x.y')).toEqual(2);
        expect(utils.getParentName('<anonymous>~x.y')).toEqual('x');
        expect(utils.getLevels('foo#event:ready')).toEqual(2);
        expect(utils.getParentName('foo#event:ready')).toEqual('foo');
        expect(utils.getLevels('module:foo.baz#qux')).toEqual(3);
        expect(utils.getParentName('module:foo.baz#qux')).toEqual('foo.baz');

        symbol = symbolByDesc('foo');
        expect(utils.getLevels(symbol)).toEqual(1);
        expect(utils.getParentName(symbol)).toEqual('');
        expect(utils.getParent(docs, symbol)).toEqual(null);
        expect(utils.getParent(docs, 'foo')).toEqual(null);

        symbol = symbolByDesc('foo.bar');
        expect(utils.getLevels(symbol)).toEqual(2);
        expect(utils.getParentName(symbol)).toEqual('foo');
        expect(utils.getParent(docs, symbol).$longname).toEqual('foo');
        expect(utils.getParent(docs, 'foo.bar').$longname).toEqual('foo');

        symbol = symbolByDesc('foo.ns.m1');
        expect(utils.getLevels(symbol)).toEqual(3);
        expect(utils.getParentName(symbol)).toEqual('foo.ns');
        expect(utils.getParent(docs, symbol)).toEqual(null); // 'foo.ns' is not documented.
        expect(utils.getParent(docs, 'foo.ns.m1')).toEqual(null); // 'foo.ns' is not documented.

        symbol = symbolByDesc('foo.o.mx');
        expect(utils.getLevels(symbol)).toEqual(3);
        expect(utils.getParentName(symbol)).toEqual('foo.o');
        expect(utils.getParent(docs, symbol).$longname).toEqual('foo.o');
        expect(utils.getParent(docs, 'foo.o.mx').$longname).toEqual('foo.o');
    });

    it('.is... kind/type/scope', () => {
        let symbol;

        symbol = symbolByDesc('global');
        expect(utils.isGlobal(symbol)).toEqual(true);
        expect(utils.isPublic(symbol)).toEqual(true);
        symbol = symbolByDesc('namespace');
        expect(utils.isNamespace(symbol)).toEqual(true);
        symbol = symbolByDesc('class');
        expect(utils.isClass(symbol)).toEqual(true);
        symbol = symbolByDesc('instance-member');
        expect(utils.isInstanceMember(symbol)).toEqual(true);
        symbol = symbolByDesc('instance-method');
        expect(utils.isMethod(symbol)).toEqual(true);
        expect(utils.isInstanceMethod(symbol)).toEqual(true);
        symbol = symbolByDesc('static-method');
        expect(utils.isMethod(symbol)).toEqual(true);
        expect(utils.isStaticMethod(symbol)).toEqual(true);
        symbol = symbolByDesc('enumeration');
        expect(utils.isEnum(symbol)).toEqual(true);
        symbol = symbolByDesc('instance-prop');
        expect(utils.isInstanceProperty(symbol)).toEqual(true);
        symbol = symbolByDesc('static-prop');
        expect(utils.isStaticProperty(symbol)).toEqual(true);
        symbol = symbolByDesc('inner-prop');
        expect(utils.isInner(symbol)).toEqual(true);
        symbol = symbolByDesc('ignore');
        expect(utils.isIgnored(symbol)).toEqual(true);
        symbol = symbolByDesc('readonly');
        expect(utils.isReadOnly(symbol)).toEqual(true);
        symbol = symbolByDesc('private');
        expect(utils.isPrivate(symbol)).toEqual(true);
        symbol = symbolByDesc('protected');
        expect(utils.isProtected(symbol)).toEqual(true);
        symbol = symbolByDesc('has-desc');
        expect(utils.hasDescription(symbol)).toEqual(true);
        symbol = _.find(docs, { name: 'noDesc' });
        expect(utils.hasDescription(symbol)).toEqual(false);
        symbol = symbolByDesc('typedef');
        expect(utils.isTypeDef(symbol)).toEqual(true);
        symbol = symbolByDesc('event');
        expect(utils.isEvent(symbol)).toEqual(true);
        symbol = symbolByDesc('module');
        expect(utils.isModule(symbol)).toEqual(true);
        symbol = symbolByDesc('generator');
        expect(utils.isGenerator(symbol)).toEqual(true);
    });

});
