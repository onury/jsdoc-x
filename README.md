# jsdoc-x

[![build-status](https://img.shields.io/travis/onury/jsdoc-x.svg?branch=master)](https://travis-ci.org/onury/jsdoc-x)
[![npm](http://img.shields.io/npm/v/jsdoc-x.svg)](https://www.npmjs.com/package/jsdoc-x)
[![release](https://img.shields.io/github/release/onury/jsdoc-x.svg)](https://github.com/onury/jsdoc-x)
[![license](http://img.shields.io/npm/l/jsdoc-x.svg)](https://github.com/onury/jsdoc-x/blob/master/LICENSE)
[![downloads](https://img.shields.io/npm/dt/jsdoc-x.svg)](https://www.npmjs.com/package/jsdoc-x)
[![dependencies](https://david-dm.org/onury/jsdoc-x.svg)](https://david-dm.org/onury/jsdoc-x)
[![maintained](https://img.shields.io/maintenance/yes/2019.svg)](https://github.com/onury/jsdoc-x/graphs/commit-activity)  

> © 2019, Onur Yıldırım ([@onury](https://github.com/onury)). MIT License.

Parser for outputting a Javascript object from documented code via JSDoc's explain (`-X`) command.  

**Install via NPM**:
```shell
npm i jsdoc-x
```

## Usage:

```js
var jsdocx = require('jsdoc-x');
```

Parse using Promises...
```js
jsdocx.parse('./src/**/*.js')
    .then(function (docs) {
        console.log(docs);
    })
    .catch(function (err) {
        console.log(err.stack);
    });
```

Or callback...
```js
var options = { files: './src/**/*.js', hierarchy: true };
jsdocx.parse(options, function (err, docs) {
    if (err) {
        console.log(err.stack);
        return;
    }
    console.log(docs);
});
```

See an **output example** [here](https://github.com/onury/jsdoc-x/blob/master/test/output/docs.json).

## `jsdocx.parse(options[, callback])`  

Executes the `jsdoc -X` command and parses the output into a Javascript object/array; with the specified options.  

<table>
    <tr>
        <td><b>Param</b></td>
        <td><b>Type</b></td>
        <td><b>Description</b></td>
    </tr>
    <tr>
        <td><b><code>options</code></b></td>
        <td><code>Object|Array|String</code></td>
        <td>Required. Either an options object or one or more source files to be processed. See details below.</td>
    </tr>
    <tr>
        <td><b><code>callback</code></b></td>
        <td><code>Function</code></td>
        <td>
            Callback function to be executed in the following signature: `function (err, array) { ... }`. Omit this callback to return a `Promise`. Default: <code>undefined</code>
        </td>
    </tr>
</table>

### `options`
`Object|Array|String` - Parse options.

<table>
    <tr>
        <td><b>Option</b></td>
        <td><b>Type</b></td>
        <td><b>Description</b></td>
    </tr>
    <tr>
        <td><b><code>files</code></b></td>
        <td><code>String|Array</code></td>
        <td>
            Required (if <code>source</code> is not set). One or more file/directory paths to be processed. This also accepts a <a href="https://github.com/isaacs/node-glob">Glob</a> string or array of globs. e.g. <code>./src/&#x2A;&#x2A;/&#x2A;.js</code> will produce an array of all <code>.js</code> files under </code>./src</code> directory and sub-directories. Default: <code>undefined</code>
        </td>
    </tr>
    <tr>
        <td><b><code>source</code></b></td>
        <td><code>String</code></td>
        <td>
            Required (if <code>files</code> is not set). Documented source code to be processed. If <code>files</code> is also set, this will be ignored. Default: <code>undefined</code>
        </td>
    </tr>
    <tr>
        <td><b><code>encoding</code><b></td>
        <td><code>String</code></td>
        <td>Encoding to be used when reading source files. Default: <code>"utf8"</code></td>
    </tr>
    <tr>
        <td><b><code>recurse</code><b></td>
        <td><code>Boolean</code></td>
        <td>
            Specifies whether to recurse into subdirectories when scanning for source files. Default: <code>false</code>
        </td>
    </tr>
    <tr>
        <td><b><code>pedantic</code></b></td>
        <td><code>Boolean</code></td>
        <td>
            Specifies whether to treat errors as fatal errors, and treat warnings as errors. Default: <code>false</code>
        </td>
    </tr>
    <tr>
        <td><b><code>access</code></b></td>
        <td><code>String|Array</code></td>
        <td>
            Specifies which symbols to be processed with the given access property. Possible values: <code>"private"</code>, <code>"protected"</code>, <code>"public"</code> or <code>"all"</code> (for all access levels). By default, all except private symbols are processed. Note that, if access is not set for a documented symbol, it will still be included, regardless of this option. Default: <code>undefined</code>
        </td>
    </tr>
    <tr>
        <td><b><code>private</code></b></td>
        <td><code>Boolean</code></td>
        <td>Shorthand for enabling documentation for <code>private</code> access symbols. Default: <code>false</code></td>
    </tr>
    <tr>
        <td><b><code>package</code></b></td>
        <td><code>String</code></td>
        <td>
            The path to the <code>package.json</code> file that contains the project name, version, and other details. If set to <code>true</code> instead of a path string, the first <code>package.json</code> file found in the source paths. Default: <code>undefined</code>
        </td>
    </tr>
    <tr>
        <td><b><code>module</code></b></td>
        <td><code>Boolean</code></td>
        <td>
            Specifies whether to include <code>module.exports</code> symbols. Default: <code>true</code>
        </td>
    </tr>
    <tr>
        <td><b><code>undocumented</code></b></td>
        <td><code>Boolean</code></td>
        <td>
            Specifies whether to include undocumented symbols. Default: <code>true</code>
        </td>
    </tr>
    <tr>
        <td><b><code>undescribed</code></b></td>
        <td><code>Boolean</code></td>
        <td>
            Specifies whether to include symbols without a description. Default: <code>true</code>
        </td>
    </tr>
    <tr>
        <td><b><code>ignored</code></b></td>
        <td><code>Boolean</code></td>
        <td>
            Specifies whether to include symbols marked with <code>@ignore</code> tag. Default: <code>true</code>
        </td>
    </tr>
    <tr>
        <td><b><code>allowUnknownTags</code></b></td>
        <td><code>Boolean</code></td>
        <td>
            Specifies whether to allow unrecognized tags.
            If set to <code>false</code> parsing will fail on unknown tags. Default: <code>true</code>
        </td>
    </tr>
    <tr>
        <td><b><code>dictionaries</code></b></td>
        <td><code>Array</code></td>
        <td>
            Indicates the dictionaries to be used. By default, both standard JSDoc tags and Closure Compiler tags are enabled. Default: <code>["jsdoc", "closure"]</code>
        </td>
    </tr>
    <tr>
        <td><b><code>includePattern</code></b></td>
        <td><code>String</code></td>
        <td>
            String pattern for defining sources to be included. By default, only files ending in ".js", ".jsdoc", and ".jsx" will be processed. Default: <code>".+\\.js(doc|x)?$"</code>
        </td>
    </tr>
    <tr>
        <td><b><code>excludePattern</code></b></td>
        <td><code>String</code></td>
        <td>
            String pattern for defining sources to be ignored. By default, any file starting with an underscore or in a directory starting with an underscore will be ignored. Default: <code>"(^|\\/|\\\\)_"</code>
        </td>
    </tr>
    <tr>
        <td><b><code>plugins</code></b></td>
        <td><code>Array</code></td>
        <td>
            Defines the JSDoc plugins to be used.
            See <a href="http://usejsdoc.org/about-plugins.html">this guide</a> on JSDoc plugins. Default: <code>[]</code>
        </td>
    </tr>
    <tr>
        <td><b><code>relativePath</code></b></td>
        <td><code>String</code></td>
        <td>
            When set, all <code>symbol.meta.path</code> values will be relative to this path. Default: <code>undefined</code>
        </td>
    </tr>
    <tr>
        <td><b><code>predicate</code></b></td>
        <td><code>Function|string</code></td>
        <td>
            Alias: <code>filter</code>. This is used to filter the parsed documentation output array. If a <code>Function</code> is passed; it's invoked for each included <code>symbol</code>. e.g. <code>function (symbol) { return symbol; }</code> Returning a falsy value will remove the symbol from the output. Returning <code>true</code> will keep the original symbol. To keep the symbol and alter its contents, simply return an altered symbol object. If a RegExp string is passed, it's executed on the symbol's long name. Default: <code>undefined</code>
        </td>
    </tr>
    <tr>
        <td><b><code>hierarchy</code></b></td>
        <td><code>Boolean</code></td>
        <td>
            Specifies whether to arrange symbols by their hierarchy. This will find and move symbols that have a <code>memberof</code> property to a <code>$members</code> property of their corresponding owners. Also the constructor symbol will be moved to a <code>$constructor</code> property of the <code>ClassDeclaration</code> symbol; if any. Default: <code>false</code>
        </td>
    </tr>
    <tr>
        <td><b><code>sort</code></b></td>
        <td><code>Boolean|String</code></td>
        <td>
            Specifies whether to sort the documentation symbols. For alphabetic sort, set to <code>true</code> or <code>"alphabetic"</code>. To group-sort set to <code>"grouped"</code>. <i>(Group sorting is done in the following order: by memberof, by scope, by access type, by kind, alphabetic.)</i> To sort by only <code>"scope"</code> or <code>"access"</code> or <code>"kind"</code>, set to corresponding string. <i>(Sorting by kind is done in the following order: constant, package/module, namespace, class, constructor, method, property, enum, typedef, event, interface, mixin, external, other members.)</i> Set to <code>false</code> to disable. Default: <code>false</code>
        </td>
    </tr>
    <tr>
        <td><b><code>output</code></b></td>
        <td><code>String|Object</code></td>
        <td>
            Path for a JSON file to be created, containing the output documentation array. Or you can set this to an object for extra options. Default: <code>undefined</code>
        </td>
    </tr>
    <tr>
        <td>↳<code>output.<b>path</b></code></td>
        <td><code>String</code></td>
        <td>Path for a JSON file to be created. Default: <code>undefined</code></td>
    </tr>
    <tr>
        <td>↳<code>output.<b>indent</b></code></td>
        <td><code>Boolean|Number</code></td>
        <td>Number of spaces for indentation. If set to <code>true</code>, 2 spaces will be used. Default: <code>false</code></td>
    </tr>
    <tr>
        <td>↳<code>output.<b>force</b></code></td>
        <td><code>Boolean</code></td>
        <td>
            Whether to create parent directories if they don't exist. Default: <code>false</code>
        </td>
    </tr>
    <tr>
        <td><b><code>debug</code></b></td>
        <td><code>Boolean</code></td>
        <td>
            Specifies whether to include extra information within thrown error messages. Default: <code>true</code>
        </td>
    </tr>
</table>


## `jsdocx.filter(docs[, options][, predicate])`  

Filters the given documentation output array. This is useful if you have an already parsed documentation output.  

<table>
    <tr>
        <td><b>Param</b></td>
        <td><b>Type</b></td>
        <td><b>Description</b></td>
    </tr>
    <tr>
        <td><b><code>docs</code></b></td>
        <td><code>Array</code></td>
        <td>Required. Documentation output array.</td>
    </tr>
    <tr>
        <td><b><code>options</code></b></td>
        <td><code>Object</code></td>
        <td>Filter options. See details below. Default: <code>undefined</code></td>
    </tr>
    <tr>
        <td><b><code>predicate</code></b></td>
        <td><code>Function</code></td>
        <td>
            The function invoked per iteration. Returning a falsy value will remove the symbol from the output. Returning <code>true</code> will keep the original symbol. To keep the symbol and alter its contents, simply return an altered symbol object. Default: <code>undefined</code>
        </td>
    </tr>
</table>

### `options`
`Object` - Filter options.

<table>
    <tr>
        <td><b>Option</b></td>
        <td><b>Type</b></td>
        <td><b>Description</b></td>
    </tr>
    <tr>
        <td><b><code>access</code></b></td>
        <td><code>String|Array</code></td>
        <td>
            Specifies which symbols to be processed with the given access property. Possible values: <code>"private"</code>, <code>"protected"</code>, <code>"public"</code> or <code>"all"</code> (for all access levels). By default, all except private symbols are processed. Note that, if access is not set for a documented symbol, it will still be included, regardless of this option. Default: <code>undefined</code>
        </td>
    </tr>
    <tr>
        <td><b><code>package</code></b></td>
        <td><code>String</code></td>
        <td>
            The path to the <code>package.json</code> file that contains the project name, version, and other details. If set to <code>true</code> instead of a path string, the first <code>package.json</code> file found in the source paths. Default: <code>undefined</code>
        </td>
    </tr>
    <tr>
        <td><b><code>module</code></b></td>
        <td><code>Boolean</code></td>
        <td>
            Specifies whether to include <code>module.exports</code> symbols. Default: <code>true</code>
        </td>
    </tr>
    <tr>
        <td><b><code>undocumented</code></b></td>
        <td><code>Boolean</code></td>
        <td>
            Specifies whether to include undocumented symbols. Default: <code>true</code>
        </td>
    </tr>
    <tr>
        <td><b><code>undescribed</code></b></td>
        <td><code>Boolean</code></td>
        <td>
            Specifies whether to include symbols without a description. Default: <code>true</code>
        </td>
    </tr>
    <tr>
        <td><b><code>relativePath</code></b></td>
        <td><code>String</code></td>
        <td>
            When set, all <code>symbol.meta.path</code> values will be relative to this path. Default: <code>undefined</code>
        </td>
    </tr>
    <tr>
        <td><b><code>hierarchy</code></b></td>
        <td><code>Boolean</code></td>
        <td>
            Specifies whether to arrange symbols by their hierarchy. This will find and move symbols that have a <code>memberof</code> property to a <code>$members</code> property of their corresponding owners. Also the constructor symbol will be moved to a <code>$constructor</code> property of the <code>ClassDeclaration</code> symbol; if any. Default: <code>false</code>
        </td>
    </tr>
    <tr>
        <td><b><code>sort</code></b></td>
        <td><code>Boolean|String</code></td>
        <td>
            Specifies whether to sort the documentation symbols. For alphabetic sort, set to <code>true</code> or <code>"alphabetic"</code>. To additionally group by scope (static/instance) set to <code>"grouped"</code>. Set to <code>false</code> to disable. Default: <code>false</code>
        </td>
    </tr>
</table>

## `jsdocx.utils`  

Utilities for documentation output and symbols.

<table>
    <tr>
        <td><b>Method</b></td>
        <td><b>Params</b></td>
        <td><b>Returns</b></td>
        <td><b>Description</b></td>
    </tr>
    <tr>
        <td><b><code>getFullName(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>String</code></td>
        <td>
            Alias: <code>getLongName()</code>. Gets the full name of the given symbol.
        </td>
    </tr>
    <tr>
        <td><b><code>getCodeName(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>String</code></td>
        <td>
            Gets the code name of the given symbol.
        </td>
    </tr>
    <tr>
        <td><b><code>getName(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>String</code></td>
        <td>
            Gets the (short) code-name of the given symbol.
        </td>
    </tr>
    <tr>
        <td><b><code>getSymbolByName(docs, name)</code></b></td>
        <td>
            <code>docs:Array</code>
            <code>name:String</code>
        </td>
        <td><code>Boolean</code></td>
        <td>
            Gets the first matching symbol by the given name.
        </td>
    </tr>
    <tr>
        <td><b><code>getSymbolNames(docs, sorter)</code></b></td>
        <td>
            <code>docs:Array</code>
            <code>sorter:Function|String</code>
        </td>
        <td><code>Array</code></td>
        <td>
            Builds and gets a flat array of symbol names from the given jsdoc-x parsed output.
            Pass a comparer function for <code>sorter</code> or a pre-defined string <code>"alphabetic"</code> or <code>"grouped"</code>.
        </td>
    </tr>
    <tr>
        <td><b><code>getKind(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>Number</code></td>
        <td>
            Gets the kind of the symbol. This is not the same as <code>symbol.kind</code>. i.e. JSDoc generates a constructor's kind as <code>"class"</code>. This will return <code>"constructor"</code>. Enumeration objects are returned as <code>"enum"</code>. Function members are returned as <code>"method"</code>, non-function members are returned as <code>"property"</code> (including getters/setters)...
        </td>
    </tr>
    <tr>
        <td><b><code>getLevels(symbol)</code></b></td>
        <td><code>symbol:Object|String</code></td>
        <td><code>Number</code></td>
        <td>
            Gets the number of levels for the given symbol or name. e.g. <code>mylib.prop</code> has 2 levels.
        </td>
    </tr>
    <tr>
        <td><b><code>getParentName(symbol)</code></b></td>
        <td><code>symbol:Object|String</code></td>
        <td><code>Number</code></td>
        <td>
            Gets the parent symbol name from the given symbol's name. Note that, this will return the parent name even if the parent symbol does not exist in the documentation. If there is no parent, returns <code>""</code> (empty string).
        </td>
    </tr>
    <tr>
        <td><b><code>getParent(symbol)</code></b></td>
        <td><code>symbol:Object|String</code></td>
        <td><code>Number</code></td>
        <td>
            Gets the parent symbol object from the given symbol object or symbol's name.
        </td>
    </tr>
    <tr>
        <td><b><code>hasDescription(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>Boolean</code></td>
        <td>
            Checks whether the given symbol has description.
        </td>
    </tr>    
    <tr>
        <td><b><code>isCallback(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>Boolean</code></td>
        <td>
            Checks whether the given symbol is a callback definition.
        </td>
    </tr>
    <tr>
        <td><b><code>isClass(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>Boolean</code></td>
        <td>
            Checks whether the given symbol is a class.
        </td>
    </tr>
    <tr>
        <td><b><code>isConstant(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>Boolean</code></td>
        <td>
            Checks whether the given symbol is a marked as a constant.
        </td>
    </tr>
    <tr>
        <td><b><code>isConstructor(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>Boolean</code></td>
        <td>
            Checks whether the given symbol is a constructor.
        </td>
    </tr>
    <tr>
        <td><b><code>isDeprecated(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>Boolean</code></td>
        <td>
            Checks whether the given symbol is marked with <code>@deprecated</code>.
        </td>
    </tr>
    <tr>
        <td><b><code>isEnum(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>Boolean</code></td>
        <td>
            Checks whether the given symbol is an enumeration.
        </td>
    </tr>
    <tr>
        <td><b><code>isEvent(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>Boolean</code></td>
        <td>
            Checks whether the given symbol is an event.
        </td>
    </tr>
    <tr>
        <td><b><code>isEexternal(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>Boolean</code></td>
        <td>
            Checks whether the given symbol is defined outside of the current package.
        </td>
    </tr>
    <tr>
        <td><b><code>isGenerator(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>Boolean</code></td>
        <td>
            Checks whether the given symbol is a generator function.
        </td>
    </tr>
    <tr>
        <td><b><code>isGlobal(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>Boolean</code></td>
        <td>
            Checks whether the given symbol has global scope.
        </td>
    </tr>
    <tr>
        <td><b><code>isIgnored(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>Boolean</code></td>
        <td>
            Checks whether the given symbol is marked with <code>@ignore</code>.
        </td>
    </tr>
    <tr>
        <td><b><code>isInner(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>Boolean</code></td>
        <td>
            Checks whether the given symbol has an inner scope.
        </td>
    </tr>
    <tr>
        <td><b><code>isInstanceMember(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>Boolean</code></td>
        <td>
            Checks whether the given symbol is an instance member.
        </td>
    </tr>
    <tr>
        <td><b><code>isInstanceMethod(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>Boolean</code></td>
        <td>
            Checks whether the given symbol is an instance method.
        </td>
    </tr>
    <tr>
        <td><b><code>isInstanceProperty(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>Boolean</code></td>
        <td>
            Checks whether the given symbol is an instance property.
        </td>
    </tr>
    <tr>
        <td><b><code>isMixin(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>Boolean</code></td>
        <td>
            Checks whether the given symbol is marked as a mixin (is intended to be added to other objects).
        </td>
    </tr>
    <tr>
        <td><b><code>isNamespace(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>Boolean</code></td>
        <td>
            Checks whether the given symbol is a namespace.
        </td>
    </tr>
    <tr>
        <td><b><code>isProperty(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>Boolean</code></td>
        <td>
            Checks whether the given symbol is a property.
        </td>
    </tr>
    <tr>
        <td><b><code>isReadOnly(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>Boolean</code></td>
        <td>
            Checks whether the given symbol is read-only.
        </td>
    </tr>
    <tr>
        <td><b><code>isMethod(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>Boolean</code></td>
        <td>
            Checks whether the given symbol is a method.
        </td>
    </tr>
    <tr>
        <td><b><code>isStaticMember(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>Boolean</code></td>
        <td>
            Checks whether the given symbol is a static member.
        </td>
    </tr>
    <tr>
        <td><b><code>isStaticMethod(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>Boolean</code></td>
        <td>
            Checks whether the given symbol is a static method.
        </td>
    </tr>
    <tr>
        <td><b><code>isStaticProperty(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>Boolean</code></td>
        <td>
            Checks whether the given symbol is a static property.
        </td>
    </tr>
    <tr>
        <td><b><code>isTypeDef(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>Boolean</code></td>
        <td>
            Alias: <code>isCustomType()</code>. Checks whether the given symbol is a custom type definition.
        </td>
    </tr>
    <tr>
        <td><b><code>isInterface(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>Boolean</code></td>
        <td>
            Checks whether the given symbol is marked as an interface that other symbols can implement.
        </td>
    </tr>
    <tr>
        <td><b><code>isPublic(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>Boolean</code></td>
        <td>
            Checks whether the given symbol has <code>public</code> access.
        </td>
    </tr>
    <tr>
        <td><b><code>isPrivate(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>Boolean</code></td>
        <td>
            Checks whether the given symbol has <code>private</code> access.
        </td>
    </tr>
    <tr>
        <td><b><code>isPackagePrivate(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>Boolean</code></td>
        <td>
            Checks whether the given symbol has <code>package</code> private access; indicating that the symbol is available only to code in the same directory as the source file for this symbol.
        </td>
    </tr>
    <tr>
        <td><b><code>isProtected(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>Boolean</code></td>
        <td>
            Checks whether the given symbol has <code>protected</code> access.
        </td>
    </tr>
    <tr>
        <td><b><code>isUndocumented(symbol)</code></b></td>
        <td><code>symbol:Object</code></td>
        <td><code>Boolean</code></td>
        <td>
            Checks whether the given symbol is undocumented. This checks if the symbol has any comments.
        </td>
    </tr>
    <tr>
        <td><b><code>notate(symbol, notation)</code></b></td>
        <td><code>symbol:Object</code><br /><code>notation:String</code></td>
        <td><code>&#x2A;</code></td>
        <td>
            Gets the value by the given object notation.
        </td>
    </tr>
</table>

---

### Change-log:

See [CHANGELOG.md](CHANGELOG.md).


[onury]:https://github.com/onury
