
/**
 *  global
 *  @global
 *  @type {GlobalObject}
 */
const go = {};

/**
 *  typedef
 *  @typedef SomeType
 */

/**
 *  instance
 *  @instance
 *  @type {Number}
 */
const instanceMember = 1;

/**
 *  constant
 *  @constant
 *  @type {Number}
 */
const CONSTANT = 1;

/**
 *  module
 *  @module
 *  @type {Object}
 */
const someModule = {};

/**
 *  interface
 *  @interface
 *  @type {Object}
 */
const someInterface = {};

/**
 *  event
 *  @event SomeClass#SomeEvent
 */

/**
 * external
 * @external String
 */

/**
 * ROT13-encoded
 * @function external:String#rot13
 */

/**
 * mixin
 * @mixin
 */
const SomeMixin = {};

/**
 *  My Test Class.
 */
export class KTestClass extends KOtherClass {

    static kprop = 'this is a static property. ES2015 stage-1 proposal.';

    /**
     *  namespace
     *  @namespace
     *  @type {NamespaceObj}
     */
    static ns = {};

    /**
     *  Abstract method.
     *  @abstract
     *  @return {Number}
     */
    abstract = () => {
        throw new Error('must be implemented by subclass!');
    }

    /**
     *  inner
     *  @inner
     *  @return {Number}
     */
    get _inner() {
        return 1;
    }

    /**
     *  augments
     *  @augments SomeOther
     *  @return {Number}
     */
    augments = () => {
        return true;
    }

    /**
     *  Download data from the specified URL.
     *
     *  @async
     *  @function downloadData
     *  @param {string} url - The URL to download from.
     *  @return {Promise<string>} The data from the URL.
     */
    asyncMethod = () => {
        return true;
    }

    /**
     *  protected
     *  @protected
     *  @return {Number}
     */
    protectedMethod = () => {
        return true;
    }
}

/**
 * static
 * @static
 */
KTestClass.staticMember = 1;

/**
 * static-private
 * @static
 * @private
 */
KTestClass._staticPrivateMember = 1;

/**
 * global-func
 * @global
 * @function
 */
function MyFunc() {

}

/**
 * global-obj
 * @global
 * @type {Object}
 */
const MyObj = {};

/**
 * global-obj2
 * @global
 * @type {Object}
 */
let MyObj2 = {};
