/**
 *  This produces an error since ES7 async is not supported by JSDoc yet.
 *  We'll test jsdoc `plugins` configuration we've implemented.
 *  Using jsdoc-strip-async-await plugin
 */
async function test(value) {
    console.log(value);
}
