/**
 * This is the test2 module for testing jsdoc-x.
 *
 * @module test2
 *
 * @see {@link https://github.com/onury/jsdoc-x|GitHub Project}
 *
 * @license MIT
 * @copyright 2016, David H. Bronke (whitelynx@gmail.com)
 */

var Code = require('./code');

/**
 * This is a test class.
 *
 * @memberof module:test2
 */
class Test2 {

    /**
     * Construct an instance of the {@linkcode Test2} class.
     */
    constructor() {
        /**
         * An instance of the {@linkcode Code} class.
         *
         * @type {Code}
         */
        this.code = new Code({});
    }

}

/**
 * This is a test function.
 */
function testFunc() {
}

/**
 *  exporting
 */
export default {
    Test2,
    testFunc
};
