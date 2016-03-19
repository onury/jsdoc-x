## jsdoc-x

![npm](https://img.shields.io/npm/v/jsdoc-x.svg)
![release](https://img.shields.io/github/release/onury/jsdoc-x.svg)
![license](http://img.shields.io/npm/l/jsdoc-x.svg)

Parser to output a customized Javascript object via JSDoc's explain (`-X`) command.  

> © 2016, Onur Yıldırım (@onury). MIT License.  

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
        <td><b><code>files</code></b></td>
        <td><code>String|Array</code></td>
        <td><code>undefined</code></td>
        <td>
            Required (if <code>source</code> is not set). One or more file/directory paths to be processed.
        </td>
    </tr>
    <tr>
        <td><b><code>source</code></b></td>
        <td><code>String</code></td>
        <td><code>undefined</code></td>
        <td>
            (NOT IMPLEMENTED YET) Required (if <code>files</code> is not set). Documented source code to be processed.
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
        <td><b><code>filter</code></b></td>
        <td><code>Function</code></td>
        <td><code>undefined</code></td>
        <td>
            This is used to filter the parsed documentation output array. If a <code>Function</code> is passed; it's invoked for each included <code>symbol</code>. e.g. <code>function (symbol) { return symbol; }</code> Returning a falsy value will remove the symbol from the output. Returning <code>true</code> will keep the original symbol. To keep the symbol and alter its contents, simply return an altered symbol object.
        </td>
    </tr>
    <tr>
        <td><b><code>output</code></b></td>
        <td><code>String|Object</code></td>
        <td><code>undefined</code></td>
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
                    <td><b><code>output.path</code></b></td>
                    <td><code>String</code></td>
                    <td><code>undefined</code></td>
                    <td>Path for a JSON file to be created.</td>
                </tr>
                <tr>
                    <td><b><code>output.indent</code></b></td>
                    <td><code>Boolean|Number</code></td>
                    <td><code>false</code></td>
                    <td>Number of spaces for indentation. If set to <code>true</code>, 2 spaces will be used.</td>
                </tr>
                <tr>
                    <td><b><code>output.force</code></b></td>
                    <td><code>Boolean</code></td>
                    <td><code>false</code></td>
                    <td>Whether to create parent directories if they don't exist.</td>
                </tr>
            </table>
        </td>
    </tr>
</table>

### Example Output:

```js
[
  {
    "comment": "/**\n * This is the Code class for testing jsdoc-x. */",
    "meta": {
      "range": [
        445,
        9624
      ],
      "filename": "code.js",
      "lineno": 14,
      "path": "../lib",
      "code": {
        "id": "astnode100000001",
        "name": "Code",
        "type": "ClassDeclaration",
        "paramnames": [
          "options"
        ]
      }
    },
    "classdesc": "This is the Code class for testing jsdoc-x.",
    "see": [
      "{@link https://github.com/onury/jsdoc-x|GitHub Project}"
    ],
    "license": "MIT",
    "copyright": "2016, Onur Yıldırım (onur@cutepilot.com)",
    "name": "Code",
    "longname": "Code",
    "kind": "class",
    "scope": "global",
    "description": "Initiates a new instance of the `Code` class.",
    "params": [
      {
        "type": {
          "names": [
            "Object"
          ]
        },
        "description": "Optional. Configuration object.",
        "name": "options"
      },
      {
        "type": {
          "names": [
            "String"
          ]
        },
        "description": "Default: `\"en\"`.\n    Language to be used for API requests that supports language configurations.",
        "name": "options.language"
      },
      {
        "type": {
          "names": [
            "Boolean"
          ]
        },
        "description": "Default: `true`.\n    If set to `true`, the API calls are made over HTTPS, at all times.",
        "name": "options.https"
      }
    ]
  }
]
```

---

### Change-log:

**v0.4.7** (2016-03-19)  
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
