/* eslint camelcase:0, no-unused-vars:0, no-new-object:0, no-undef:0, new-cap:0, no-array-constructor:0 */

// DO NOT CHANGE descriptions of JSDoc comments.
// They're used to get the symbol in tests.

/**
 *  global
 *  @global
 *  @type {Object}
 */
const aGlobal = {};

/**
 *  namespace
 *  @namespace
 *  @type {Object}
 */
const ns = {};

/**
 *  module
 *  @module hurler
 *  @emits module:hurler~snowball
 */
module.exports = function () {
    /**
     * Event reporting that a snowball has been hurled.
     *
     * @event module:hurler~snowball
     * @property {number} velocity - The snowball's velocity, in meters per second.
     */

    return {};
};

/**
 *  @exports myObject
 */
function someModule() {}

/**
 *  generator
 *  @generator
 *  @function fibonacci
 *  @yields {number} The next number.
 */
function * generator(i) {
    yield i;
    yield i + 10;
}

/**
 *  callback
 *  @callback MyLib#Callback
 *  @param {number} code
 *  @param {string} message
 */

/**
 *  instance-member
 *  @return {Boolean}
 */
const arrowMethod = () => {
    return true;
};

/**
 *  class
 */
class UtilsTest {

    /**
     *  instance-method
     *  @return {Boolean}
     */
    method() {
        return true;
    }

    /**
     *  ignore
     *  @ignore
     *  @return {Boolean}
     */
    ignore() {
        return true;
    }

    /**
     *  readonly
     *  @readonly
     *  @return {Boolean}
     */
    readonly() {
        return true;
    }

    /**
     *  private
     *  @private
     *  @return {Boolean}
     */
    private() {
        return true;
    }

    /**
     *  has-desc
     *  @return {Boolean}
     */
    hasDesc() {
        return true;
    }

    /**
     *
     *  @return {Boolean}
     */
    noDesc() {
        return true;
    }

    /**
     *  protected
     *  @protected
     *  @return {Boolean}
     */
    protected() {
        return true;
    }

    /**
     *  prop
     *  @return {Boolean}
     */
    get prop() {
        return {
            /**
             *  inner-prop
             *  @name UtilsTest.prop~inner
             *  @inner
             */
            inner: true
        };
    }

    /**
     *  instance-prop
     *  @return {Boolean}
     */
    get instanceProp() {
        return true;
    }

    /**
     *  static-method
     *  @return {Boolean}
     */
    static staticMethod() {
        return true;
    }

    /**
     *  static-prop
     *  @return {Boolean}
     */
    static get staticProp() {
        return true;
    }

    /**
     *  enumeration
     *  @enum {String}
     */
    static get enumeration() {
        return {
            a: 'a',
            b: 'b'
        };
    }
}

/**
 *  event
 *  @event UtilsTest#ready
 *  @type {UtilsTest.SomeObj}
 */

/**
 *  typedef
 *  @typedef {Number} NumberLike
 */
