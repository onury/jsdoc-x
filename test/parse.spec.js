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
                files: './test/input',
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
                    expect(result.length).toEqual(0);
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
