# jsdoc-x Changelog

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](http://semver.org).

## [4.0.3](https://github.com/onury/jsdoc-x/compare/v4.0.0...v4.0.3) (2019-01-08)

### Changed
- `filter` (or `predicate`) option now also accepts a regular expression string.
- Improved `cleanName()` inner method that returns clean symbol names.

## [4.0.0](https://github.com/onury/jsdoc-x/compare/v3.0.0...v4.0.0) (2018-11-18)

### Changed
- **Breaking:** Requires Node.js v8 or later. This change is due to the core dependency `fs-extra` update.
- Minor improvements.

## [3.0.0](https://github.com/onury/jsdoc-x/compare/v2.0.2...v3.0.0) (2018-02-24)

### Changed
- **Breaking:** Requires Node.js v6 or later. (Dropped support for Node v4.)
- Improved the symbol sorting logic. You can now sort by `scope`, by `access` type, by `kind`, `grouped` or `alphabetic`. See docs.
- `.isMethod()` utility method to return `false` for getters/setters (which will be treated as properties, not methods).
- Updated dependencies.

### Added
- `getKind()` utility method. This is not the same as `symbol.kind`. i.e. JSDoc generates a constructor's kind as `"class"`. This will return `"constructor"`.
- `$kind` property to documented symbols when parsed. See `utils.getKind()` method to see how it's different than `symbol.kind`.
- Utility methods: `getLevels()`, `getParentName()`, `getParent()`, `getKind()`, `isEvent()`, `isGenerator()`, `isCallback()`, `isConstant()`, `isInterface()`, `isExternal()`, `isMixin()`, `isPackagePrivate()`.
- More tests for `utils`.

### Fixed
- An issue with `utils.isClass()` method where `meta.code.type` is not set to `ClassDeclaration`.
- `.isProperty()` utility method. It'll now return `false` if symbol is a method/function. This also affects the following methods: `.isStaticProperty()`, `.isInstanceProperty()`.

## [2.0.2](https://github.com/onury/jsdoc-x/compare/v2.0.1...v2.0.2) (2018-01-18)

### Changed
- Updated dependencies.

## [2.0.1](https://github.com/onury/jsdoc-x/compare/v2.0.0...v2.0.1) (2017-08-24)

### Added
- `options.debug` for `.parse()` method. Fixes [#4](https://github.com/onury/jsdoc-x/issues/4).

## [2.0.0](https://github.com/onury/jsdoc-x/compare/v1.3.3...v2.0.0) (2017-08-24)

### Changed
- **Breaking**: Requires Node.js v4 or newer.
- Updated `jsdoc` core module from v3.4.3 to v3.5.4. This adds support for [ES2015 code](https://github.com/jsdoc3/jsdoc/releases/tag/3.5.0), new tags such as `@hideconstructor`, etc.. (See [all JSDoc changes here][jsdoc-releases]).
- Any temporary files generated are now gracefully cleaned up, after parsing is complete.
- Updated dependencies to latest versions.

### Fixed
- An issue where constructor could not be detected due to a JSDoc bug. For example, in ES2015 code, if the constructor is not marked with `@constructs` the longname is incorrect e.g. `ClassName#ClassName` instead of `ClassName`. We fixed this both for `utils.getLongName()` and for constructor-detection within the `hierarchy` process.
- An issue where some symbols were not moved to `$members` collection because of its `<anonymous>~` prefix. This has occurred when the `hierarchy` option was enabled.
- An issue with [a rare case](https://github.com/onury/jsdoc-x/pull/3) that occurred when a JSDoc comment contained a specific string.
- `utils.getLongName()` (was broken after JSDoc updated).

## [1.3.3](https://github.com/onury/jsdoc-x/compare/v1.3.2...v1.3.3) (2017-03-10)

### Added
- `ignored` boolean option that specifies whether to exclude symbols marked with `@ignore` tag in the output.
- `utils.isIgnored()`.
- `utils.isDeprecated()`.

## [1.3.2](https://github.com/onury/jsdoc-x/compare/v1.3.0...v1.3.2) (2017-03-09)

### Changed
- Improved symbols sorting logic/performance.

### Added
- `utils.getSymbolNames()` utility method.

## [1.3.0](https://github.com/onury/jsdoc-x/compare/v1.1.0...v1.3.0) (2017-03-05)

### Changed
- Updated dependencies to latest versions.

### Added
- Options: `allowUnknownTags`, `dictionaries`, `includePattern`, `excludePattern`.
- [JSDoc plugin](http://usejsdoc.org/about-plugins.html) support via the new `plugins` option.

## [1.1.0](https://github.com/onury/jsdoc-x/compare/v1.0.8...v1.1.0) (2016-08-13)

### Added
- Utility methods: `utils.isPublic()`, `utils.isPrivate()`, `utils.isProtected()`.

### Fixed
- Constructors would still show up in the output even though `@private` is set.

## [1.0.8](https://github.com/onury/jsdoc-x/compare/v1.0.5...v1.0.8) (2016-06-06)

### Changed
- Sort options now sorts with `$longname`.

### Added
- JSDoc overwrites the `longname` and `name` of the symbol, if it has an `alias`. Now we additionally output a `$longname` property with each symbol, that returns the correct/original long name. See [issue](https://github.com/jsdoc3/jsdoc/issues/1217) at JSDoc repo.
- Utility methods: `utils.getCodeName()`, `utils.isInner()` and `utils.isTypeDef()` (alias: `utils.isCustomType()`).

### Fixed
- `utils.getFullName()` (alias: `utils.getLongName()`).

## [1.0.5](https://github.com/onury/jsdoc-x/compare/v1.0.2...v1.0.5) (2016-05-30)

### Added
- Utility methods `utils.notate()` and `utils.isModule()`.

### Fixed
- `sort` option. Also `symbol.properties` are sorted, as well as the symbols.
- `utils.isMethod()`. Added alias `utils.isFunction()`
- `utils.isClass()`.

## [1.0.2](https://github.com/onury/jsdoc-x/compare/v1.0.1...v1.0.2) (2016-05-10)

### Fixed
- Parsing an array of files was broken. Fixed. (PR [#2](https://github.com/onury/jsdoc-x/pull/2))

## [1.0.1](https://github.com/onury/jsdoc-x/compare/v1.0.0...v1.0.1) (2016-05-07)

### Fixed
- `utils.isMethod()`.

## [1.0.0](https://github.com/onury/jsdoc-x/compare/v0.4.8...v1.0.0) (2016-05-05)

### Added
- `glob` support for `files` option of `.parse()` method.
- `source` option for `.parse()` method.
- `hierarchy` option for `.parse()` method.
- `sort` option for `.parse()` method.
- `.filter()` method for use with (already parsed) documentation array.
- `utils` as a utility module for documentation symbols.

## [0.4.8](https://github.com/onury/jsdoc-x/compare/v0.4.6...v0.4.8) (2016-03-19)

### Fixed
- If the parent project(s) has `jsdoc`, ours won't get installed. Since we use a specific file within `jsdoc` module, we cannot find it via `require()`. Now, fixed `jsdoc` path resolver. This will either use the local or from the parent project(s) properly.


## [0.4.6] (2016-03-19)

### Added
- `output` option to write JSON file.

## [0.4.0] (2016-03-18)

### Changed
- Using `child_process.spawn` instead of `execFile` since the latter has 200kb limit.

### Added
- `filter`, `undocumented`, `undescribed`, `module` options.
- Jasmine tests.

## [0.3.0] (2016-03-17)

### Added
- Support for both Promises and callbacks.
- `relativePath` option.

## [0.1.0] (2016-03-16)

- Initial.


[://jsdoc-releasgithubes]:https.com/jsdoc3/jsdoc/releases
