'use strict';

function getStr(value) {
    return value && value.trim() !== '' ? value : null;
}

// Cleans the given symbol name.
// e.g. <anonymous>~obj.doStuff —> obj.doStuff
function cleanName(name) {
    return (name || '').replace(/([^>]+>)?~?(.*)/, '$2')
        .replace(/^(module\.)?exports\./, '');
}

function notate(obj, notation) {
    if (typeof obj !== 'object') return;
    const props = !Array.isArray(notation)
        ? notation.split('.')
        : notation;
    let prop = props[0];
    if (!prop) return;
    const o = obj[prop];
    if (props.length > 1) {
        props.shift();
        return notate(o, props);
    }
    return o;
}

function getMetaCodeName(symbol) {
    return cleanName(notate(symbol, 'meta.code.name') || '');
}

// Used within utils.getSymbolNames()
function getSymNames(data, memo) {
    memo = memo || [];
    data.forEach(function (symbol) {
        // var longName = jsdocx.utils.getFullName(symbol);
        memo.push(symbol.$longname);
        if (!symbol.isEnum && symbol.$members) {
            memo = getSymNames(symbol.$members, memo);
        }
    });
    return memo;
}

// ---------------------------
// UTILS
// ---------------------------

const utils = {

    /**
     *  Gets the value from the given object, with the specified notation. See
     *  {@link https://github.com/onury/notation|Notation} for an advanced library.
     *  @name jsdocx.utils.notate
     *  @function
     *
     *  @param {Object} obj - Source object.
     *  @param {String} notation - Dot-notation of the property whose value will be
     *  fetched.
     *
     *  @returns {*}
     *
     *  @example
     *  const symbol = { code: { meta: { type: "MethodDefinition" } } };
     *  utils.notate(symbol, "code.meta.type"); // —> "MethodDefinition"
     */
    notate,

    /**
     *  Gets the short name of the given symbol.
     *  JSDoc overwrites the `longname` and `name` of the symbol, if it has an
     *  alias. This returns the correct short name.
     *  @name jsdocx.utils.getName
     *  @function
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {String}
     */
    getName(symbol) {
        // if @alias is set, the original (long) name is generally found at
        // meta.code.name
        if (symbol.alias) {
            var codeName = getMetaCodeName(symbol);
            if (codeName) return codeName.replace(/.*?[#.~:](\w+)$/i, '$1');
        }
        return symbol.name;
    },

    /**
     *  Gets the original long name of the given symbol.
     *  JSDoc overwrites the `longname` and `name` of the symbol, if it has an
     *  alias. This returns the correct long name.
     *  @name jsdocx.utils.getLongName
     *  @function
     *  @alias jsdocx.utils.getFullName
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {String}
     */
    getLongName(symbol) {
        var longName = cleanName(symbol.longname);
        var metaCodeName = getMetaCodeName(symbol) || longName;
        var memberOf = cleanName(symbol.memberof || '');

        // JSDoc bug: if the constructor is not marked with @constructs, the
        // longname is incorrect. e.g. `ClassName#ClassName`. So we return
        // (clean) meta.code.name in this case. e.g. `ClassName`
        if (symbol.name === memberOf && utils.isConstructor(symbol)) {
            return metaCodeName;
        }

        // if @alias is set, the original (long) name is generally found at
        // meta.code.name
        var codeName = symbol.alias ? metaCodeName : longName;

        if (!memberOf) return codeName;
        var re = new RegExp('^' + memberOf + '[#\\.~:]'),
            dot = symbol.scope === 'instance' ? '#' : '.';

        return re.test(codeName) ? codeName : memberOf + dot + codeName;
    },

    /**
     *  Gets the code name of the given symbol.
     *  @name jsdocx.utils.getCodeName
     *  @function
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {String} - If no code name, falls back to long name.
     */
    getCodeName(symbol) {
        return getMetaCodeName(symbol) || utils.getLongName(symbol);
    },

    /**
     *  Gets the first matching symbol by the given name.
     *  @name jsdocx.utils.getSymbolByName
     *  @function
     *
     *  @param {Array} docs - Documentation symbols array.
     *  @param {String} name - Symbol name to be checked.
     *  @returns {Object} - Symbol object if found. Otherwise, returns `null`.
     */
    getSymbolByName(docs, name) {
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
    },

    /**
     *  Checks whether the given symbol has global scope.
     *  @name jsdocx.utils.isGlobal
     *  @function
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    isGlobal(symbol) {
        return symbol.scope === 'global';
    },

    /**
     *  Checks whether the given symbol is a namespace.
     *  @name jsdocx.utils.isNamespace
     *  @function
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    isNamespace(symbol) {
        return symbol.kind === 'namespace';
    },

    /**
     *  Checks whether the given symbol is a module.
     *  @name jsdocx.utils.isModule
     *  @function
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    isModule(symbol) {
        return symbol.kind === 'module';
    },

    /**
     *  Checks whether the given symbol is a class.
     *  @name jsdocx.utils.isClass
     *  @function
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    isClass(symbol) {
        return !utils.isConstructor(symbol)
            && (symbol.kind === 'class'
                || utils.notate(symbol, 'meta.code.type') === 'ClassDeclaration');
    },

    /**
     *  Checks whether the given symbol is a constructor.
     *  @name jsdocx.utils.isConstructor
     *  @function
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    isConstructor(symbol) {
        return symbol.kind === 'class'
            && utils.notate(symbol, 'meta.code.type') === 'MethodDefinition';
    },

    /**
     *  Checks whether the given symbol is a static member.
     *  @name jsdocx.utils.isStaticMember
     *  @function
     *  @alias jsdocx.utils.isStatic
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    isStaticMember(symbol) {
        return symbol.scope === 'static';
    },

    /**
     *  Checks whether the given symbol has an inner scope.
     *  @name jsdocx.utils.isInner
     *  @function
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    isInner(symbol) {
        return symbol.scope === 'inner';
    },

    /**
     *  Checks whether the given symbol is an instance member.
     *  @name jsdocx.utils.isInstanceMember
     *  @function
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    isInstanceMember(symbol) {
        return symbol.scope === 'instance';
    },

    /**
     *  Checks whether the given symbol is a method.
     *  @name jsdocx.utils.isMethod
     *  @function
     *  @alias jsdocx.utils.isFunction
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    isMethod(symbol) {
        var codeType = utils.notate(symbol, 'meta.code.type');
        return symbol.kind === 'function'
            || (codeType === 'MethodDefinition' || codeType === 'FunctionExpression');
    },

    /**
     *  Checks whether the given symbol is an instance method.
     *  @name jsdocx.utils.isInstanceMethod
     *  @function
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    isInstanceMethod(symbol) {
        return utils.isInstanceMember(symbol) && utils.isMethod(symbol);
    },

    /**
     *  Checks whether the given symbol is a static method.
     *  @name jsdocx.utils.isStaticMethod
     *  @function
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    isStaticMethod(symbol) {
        return utils.isStaticMember(symbol) && utils.isMethod(symbol);
    },

    /**
     *  Checks whether the given symbol is a property.
     *  @name jsdocx.utils.isProperty
     *  @function
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    isProperty(symbol) {
        return symbol.kind === 'member';
        //   && utils.notate(symbol, 'meta.code.type') === 'MethodDefinition';
    },

    /**
     *  Checks whether the given symbol is marked with `@ignore` tag.
     *  @name jsdocx.utils.isIgnored
     *  @function
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    isIgnored(symbol) {
        return symbol.ignore;
    },

    /**
     *  Checks whether the given symbol is an instance property.
     *  @name jsdocx.utils.isInstanceProperty
     *  @function
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    isInstanceProperty(symbol) {
        return utils.isInstanceMember(symbol) && utils.isProperty(symbol);
    },

    /**
     *  Checks whether the given symbol is a static property.
     *  @name jsdocx.utils.isStaticProperty
     *  @function
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    isStaticProperty(symbol) {
        return utils.isStaticMember(symbol) && utils.isProperty(symbol);
    },

    /**
     *  Checks whether the given symbol is a custom type definition.
     *  @name jsdocx.utils.isTypeDef
     *  @function
     *  @alias utils.isCustomType
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    isTypeDef(symbol) {
        return symbol.kind === 'typedef';
    },

    /**
     *  Checks whether the given symbol is an enumeration.
     *  @name jsdocx.utils.isEnum
     *  @function
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    isEnum(symbol) {
        return symbol.isEnum;
    },

    /**
     *  Checks whether the given symbol is read-only.
     *  @name jsdocx.utils.isReadOnly
     *  @function
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    isReadOnly(symbol) {
        return symbol.readonly;
    },

    /**
     *  Checks whether the given symbol has `public` access.
     *  @name jsdocx.utils.isPublic
     *  @function
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    isPublic(symbol) {
        return typeof symbol.access !== 'string' || symbol.access === 'public';
    },

    /**
     *  Checks whether the given symbol has `private` access.
     *  @name jsdocx.utils.isPrivate
     *  @function
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    isPrivate(symbol) {
        return symbol.access === 'private';
    },

    /**
     *  Checks whether the given symbol has `protected` access.
     *  @name jsdocx.utils.isProtected
     *  @function
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    isProtected(symbol) {
        return symbol.access === 'protected';
    },

    /**
     *  Checks whether the given symbol is undocumented.
     *  This checks if the symbol has any comments.
     *  @name jsdocx.utils.isUndocumented
     *  @function
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    isUndocumented(symbol) {
        // we could use the `undocumented` property but it still seems buggy.
        // https://github.com/jsdoc3/jsdoc/issues/241
        // `undocumented` is omitted (`undefined`) for documented symbols.
        // return symbol.undocumented !== true;
        return !symbol.comments;
    },

    /**
     *  Checks whether the given symbol has description.
     *  @name jsdocx.utils.hasDescription
     *  @function
     *
     *  @param {Object} symbol - Documented symbol object.
     *  @returns {Boolean}
     */
    hasDescription(symbol) {
        return Boolean(getStr(symbol.classdesc) || getStr(symbol.description));
    },

    /**
     *  Builds and gets a flat array of symbol names from the given jsdoc-x
     *  parsed output.
     *  @name jsdocx.utils.getSymbolNames
     *  @function
     *
     *  @param {Array} docs - JSDoc documentation data.
     *  @param {String|Function} [sorter]
     *         Either a comparer function to be used for sorting; or a
     *         pre-defined string: `"alphabetic"` or `"grouped"`.
     *
     *  @returns {Array} - Array of symbol names.
     */
    getSymbolNames(docs, sorter) {
        var sortFn = typeof sorter === 'function'
            ? sorter
            : utils._getSorter(sorter);
        var names = getSymNames(docs);
        if (sortFn) names.sort(sortFn);
        return names;
    },

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
    _getSorter(sortType, prop) {
        if (!sortType) return null;
        var re = /[#.~:]/g,
            group = sortType === 'grouped';
        if (!group) {
            return (a, b) => {
                // alphabetic sort (ignoring operators)
                var A = (prop ? a[prop] : a).replace(re, '_');
                var B = (prop ? b[prop] : b).replace(re, '_');
                return A.toLocaleUpperCase().localeCompare(B.toLocaleUpperCase());
                // console.log('comparing:', A, '<<—>>', B, '==>', result);
            };
        }
        // grouped sort (by scope). also moving inner symbols to end.
        return (a, b) => {
            var A = prop ? a[prop] : a;
            var B = prop ? b[prop] : b;
            var aInner = A.indexOf('~') >= 0;
            var bInner = B.indexOf('~') >= 0;
            return (aInner && bInner) || (!aInner && !bInner)
                ? A.toLocaleUpperCase().localeCompare(B.toLocaleUpperCase())
                : (aInner ? 1 : -1);
            // console.log('comparing:', A, A.indexOf('~') >= 0, '<<—>>', B, B.indexOf('~') >= 0, '==>', result);
        };
    }

};

/**
 *  Alias of `getLongName`.
 *  @private
 */
utils.getFullName = utils.getLongName;
/**
 *  Alias of `isStaticMember`.
 *  @private
 */
utils.isStatic = utils.isStaticMember;
/**
 *  Alias of `isMethod`.
 *  @private
 */
utils.isFunction = utils.isMethod;
/**
 *  Alias for `isTypeDef`
 *  @private
 */
utils.isCustomType = utils.isTypeDef;
/**
 *  @private
 */
utils._cleanName = cleanName;

module.exports = utils;
