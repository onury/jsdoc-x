/* eslint camelcase:0 */

/**
 * This is the Code class for testing jsdoc-x.
 *
 * Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
 * tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
 * quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
 * consequat.
 *
 * @see {@link https://github.com/onury/jsdoc-x|GitHub Project}
 *
 * @license MIT
 * @copyright 2016, Onur Yıldırım (onur@cutepilot.com)
 */
class Code {

    /**
     * Initiates a new instance of the `Code` class.
     *
     * @param {Object} options - Optional. Configuration object.
     *     @param {String} options.language - Default: `"en"`.
     *     Language to be used for API requests that supports language configurations.
     *     This is generally used for Google APIs.
     *     @param {Object} options.google - Google specific options.
     *         @param {String} options.google.version - Default: `"3.22"`.
     *         Google Maps API version to be used.
     *         You can set a greater value or the latest version number and it
     *         should work; but it's not guaranteed.
     *         Find out the {@link https://developers.google.com/maps/documentation/javascript/versions|latest version here}.
     *
     * @returns {Code} - A new instance of `Code`.
     *
     * @example
     * var code = new Code({
     *     language: 'en',
     *     google: {
     *         key: 'YOUR-KEY'
     *     }
     * });
     */
    constructor(options) {
        this._ = {};
        this._.config = options;
    }

    // ---------------------------
    // INSTANCE PROPERTIES
    // ---------------------------

    /**
     * Gets the config object for the `Code` instance.
     *
     * @memberof Code
     * @type {Object}
     * @readonly
     *
     * @property {Number} zOption - z option.
     * @property {Number} bOption - b option.
     * @property {Number} _opt - _opt option.
     * @property {Number} aOption - a option.
     */
    get config() {
        return {
            zOption: 3,
            bOption: 2,
            _opt: 4,
            aOption: 1
        };
    }

    /**
     * The private property of the `Code` instance which should be hidden in the
     * documentation.
     *
     * @memberof Code
     * @type {Object}
     * @readonly
     * @private
     */
    get hidden() {
        return {};
    }

    // ---------------------------
    // STATIC PROPERTIES
    // ---------------------------

    /**
     * Error class that provides a common type of error object for `Code`.
     *
     * @memberof Code
     * @type {CodeError}
     * @readonly
     * @static
     */
    static get Error() {
        return Error;
    }

    /**
     * Helpful constants and utility methods for Code.
     * @memberof Code
     * @type {Object}
     */
    static get utils() {
        return {};
    }

    // ---------------------------
    // STATIC METHODS
    // ---------------------------

    /**
     * Sets or gets the `Code` configuration object.
     * @memberof Code
     *
     * @param {Object} options - Optional. Configuration object.
     *     @param {String} options.language - Default: `"en"`.
     *     Language to be used for API requests that supports language configurations.
     *     This is generally used for Google APIs.
     *     @param {Object} options.google - Google specific options.
     *         @param {String} options.google.version - Default: `"3.22"`.
     *         Google Maps API version to be used.
     *         You can set a greater value or the latest version number and it
     *         should work; but it's not guaranteed.
     *         Find out the {@link https://developers.google.com/maps/documentation/javascript/versions|latest version here}.
     *
     * @returns {Object} - A new instance of `Code`.
     *
     * @example
     * Code.staticMethod({
     *     language: 'en',
     *     google: {
     *         key: 'YOUR-KEY'
     *     }
     * });
     */
    static staticMethod(options) {
        return new Code(options);
    }

    /**
     * x - For sort test.
     * @memberof Code
     */
    static xStaticMethod() {
        return 'x';
    }

    /**
     * a - For sort test.
     * @memberof Code
     */
    static aStaticMethod() {
        return 'a';
    }

    // ---------------------------
    // INSTANCE METHODS
    // ---------------------------

    /**
     * Returns a location and accuracy radius based on information about cell
     * towers and WiFi nodes that the mobile client can detect; via the Google
     * Maps Geolocation API.
     * @see {@link https://developers.google.com/maps/documentation/geolocation/intro|Google Maps Geolocation API}
     * @see {@link https://developers.google.com/maps/documentation/geolocation/usage-limits|Usage Limits}
     * @memberof Code
     *
     * @param {Object} options - Optional. Default: `undefined`.
     * Geolocation options.
     *     @param {Boolean} options.timezone - Optional. Default: `false`.
     *     Specifies whether to also fetch the time zone information for the
     *     receieved coordinates. Note that this means an additional request
     *     which requires a Google API key to be set in the Geolocator
     *     configuration. See `{@link geolocator.config}`.
     *     @param {Boolean} options.raw - Optional. Default: `false`
     *     	Whether to return the raw Google API result.
     * @param {Function} callback - Required. Callback function to be executed
     * when the request completes. This takes 2 arguments:
     * `function (err, location) { ... }`
     * @returns {void}
     *
     * @example
     * var options = {
     *     timezone: false
     * };
     * code.requestLocation(options, function (err, location) {
     *     console.log(err || location);
     * });
     */
    instanceMethod(options, callback) {
        callback();
    }

    /**
     * b - For sort test.
     * @memberof Code
     */
    bInstanceMethod() {
        return 'b';
    }

}

/**
 *  exporting
 */
export default Code;
