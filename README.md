## jsdoc-x

![npm](https://img.shields.io/npm/v/jsdoc-x.svg)
![release](https://img.shields.io/github/release/onury/jsdoc-x.svg)
![license](http://img.shields.io/npm/l/jsdoc-x.svg)

Parser to output a customized Javascript object via JSDoc's explain (`-X`) command.  

### Under development...

> Author: Onur Yıldırım (@onury)  
> © 2016 — Licensed under the MIT License.  

**Install via NPM**:
```shell
npm install jsdoc-x
```

### Usage:

```js
var jsdocx = require('jsdoc-x');
```

#### `jsdocx.parse()`  

Executes the `jsdoc -X` command and parses the output into a Javascript object/array; with the specified options.  

with Promise...
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

### Options:

<table>
    <tr>
        <td><b>Option</b></td>
        <td><b>Type</b></td>
        <td><b>Default</b></td>
        <td><b>Description</b></td>
    </tr>
    <tr>
        <td><code>files</code></td>
        <td>`String|Array`</td>
        <td>`undefined`</td>
        <td>
            Required (if `source` is not set). One or more file/directory paths to be processed.
        </td>
    </tr>
    <tr>
        <td>`source`</td>
        <td>`String`</td>
        <td>`undefined`</td>
        <td>
            Required (if `files` is not set). Documented source code to be processed.
        </td>
    </tr>
    <tr>
        <td>`encoding`</td>
        <td>`String`</td>
        <td>`"utf8"`</td>
        <td>Encoding to be used when reading source files.</td>
    </tr>
    <tr>
        <td>`recurse`</td>
        <td>`Boolean`</td>
        <td>`false`</td>
        <td>
            Specifies whether to recurse into subdirectories when scanning for source files.
        </td>
    </tr>
    <tr>
        <td>`pedantic`</td>
        <td>`Boolean`</td>
        <td>`false`</td>
        <td>
            Specifies whether to treat errors as fatal errors, and treat warnings as errors.
        </td>
    </tr>
    <tr>
        <td>`access`</td>
        <td>`String|Array`</td>
        <td>`undefined`</td>
        <td>
            Specifies which symbols to be processed with the given access property. Possible values: `"private"`, `"protected"`, `"public"` or `"all"` (for all access levels). By default, all except private symbols are processed. Note that, if access is not set for a documented symbol, it will still be included, regardless of this option.
        </td>
    </tr>
    <tr>
        <td>`private`</td>
        <td>`Boolean`</td>
        <td>`false`</td>
        <td></td>
    </tr>
    <tr>
        <td>`package`</td>
        <td>`String`</td>
        <td>`undefined`</td>
        <td>
            The path to the `package.json` file that contains the project name, version, and other details. If set to `true` instead of a path string, the first `package.json` file found in the source paths.
        </td>
    </tr>
    <tr>
        <td>`module`</td>
        <td>`Boolean`</td>
        <td>`true`</td>
        <td>
            Specifies whether to include `module.exports` symbols.
        </td>
    </tr>
    <tr>
        <td>`undocumented`</td>
        <td>`Boolean`</td>
        <td>`true`</td>
        <td>
            Specifies whether to include undocumented symbols.
        </td>
    </tr>
    <tr>
        <td>`undescribed`</td>
        <td>`Boolean`</td>
        <td>`true`</td>
        <td>
            Specifies whether to include symbols without a description.
        </td>
    </tr>
    <tr>
        <td>`relativePath`</td>
        <td>`String`</td>
        <td>`undefined`</td>
        <td>
            When set, all `symbol.meta.path` values will be relative to this path.
        </td>
    </tr>
    <tr>
        <td>`filter`</td>
        <td>`Function`</td>
        <td>`undefined`</td>
        <td>
            This is used to filter the parsed documentation output array. If a `Function` is passed; it's invoked for each included `symbol`. e.g. `function (symbol) { return symbol; }` Returning a falsy value will remove the symbol from the output. Returning `true` will keep the original symbol. To keep the symbol and alter its contents, simply return an altered symbol object.
        </td>
    </tr>
    <tr>
        <td>`output`</td>
        <td>`String|Object`</td>
        <td>`undefined`</td>
        <td>
            Path for a JSON file to be created, containing the output documentation array. Or you can set this to an object for extra options.  

            <table>
                <tr>
                    <td>Option</td>
                    <td>Type</td>
                    <td>Default</td>
                    <td>Description</td>
                </tr>
                <tr>
                    <td>output.path</td>
                    <td>`String`</td>
                    <td>`undefined`</td>
                    <td>Path for a JSON file to be created.</td>
                </tr>
                <tr>
                    <td>output.indent</td>
                    <td>`Boolean|Number`</td>
                    <td>`false`</td>
                    <td>Number of spaces for indentation. If set to `true`, 2 spaces will be used.</td>
                </tr>
                <tr>
                    <td>output.force</td>
                    <td>`Boolean`</td>
                    <td>`false`</td>
                    <td>Whether to create parent directories if they don't exist.</td>
                </tr>
            </table>
        </td>
    </tr>
</table>
