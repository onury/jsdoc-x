/* eslint camelcase:0 */

/**
 *  global-function
 */
function globalFunction() {}

/**
 *  global-object
 */
let globalObject = {};

/**
 * class
 */
class Code {

    /**
     * Iconstructor
     */
    constructor(options) {
        this.options = options;
    }

    // /**
    //  * props
    //  * @type {Object}
    //  * @memberof Code
    //  *
    //  * @property {Number} zOption - z option.
    //  * @property {Number} bOption - b option.
    //  * @property {Number} _opt - _opt option.
    //  * @property {Number} aOption - a option.
    //  */
    // get config() {
    //     return {
    //         zOption: 3,
    //         bOption: 2,
    //         _opt: 4,
    //         aOption: 1
    //     };
    // }

    /**
     * prop
     * @memberof Code
     * @type {Object}
     * @private
     */
    get cPrivateInstanceProp() {
        return 1;
    }

    /**
     * prop
     * @memberof Code
     * @type {Object}
     * @private
     */
    get privateInstanceProp() {
        return 1;
    }

    /**
     * prop
     * @memberof Code
     * @type {Object}
     * @private
     */
    get aPrivateInstanceProp() {
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

    // /**
    //  * obj
    //  * @memberof Code
    //  * @type {Object}
    //  */
    // static get utils() {
    //     return {};
    // }

    // /**
    //  * This symbol is ignored
    //  * @memberof Code
    //  * @type {Object}
    //  * @ignore
    //  */
    // static get ignored() {
    //     return 'this symbol is ignored';
    // }

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

    // /**
    //  * a
    //  * @memberof Code
    //  */
    // static aStaticMethod() {
    //     return 'a';
    // }

    /**
     * instance method
     * @memberof Code
     */
    instanceMethod() {
        return 1;
    }

    // /**
    //  * b
    //  * @memberof Code
    //  */
    // bInstanceMethod() {
    //     return 'b';
    // }

}

/**
 *  exporting
 */
export default Code;
