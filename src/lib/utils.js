/* eslint camelcase:0 */

module.exports = (function () {

    var utils = {};

    function getStr(value) {
        return value && value.trim() !== '' ? value : null;
    }

    // Cleans the given symbol name.
    // e.g. <anonymous>~obj.doStuff —> obj.doStuff
    function cleanName(name) {
        return (name || '').replace(/([^>]+>)?~?(.*)/, '$2');
    }

    // e.g.
    // var symbol = { code: { meta: { type: "MethodDefinition" } } };
    // utils.notate(symbol, "code.meta.type") => "MethodDefinition"
    // See https://github.com/onury/notation for an advanced library.
    utils.notate = function (obj, notation) {
        if (typeof obj !== 'object') return;
        // console.log('n', notation);
        var o,
            props = !Array.isArray(notation)
                ? notation.split('.')
                : notation,
            prop = props[0];
        if (!prop) return;
        o = obj[prop];
        if (props.length > 1) {
            props.shift();
            return utils.notate(o, props);
        }
        return o;
    };

    /**
     *  Gets the short name of the given symbol.
     *  JSDoc overwrites the `longname` and `name` of the symbol, if it has an
     *  alias. This returns the correct short name.
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {String}
     */
    utils.getName = function (symbol) {
        // if @alias is set, the original (long) name is generally found at
        // meta.code.name
        if (symbol.alias) {
            var codeName = cleanName(utils.notate(symbol, 'meta.code.name') || '');
            if (codeName) return codeName.replace(/.*?[#.~:](\w+)$/i, '$1');
        }
        return symbol.name;
    };

    /**
     *  Gets the original long name of the given symbol.
     *  JSDoc overwrites the `longname` and `name` of the symbol, if it has an
     *  alias. This returns the correct long name.
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {String}
     */
    utils.getLongName = function (symbol) {
        var longName = cleanName(symbol.longname);
        // if @alias is set, the original (long) name is generally found at
        // meta.code.name
        var codeName = symbol.alias
            ? cleanName(utils.notate(symbol, 'meta.code.name') || '') || longName
            : longName;

        var memberOf = cleanName(symbol.memberof || '');
        if (!memberOf) return codeName;
        var re = new RegExp('^' + memberOf + '[#\\.~:]'),
            dot = symbol.scope === 'instance' ? '#' : '.';
        return re.test(codeName) ? codeName : memberOf + dot + codeName;
    };
    utils.getFullName = utils.getLongName;

    /**
     *  Gets the code name of the given symbol.
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {String} - If no code name, falls back to long name.
     */
    utils.getCodeName = function (symbol) {
        return cleanName(utils.notate(symbol, 'meta.code.name') || '')
            || utils.getLongName(symbol);
    };

    /**
     *  Gets the first matching symbol by the given name.
     *
     *  @param {Array} docs - Documentation symbols array.
     *  @param {String} name - Symbol name to be checked.
     *  @returns {Object} - Symbol object if found. Otherwise, returns `null`.
     */
    utils.getSymbolByName = function (docs, name) {
        var i, symbol;
        for (i = 0; i < docs.length; i++) {
            symbol = docs[i];
            if (symbol.name === name
                    || symbol.longname === name
                    || utils.getCodeName(symbol) === name) {
                return symbol;
            }
            if (symbol.$members) {
                var sym = utils.getSymbolByName(symbol.$members, name);
                if (sym) return sym;
            }
        }
        return null;
    };

    /**
     *  Checks whether the given symbol has global scope.
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    utils.isGlobal = function (symbol) {
        return symbol.scope === 'global';
    };

    /**
     *  Checks whether the given symbol is a namespace.
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    utils.isNamespace = function (symbol) {
        return symbol.kind === 'namespace';
    };

    /**
     *  Checks whether the given symbol is a module.
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    utils.isModule = function (symbol) {
        return symbol.kind === 'module';
    };

    /**
     *  Checks whether the given symbol is a class.
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    utils.isClass = function (symbol) {
        return !utils.isConstructor(symbol)
            && (symbol.kind === 'class'
                || utils.notate(symbol, 'meta.code.type') === 'ClassDeclaration');
    };

    /**
     *  Checks whether the given symbol is a constructor.
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    utils.isConstructor = function (symbol) {
        return symbol.kind === 'class'
            && utils.notate(symbol, 'meta.code.type') === 'MethodDefinition';
    };

    /**
     *  Checks whether the given symbol is a static member.
     *  @alias jsdocx.utils.isStatic
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    utils.isStaticMember = function (symbol) {
        return symbol.scope === 'static';
    };
    utils.isStatic = utils.isStaticMember;

    /**
     *  Checks whether the given symbol has an inner scope.
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    utils.isInner = function (symbol) {
        return symbol.scope === 'inner';
    };

    /**
     *  Checks whether the given symbol is an instance member.
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    utils.isInstanceMember = function (symbol) {
        return symbol.scope === 'instance';
    };

    /**
     *  Checks whether the given symbol is a method.
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    utils.isMethod = function (symbol) {
        var codeType = utils.notate(symbol, 'meta.code.type');
        return symbol.kind === 'function'
            || (codeType === 'MethodDefinition' || codeType === 'FunctionExpression');
    };
    utils.isFunction = utils.isMethod;

    /**
     *  Checks whether the given symbol is an instance method.
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    utils.isInstanceMethod = function (symbol) {
        return utils.isInstanceMember(symbol) && utils.isMethod(symbol);
    };

    /**
     *  Checks whether the given symbol is a static method.
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    utils.isStaticMethod = function (symbol) {
        return utils.isStaticMember(symbol) && utils.isMethod(symbol);
    };

    /**
     *  Checks whether the given symbol is a property.
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    utils.isProperty = function (symbol) {
        return symbol.kind === 'member';
            // && utils.notate(symbol, 'meta.code.type') === 'MethodDefinition';
    };

    /**
     *  Checks whether the given symbol is marked with `@ignore` tag.
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    utils.isIgnored = function (symbol) {
        return symbol.ignore;
    };

    /**
     *  Checks whether the given symbol is an instance property.
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    utils.isInstanceProperty = function (symbol) {
        return utils.isInstanceMember(symbol) && utils.isProperty(symbol);
    };

    /**
     *  Checks whether the given symbol is a static property.
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    utils.isStaticProperty = function (symbol) {
        return utils.isStaticMember(symbol) && utils.isProperty(symbol);
    };

    /**
     *  Checks whether the given symbol is a custom type definition.
     *  @alias utils.isCustomType
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    utils.isTypeDef = function (symbol) {
        return symbol.kind === 'typedef';
    };
    /**
     *  Alias for `utils.isTypeDef`
     *  @private
     */
    utils.isCustomType = utils.isTypeDef;

    /**
     *  Checks whether the given symbol is an enumeration.
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    utils.isEnum = function (symbol) {
        return symbol.isEnum;
    };

    /**
     *  Checks whether the given symbol is read-only.
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    utils.isReadOnly = function (symbol) {
        return symbol.readonly;
    };

    /**
     *  Checks whether the given symbol has `public` access.
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    utils.isPublic = function (symbol) {
        return typeof symbol.access !== 'string' || symbol.access === 'public';
    };

    /**
     *  Checks whether the given symbol has `private` access.
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    utils.isPrivate = function (symbol) {
        return symbol.access === 'private';
    };

    /**
     *  Checks whether the given symbol has `protected` access.
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    utils.isProtected = function (symbol) {
        return symbol.access === 'protected';
    };

    /**
     *  Checks whether the given symbol is undocumented.
     *  This checks if the symbol has any comments.
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    utils.isUndocumented = function (symbol) {
        // we could use the `undocumented` property but it still seems buggy.
        // https://github.com/jsdoc3/jsdoc/issues/241
        // `undocumented` is omitted (`undefined`) for documented symbols.
        // return symbol.undocumented !== true;
        return !symbol.comments;
    };

    /**
     *  Checks whether the given symbol has description.
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    utils.hasDescription = function (symbol) {
        return Boolean(getStr(symbol.classdesc) || getStr(symbol.description));
    };

    // SORT UTIL

    /**
     *  if group'ed, symbols are sorted with operators (#.~:) intact. Otherwise
     *  operators are not taken into account.
     *  @private
     *  @param   {String|Boolean} sortType
     *           Type of sorting function. Either `"alphabetic"` or `"grouped"`.
     *           If boolean `true` passed, defaults to `"alphabetic"`, otherwise
     *           returns null;
     *  @param   {String} [prop]
     *           If each item is an object, you can set the property name to be
     *           used for sorting. Otherwise, omit this.
     *  @returns {Function}
     */
    utils._getSorter = function (sortType, prop) {
        if (!sortType) return null;
        var re = /[#.~:]/g,
            group = sortType === 'grouped';
        if (!group) {
            return function symbolSorter(a, b) {
                // alphabetic sort (ignoring operators)
                var A = (prop ? a[prop] : a).replace(re, '_');
                var B = (prop ? b[prop] : b).replace(re, '_');
                return A.toLocaleUpperCase().localeCompare(B.toLocaleUpperCase());
                // console.log('comparing:', A, '<<—>>', B, '==>', result);
            };
        }
        // grouped sort (by scope). also moving inner symbols to end.
        return function symbolSorter(a, b) {
            var A = prop ? a[prop] : a;
            var B = prop ? b[prop] : b;
            var aInner = A.indexOf('~') >= 0;
            var bInner = B.indexOf('~') >= 0;
            return (aInner && bInner) || (!aInner && !bInner)
                ? A.toLocaleUpperCase().localeCompare(B.toLocaleUpperCase())
                : (aInner ? 1 : -1);
            // console.log('comparing:', A, A.indexOf('~') >= 0, '<<—>>', B, B.indexOf('~') >= 0, '==>', result);
        };
    };

    /**
     *  Used within utils.getSymbolNames()
     *  @private
     */
    function _getSymNames(data, memo) {
        memo = memo || [];
        data.forEach(function (symbol) {
            // var longName = jsdocx.utils.getFullName(symbol);
            memo.push(symbol.$longname);
            if (!symbol.isEnum && symbol.$members) {
                memo = _getSymNames(symbol.$members, memo);
            }
        });
        return memo;
    }

    /**
     *  Builds and gets a flat array of symbol names from the given jsdoc-x
     *  parsed output.
     *
     *  @param {Array} docs - JSDoc documentation data.
     *  @param {String|Function} [sorter]
     *         Either a comparer function to be used for sorting; or a
     *         pre-defined string: `"alphabetic"` or `"grouped"`.
     *
     *  @returns {Array} - Array of symbol names.
     */
    utils.getSymbolNames = function (docs, sorter) {
        var sortFn = typeof sorter === 'function'
            ? sorter
            : utils._getSorter(sorter);
        var names = _getSymNames(docs);
        if (sortFn) names.sort(sortFn);
        return names;
    };

    // ---------------------------

    return utils;

})();
