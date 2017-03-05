/*!
 *  Grunt Configurations
 */
module.exports = function (grunt) {
    'use strict';

    // ----------------------------
    //  GRUNT CONFIG
    // ----------------------------

    grunt.initConfig({

        // ----------------------------
        //  CONFIGURE TASKS
        // ----------------------------

        'jasmine_nodejs': {
            options: {
                useHelpers: false,
                helpers: [],
                random: false,
                seed: null,
                defaultTimeout: null, // defaults to 5000
                stopOnFailure: false,
                traceFatal: true,
                reporters: {
                    console: {
                        colors: true,
                        cleanStack: 4,
                        verbosity: 4,
                        listStyle: 'indent',
                        activity: false
                    }
                },
                customReporters: []
            },
            parse: {
                specs: [
                    'test/parse.spec.js',
                    'test/utils.spec.js'
                ]
            },
            // test jsdoc configuration (read from temp JSON file)
            conf: {
                specs: [
                    'test/conf.spec.js'
                ]
            }
        },

        'watch': {
            test: {
                options: {
                    // Setting `spawn:false` is very problematic. See
                    // grunt-contrib- watch issues. (Default is `spawn:true`)
                    // spawn: false
                },
                files: [
                    'src/**/*.js',
                    'test/*.spec.js'
                ],
                tasks: ['jasmine_nodejs']
            }
        }
    });

    // ----------------------------
    //  LOAD GRUNT PLUGINS
    // ----------------------------

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // ----------------------------
    //  REGISTER TASKS
    // ----------------------------

    grunt.registerTask('test:parse', ['jasmine_nodejs:parse']);
    grunt.registerTask('test:conf', ['jasmine_nodejs:conf']);
    grunt.registerTask('test', ['jasmine_nodejs']);
    grunt.registerTask('default', ['watch']);
};
