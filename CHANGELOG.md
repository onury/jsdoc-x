### jsdoc-x Change log:

**v1.0.1** (2016-05-07)
 - Fixed `utils.isMethod()`.

**v1.0.0** (2016-05-05)
 - Added `glob` support for `files` option of `.parse()` method.
 - Added `source` option for `.parse()` method.
 - Added `hierarchy` option for `.parse()` method.
 - Added `sort` option for `.parse()` method.
 - Added `.filter()` method for use with (already parsed) documentation array.
 - Created `utils` as a utility module for documentation symbols.
 - Code cleanup. Documentation update.

**v0.4.8** (2016-03-19)
 - If the parent project(s) has `jsdoc`, ours won't get installed. Since we use a specific file within `jsdoc` module, we cannot find it via `require()`. Now, fixed `jsdoc` path resolver. This will either use the local or from the parent project(s) properly.
 - Code cleanup. Documentation update.

**v0.4.6** (2016-03-19)
 - Added `output` option to write `JSON` file.
 - Initial commit.

**v0.4.0** (2016-03-18)
 - Using `child_process.spawn` instead of `execFile` since the latter has 200kb limit.
 - Added `filter`, `undocumented`, `undescribed`, `module` options.
 - Added jasmine tests.

**v0.3.0** (2016-03-17)
 - Added support for both Promises and callbacks.
 - Added `relativePath` option.

**v0.1.0** (2016-03-16)
