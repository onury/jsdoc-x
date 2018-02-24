### jsdoc-x Changelog:

**v2.1.0** (2018-02-24)

- **Improved** the symbol sorting logic. You can now sort by `scope`, by `access` type, by `kind`, `grouped` or `alphabetic`. See docs.
- **Fixed** an issue with `utils.isClass()` method where `meta.code.type` is not set to `ClassDeclaration`.
- **Added** utility methods: `getLevels()`, `getParentName()`, `getParent()`, `getKind()`, `isEvent()`, `isGenerator()`, `isCallback()`, `isConstant(), `isInterface()`, `isExternal()`, `isMixin()`, `isPackagePrivate()`.
- **Added** `getKind()` utility method. This is not the same as `symbol.kind`. i.e. JSDoc generates a constructor's kind as `"class"`. This will return `"constructor"`.
- **Added** `$kind` property to documented symbols when parsed. See `utils.getKind()` method to see how it's different than `symbol.kind`.
- **Fixed** `.isProperty()` utility method. It'll now return `false` if symbol is a method/function. This also affects the following methods: `.isStaticProperty()`, `.isInstanceProperty()`.
- **Changed** `.isMethod()` utility method to return `false` for getters/setters (which will be treated as properties, not methods).
- **Added** more tests for `utils`.
- **Updated** dependencies.
- Clean up and other revisions.

**v2.0.2** (2018-01-18)

- **Updated** dependencies.

**v2.0.1** (2017-08-24)

- **Added** `options.debug` for `.parse()` method. Fixes [#4](https://github.com/onury/jsdoc-x/issues/4).

**v2.0.0** (2017-08-24)

- **Breaking Change**: Requires Node.js v4 or newer.
- Updated `jsdoc` core module from v3.4.3 to v3.5.4. This adds support for [ES2015 code](https://github.com/jsdoc3/jsdoc/releases/tag/3.5.0), new tags such as `@hideconstructor`, etc.. (See [all JSDoc changes here][jsdoc-releases]).
- **Fixed** an issue where constructor could not be detected due to a JSDoc bug. For example, in ES2015 code, if the constructor is not marked with `@constructs` the longname is incorrect e.g. `ClassName#ClassName` instead of `ClassName`. We fixed this both for `utils.getLongName()` and for constructor-detection within the `hierarchy` process.
- **Fixed** an issue where some symbols were not moved to `$members` collection because of its `<anonymous>~` prefix. This has occurred when the `hierarchy` option was enabled.
- Fixed an issue with [a rare case](https://github.com/onury/jsdoc-x/pull/3) that occurred when a JSDoc comment contained a specific string.
- **Fixed** `utils.getLongName()` (broken after JSDoc updated).
- Any temporary files generated are now gracefully cleaned up, after parsing is complete.
- Updated dependencies to latest versions.
- Other minor revisions.

**v1.3.3** (2017-03-10)
- **Added** `ignored` boolean option that specifies whether to exclude symbols marked with `@ignore` tag in the output.
- **Added** `utils.isIgnored()`.
- **Added** `utils.isDeprecated()`.

**v1.3.2** (2017-03-09)

- **Added** `utils.getSymbolNames()` utility method.
- **Improved** sort logic/performance.
- Clean-up.

**v1.3.0** (2017-03-05)

- **Added** options: `allowUnknownTags`, `dictionaries`, `includePattern`, `excludePattern`.
- **Added** [JSDoc plugin](http://usejsdoc.org/about-plugins.html) support via the new `plugins` option.
- Updated dependencies to latest versions.

**v1.1.0** (2016-08-13)

- Constructors would still show up in the output even though `@private` is set. Fixed.
- **Added** `utils.isPublic()`.
- **Added** `utils.isPrivate()`.
- **Added** `utils.isProtected()`.

**v1.0.8** (2016-06-06)
- JSDoc overwrites the `longname` and `name` of the symbol, if it has an `alias`. Now we additionally output a `$longname` property with each symbol, that returns the correct/original long name. See [issue](https://github.com/jsdoc3/jsdoc/issues/1217) at JSDoc repo.
- Sort options now sorts with `$longname`.
- Fixed `utils.getFullName()` (alias: `utils.getLongName()`).
- **Added** `utils.getCodeName()`.
- **Added** `utils.isInner()`.
- **Added** `utils.isTypeDef()` (alias: `utils.isCustomType()`).

**v1.0.5** (2016-05-30)
 - **Fixed** `sort` option. Also `symbol.properties` are sorted, as well as the symbols.
 - **Added** `utils.notate()`.
 - **Added** `utils.isModule()`.
 - **Fixed** `utils.isMethod()`. Added alias `utils.isFunction()`
 - **Fixed** `utils.isClass()`.

**v1.0.2** (2016-05-10)
 - Parsing an array of files was broken. Fixed. (PR [#2](https://github.com/onury/jsdoc-x/pull/2))

**v1.0.1** (2016-05-07)
 - **Fixed** `utils.isMethod()`.

**v1.0.0** (2016-05-05)
 - **Added** `glob` support for `files` option of `.parse()` method.
 - **Added** `source` option for `.parse()` method.
 - **Added** `hierarchy` option for `.parse()` method.
 - **Added** `sort` option for `.parse()` method.
 - **Added** `.filter()` method for use with (already parsed) documentation array.
 - **Created** `utils` as a utility module for documentation symbols.
 - Code cleanup. Documentation update.

**v0.4.8** (2016-03-19)
 - If the parent project(s) has `jsdoc`, ours won't get installed. Since we use a specific file within `jsdoc` module, we cannot find it via `require()`. Now, fixed `jsdoc` path resolver. This will either use the local or from the parent project(s) properly.
 - Code cleanup. Documentation update.

**v0.4.6** (2016-03-19)
 - **Added** `output` option to write `JSON` file.
 - Initial commit.

**v0.4.0** (2016-03-18)
 - Using `child_process.spawn` instead of `execFile` since the latter has 200kb limit.
 - **Added** `filter`, `undocumented`, `undescribed`, `module` options.
 - **Added** jasmine tests.

**v0.3.0** (2016-03-17)
 - **Added** support for both Promises and callbacks.
 - **Added** `relativePath` option.

**v0.1.0** (2016-03-16)


[jsdoc-releases]:https://github.com/jsdoc3/jsdoc/releases
