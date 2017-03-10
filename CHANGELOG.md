### jsdoc-x Change log:

**v1.3.3** (2017-03-10)
- Added `ignored` boolean option that specifies whether to exclude symbols marked with `@ignore` tag in the output.
- Added `utils.isIgnored()`.
- Added `utils.isDeprecated()`.

**v1.3.2** (2017-03-09)

- Added `utils.getSymbolNames()` utility method.
- Improved sort logic/performance.
- Clean-up.

**v1.3.0** (2017-03-05)

- Added options: `allowUnknownTags`, `dictionaries`, `includePattern`, `excludePattern`.
- Added [JSDoc plugin](http://usejsdoc.org/about-plugins.html) support via the new `plugins` option.
- Updated dependencies to latest versions.

**v1.1.0** (2016-08-13)

- Constructors would still show up in the output even though `@private` is set. Fixed.
- Added `utils.isPublic()`.
- Added `utils.isPrivate()`.
- Added `utils.isProtected()`.

**v1.0.8** (2016-06-06)
- JSDoc overwrites the `longname` and `name` of the symbol, if it has an `alias`. Now we additionally output a `$longname` property with each symbol, that returns the correct/original long name. See [issue](https://github.com/jsdoc3/jsdoc/issues/1217) at JSDoc repo.
- Sort options now sorts with `$longname`.
- Fixed `utils.getFullName()` (alias: `utils.getLongName()`).
- Added `utils.getCodeName()`.
- Added `utils.isInner()`.
- Added `utils.isTypeDef()` (alias: `utils.isCustomType()`).

**v1.0.5** (2016-05-30)
 - Fixed `sort` option. Also `symbol.properties` are sorted, as well as the symbols.
 - Added `utils.notate()`.
 - Added `utils.isModule()`.
 - Fixed `utils.isMethod()`. Added alias `utils.isFunction()`
 - Fixed `utils.isClass()`.

**v1.0.2** (2016-05-10)
 - Parsing an array of files was broken. Fixed. (PR [#2](https://github.com/onury/jsdoc-x/pull/2))

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
