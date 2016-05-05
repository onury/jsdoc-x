/* eslint camelcase:0 */

module.exports = (function () {

    var utils = {};

    // e.g.
    // var symbol = { code: { meta: { type: "MethodDefinition" } } };
    // notate(symbol, "code.meta.type") => "MethodDefinition"
    // See https://github.com/onury/notation for an advanced library.
    function notate(obj, notation) {
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
            return notate(o, props);
        }
        return o;
    }

    function getStr(value) {
        return value && value.trim() !== '' ? value : null;
    }

    // ---------------------------

    // we could use the `undocumented` property but it still seems buggy.
    // https://github.com/jsdoc3/jsdoc/issues/241
    // `undocumented` is omitted (`undefined`) for documented symbols.
    // return symbol.undocumented !== true;
    utils.hasDescription = function (symbol) {
        return Boolean(getStr(symbol.classdesc) || getStr(symbol.description));
    };

    utils.getFullName = function (symbol) {
        var codeName = notate(symbol, 'meta.code.name') || '',
            re = /[^#\.~]/g;
        return codeName.replace(re, '').length >= symbol.longname.replace(re, '').length
            ? codeName
            : symbol.longname;
    };

    // if @alias is set, the original (long) name is only found at meta.code.name
    utils.getName = function (symbol) {
        var name = notate(symbol, 'meta.code.name');
        if (name) {
            return name.replace(/.*?[#\.~](\w+)$/i, '$1');
        }
        return symbol.name;
    };

    // gets the first matching symbol
    utils.getSymbolByName = function (docs, name) {
        var i, symbol;
        for (i = 0; i < docs.length; i++) {
            symbol = docs[i];
            if (symbol.name === name
                    || symbol.longname === name
                    || utils.getFullName(symbol) === name) {
                return symbol;
            }
            if (symbol.$members) {
                var sym = utils.getSymbolByName(symbol.$members, name);
                if (sym) return sym;
            }
        }
        return null;
    };

    utils.isGlobal = function (symbol) {
        return symbol.scope === 'global';
    };

    utils.isNamespace = function (symbol) {
        return symbol.kind === 'namespace';
    };

    utils.isClass = function (symbol) {
        return symbol.kind === 'class'
            && notate(symbol, 'meta.code.type') === 'ClassDeclaration';
    };

    utils.isConstructor = function (symbol) {
        return symbol.kind === 'class'
            && notate(symbol, 'meta.code.type') === 'MethodDefinition';
    };

    utils.isStaticMember = function (symbol) {
        return symbol.scope === 'static';
    };
    utils.isInstanceMember = function (symbol) {
        return symbol.scope === 'instance';
    };

    utils.isMethod = function (symbol) {
        return symbol.kind === 'function'
            && notate(symbol, 'meta.code.type') === 'MethodDefinition';
    };
    utils.isInstanceMethod = function (symbol) {
        return utils.isInstanceMember(symbol) && utils.isMethod(symbol);
    };
    utils.isStaticMethod = function (symbol) {
        return utils.isStaticMember(symbol) && utils.isMethod(symbol);
    };

    utils.isProperty = function (symbol) {
        return symbol.kind === 'member';
            // && notate(symbol, 'meta.code.type') === 'MethodDefinition';
    };
    utils.isInstanceProperty = function (symbol) {
        return utils.isInstanceMember(symbol) && utils.isProperty(symbol);
    };
    utils.isStaticProperty = function (symbol) {
        return utils.isStaticMember(symbol) && utils.isProperty(symbol);
    };

    utils.isEnum = function (symbol) {
        return symbol.isEnum;
    };

    utils.isReadOnly = function (symbol) {
        return symbol.readonly;
    };

    // ---------------------------

    return utils;

})();
