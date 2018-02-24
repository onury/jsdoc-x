/* eslint camelcase:0, no-unused-vars:0, no-new-object:0, no-undef:0, new-cap:0, no-array-constructor:0 */

/**
 *  global-function (FunctionDeclaration)
 */
function xGlobalFunction() {}

/**
 *  global-function (FunctionExpression)
 */
var hGlobalFunction = function () {};

/**
 *  global-object (ObjectExpression)
 */
let aGlobalObject = {};

/**
 *  global-object2 (NewExpression)
 */
let aGlobalObject2 = new Object();

/**
 *  global-array-object-2 (NewExpression)
 */
let gGlobalArray2 = new Array();

/**
 *  global-array-object (ArrayExpression)
 */
let gGlobalArray = [];

/**
 *  global-var (Literal)
 */
let vGlobalVar = 1;

/**
 *  global-obj-external (MemberExpression)
 */
const kGlobalObjExt = SomeObj.prop;

/**
 *  global-obj-external (CallExpression)
 */
let zGlobalObjExt = SomeObj.method();

/**
 *  global-obj-external (Identifier)
 */
let oGlobalObjExt = SomeObj;

/**
 *  global-obj-external (CallExpression)
 */
let fGlobalObjExt = SomeObj();

/**
 * class
 */
class Code {

    /**
     * constructor
     */
    constructor(options) {
        this.options = options;
    }

    /**
     * props
     * @type {Object}
     * @memberof Code
     *
     * @property {Number} pOption - p option.
     * @property {Number} _opt - _opt option.
     */
    get config() {
        return {
            /**
             * @memberof Code#config
             */
            pOption: 2,
            /**
             * @memberof Code#config
             */
            _opt: 4
        };
    }

    /**
     * prop
     * @memberof Code
     * @type {Number}
     * @private
     */
    get cPrivateInstanceProp() {
        return 1;
    }

    /**
     * prop
     * @memberof Code
     * @type {Number}
     * @private
     */
    get privateInstanceProp() {
        return 1;
    }

    /**
     * prop
     * @memberof Code
     * @type {String}
     * @private
     */
    get aPrivateInstanceProp() {
        return '1';
    }

    /**
     * prop
     * @memberof Code
     * @type {Number}
     * @protected
     */
    get bProtectedInstanceProp() {
        return 1;
    }

    /**
     * Error.
     * @memberof Code
     * @type {CodeError}
     * @readonly
     * @static
     */
    static get Error() {
        return Error;
    }

    /**
     * x
     * @memberof Code
     */
    static xStaticMethod() {
        return 'x';
    }

    /**
     * staticMethod
     * @memberof Code
     */
    static bStaticMethod() {
        return 1;
    }

    /**
     * staticMethod
     * @memberof Code
     */
    static staticMethod(options) {
        return new Code(options);
    }

    /**
     * instance method
     * @memberof Code
     */
    instanceMethod() {
        return 1;
    }

}

/**
 *  exporting
 */
export default Code;
