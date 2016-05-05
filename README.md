# jsdoc-x

![npm](https://img.shields.io/npm/v/jsdoc-x.svg)
![release](https://img.shields.io/github/release/onury/jsdoc-x.svg)
![license](http://img.shields.io/npm/l/jsdoc-x.svg)

Parser for outputting a customized Javascript object from documented code via JSDoc's explain (`-X`) command.  

> © 2016, Onur Yıldırım (@onury). MIT License.  

**Install via NPM**:
```shell
npm i jsdoc-x
```

## Usage:

```js
var jsdocx = require('jsdoc-x');
```

## `jsdocx.parse(options[, callback])`  

Executes the `jsdoc -X` command and parses the output into a Javascript object/array; with the specified options.  

<table>
    <tr>
        <td><b>Param</b></td>
        <td><b>Type</b></td>
        <td><b>Default</b></td>
        <td><b>Description</b></td>
    </tr>
    <tr>
        <td><b><code>options</code></b></td>
        <td><code>Object</code></td>
        <td></td>
        <td>Required. Parse options. See details below.</td>
    </tr>
    <tr>
        <td><b><code>callback</code></b></td>
        <td><code>Function</code></td>
        <td><code>undefined</code></td>
        <td>
            Callback function to be executed in the following signature: `function (err, array) { ... }`. Omit this callback to return a `Promise`.
        </td>
    </tr>
</table>

Parse using Promises...
```js
jsdocx.parse(options)
    .then(function (docs) {
        console.log(docs);
    })
    .catch(function (err) {
        console.log(err.stack);
    });
```

Or callback...
```js
jsdocx.parse(options, function (err, docs) {
    if (err) {
        console.log(err.stack);
        return;
    }
    console.log(docs);
});
```

### `options`
`Object|Array|String` - Either an options object or one or more source files to be processed.

<table>
    <tr>
        <td><b>Option</b></td>
        <td><b>Type</b></td>
        <td><b>Default</b></td>
        <td><b>Description</b></td>
    </tr>
    <tr>
        <td><b><code>files</code></b></td>
        <td><code>String|Array</code></td>
        <td><code>undefined</code></td>
        <td>
            Required (if <code>source</code> is not set). One or more file/directory paths to be processed. This also accepts a <a href="https://github.com/isaacs/node-glob">Glob</a> string or array of globs. e.g. <code>`./src/**/*.js`</code> will produce an array of all <code>.js</code> files under </code>./src</code> directory and sub-directories.
        </td>
    </tr>
    <tr>
        <td><b><code>source</code></b></td>
        <td><code>String</code></td>
        <td><code>undefined</code></td>
        <td>
            Required (if <code>files</code> is not set). Documented source code to be processed. If <code>files</code> is also set, this will be ignored.
        </td>
    </tr>
    <tr>
        <td><b><code>encoding</code><b></td>
        <td><code>String</code></td>
        <td><code>"utf8"</code></td>
        <td>Encoding to be used when reading source files.</td>
    </tr>
    <tr>
        <td><b><code>recurse</code><b></td>
        <td><code>Boolean</code></td>
        <td><code>false</code></td>
        <td>
            Specifies whether to recurse into subdirectories when scanning for source files.
        </td>
    </tr>
    <tr>
        <td><b><code>pedantic</code></b></td>
        <td><code>Boolean</code></td>
        <td><code>false</code></td>
        <td>
            Specifies whether to treat errors as fatal errors, and treat warnings as errors.
        </td>
    </tr>
    <tr>
        <td><b><code>access</code></b></td>
        <td><code>String|Array</code></td>
        <td><code>undefined</code></td>
        <td>
            Specifies which symbols to be processed with the given access property. Possible values: <code>"private"</code>, <code>"protected"</code>, <code>"public"</code> or <code>"all"</code> (for all access levels). By default, all except private symbols are processed. Note that, if access is not set for a documented symbol, it will still be included, regardless of this option.
        </td>
    </tr>
    <tr>
        <td><b><code>private</code></b></td>
        <td><code>Boolean</code></td>
        <td><code>false</code></td>
        <td></td>
    </tr>
    <tr>
        <td><b><code>package</code></b></td>
        <td><code>String</code></td>
        <td><code>undefined</code></td>
        <td>
            The path to the <code>package.json</code> file that contains the project name, version, and other details. If set to <code>true</code> instead of a path string, the first <code>package.json</code> file found in the source paths.
        </td>
    </tr>
    <tr>
        <td><b><code>module</code></b></td>
        <td><code>Boolean</code></td>
        <td><code>true</code></td>
        <td>
            Specifies whether to include <code>module.exports</code> symbols.
        </td>
    </tr>
    <tr>
        <td><b><code>undocumented</code></b></td>
        <td><code>Boolean</code></td>
        <td><code>true</code></td>
        <td>
            Specifies whether to include undocumented symbols.
        </td>
    </tr>
    <tr>
        <td><b><code>undescribed</code></b></td>
        <td><code>Boolean</code></td>
        <td><code>true</code></td>
        <td>
            Specifies whether to include symbols without a description.
        </td>
    </tr>
    <tr>
        <td><b><code>relativePath</code></b></td>
        <td><code>String</code></td>
        <td><code>undefined</code></td>
        <td>
            When set, all <code>symbol.meta.path</code> values will be relative to this path.
        </td>
    </tr>
    <tr>
        <td><b><code>predicate</code></b></td>
        <td><code>Function</code></td>
        <td><code>undefined</code></td>
        <td>
            Alias: <code>filter</code>. This is used to filter the parsed documentation output array. If a <code>Function</code> is passed; it's invoked for each included <code>symbol</code>. e.g. <code>function (symbol) { return symbol; }</code> Returning a falsy value will remove the symbol from the output. Returning <code>true</code> will keep the original symbol. To keep the symbol and alter its contents, simply return an altered symbol object.
        </td>
    </tr>
    <tr>
        <td><b><code>hierarchy</code></b></td>
        <td><code>Boolean</code></td>
        <td><code>false</code></td>
        <td>
            Specifies whether to arrange symbols by their hierarchy. This will find and move symbols that have a <code>memberof</code> property to a <code>$members</code> property of their corresponding owners. Also the constructor symbol will be moved to a <code>$constructor</code> property of the <code>ClassDeclaration</code> symbol; if any.
        </td>
    </tr>
    <tr>
        <td><b><code>sort</code></b></td>
        <td><code>Boolean|String</code></td>
        <td><code>false</code></td>
        <td>
            Specifies whether to sort the documentation symbols. For alphabetic sort, set to <code>true</code> or <code>"alphabetic"</code>. To additionally group by scope (static/instance) set to <code>"grouped"</code>. Set to <code>false</code> to disable.
        </td>
    </tr>
    <tr>
        <td><b><code>output</code></b></td>
        <td><code>String|Object</code></td>
        <td><code>undefined</code></td>
        <td>
            Path for a JSON file to be created, containing the output documentation array. Or you can set this to an object for extra options.  
        </td>
    </tr>
    <tr>
        <td>↳<code>output.<b>path</b></code></td>
        <td><code>String</code></td>
        <td><code>undefined</code></td>
        <td>Path for a JSON file to be created.</td>
    </tr>
    <tr>
        <td>↳<code>output.<b>indent</b></code></td>
        <td><code>Boolean|Number</code></td>
        <td><code>false</code></td>
        <td>Number of spaces for indentation. If set to <code>true</code>, 2 spaces will be used.</td>
    </tr>
    <tr>
        <td>↳<code>output.<b>force</b></code></td>
        <td><code>Boolean</code></td>
        <td><code>false</code></td>
        <td>Whether to create parent directories if they don't exist.</td>
    </tr>
</table>

#### Example Output:

See an output example [here](https://github.com/onury/jsdoc-x/blob/master/test/output/docs.json).


## `jsdocx.filter(docs[, options][, predicate])`  

Filters the given/parsed documentation output array.

<table>
    <tr>
        <td><b>Param</b></td>
        <td><b>Type</b></td>
        <td><b>Default</b></td>
        <td><b>Description</b></td>
    </tr>
    <tr>
        <td><b><code>docs</code></b></td>
        <td><code>Array</code></td>
        <td></td>
        <td>Required. Documentation output array.</td>
    </tr>
    <tr>
        <td><b><code>options</code></b></td>
        <td><code>Object</code></td>
        <td><code>undefined</code></td>
        <td>Filter options. See details below.</td>
    </tr>
    <tr>
        <td><b><code>predicate</code></b></td>
        <td><code>Function</code></td>
        <td><code>undefined</code></td>
        <td>
            The function invoked per iteration. Returning a falsy value will remove the symbol from the output. Returning <code>true</code> will keep the original symbol. To keep the symbol and alter its contents, simply return an altered symbol object.
        </td>
    </tr>
</table>

### `options`
`Object` - Filter options.

<table>
    <tr>
        <td><b>Option</b></td>
        <td><b>Type</b></td>
        <td><b>Default</b></td>
        <td><b>Description</b></td>
    </tr>
    <tr>
        <td><b><code>access</code></b></td>
        <td><code>String|Array</code></td>
        <td><code>undefined</code></td>
        <td>
            Specifies which symbols to be processed with the given access property. Possible values: <code>"private"</code>, <code>"protected"</code>, <code>"public"</code> or <code>"all"</code> (for all access levels). By default, all except private symbols are processed. Note that, if access is not set for a documented symbol, it will still be included, regardless of this option.
        </td>
    </tr>
    <tr>
        <td><b><code>package</code></b></td>
        <td><code>String</code></td>
        <td><code>undefined</code></td>
        <td>
            The path to the <code>package.json</code> file that contains the project name, version, and other details. If set to <code>true</code> instead of a path string, the first <code>package.json</code> file found in the source paths.
        </td>
    </tr>
    <tr>
        <td><b><code>module</code></b></td>
        <td><code>Boolean</code></td>
        <td><code>true</code></td>
        <td>
            Specifies whether to include <code>module.exports</code> symbols.
        </td>
    </tr>
    <tr>
        <td><b><code>undocumented</code></b></td>
        <td><code>Boolean</code></td>
        <td><code>true</code></td>
        <td>
            Specifies whether to include undocumented symbols.
        </td>
    </tr>
    <tr>
        <td><b><code>undescribed</code></b></td>
        <td><code>Boolean</code></td>
        <td><code>true</code></td>
        <td>
            Specifies whether to include symbols without a description.
        </td>
    </tr>
    <tr>
        <td><b><code>relativePath</code></b></td>
        <td><code>String</code></td>
        <td><code>undefined</code></td>
        <td>
            When set, all <code>symbol.meta.path</code> values will be relative to this path.
        </td>
    </tr>
    <tr>
        <td><b><code>hierarchy</code></b></td>
        <td><code>Boolean</code></td>
        <td><code>false</code></td>
        <td>
            Specifies whether to arrange symbols by their hierarchy. This will find and move symbols that have a <code>memberof</code> property to a <code>$members</code> property of their corresponding owners. Also the constructor symbol will be moved to a <code>$constructor</code> property of the <code>ClassDeclaration</code> symbol; if any.
        </td>
    </tr>
    <tr>
        <td><b><code>sort</code></b></td>
        <td><code>Boolean|String</code></td>
        <td><code>false</code></td>
        <td>
            Specifies whether to sort the documentation symbols. For alphabetic sort, set to <code>true</code> or <code>"alphabetic"</code>. To additionally group by scope (static/instance) set to <code>"grouped"</code>. Set to <code>false</code> to disable.
        </td>
    </tr>
</table>

---

### Change-log:

**v0.7.0** (2016-05-05)  
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

 ---

### TODO:

- `options.source` for parsing source code. This should create a temp file before parsing.
