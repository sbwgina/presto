module.exports = function (grunt) {
    var $build_dist = "../dist/";

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-handlebars");
    grunt.loadNpmTasks("grunt-contrib-requirejs");
    grunt.initConfig({
        "pkg": grunt.file.readJSON("package.json"),
        "clean": {
            "options": {
                "force": true
            },
            "dist": ["./dist", $build_dist]
        },
        "copy": {
            "index": {
                "mode": true,
                "src": "index.html",
                "dest": $build_dist
            },
            "app_manifest": {
                "mode": true,
                "src": "app_manifest.mf",
                "dest": $build_dist
            },
            "bower_components": {
                "mode": true,
                "src": "bower_components/**",
                "dest": $build_dist
            },
            "css": {
                "mode": true,
                "src": "css/**",
                "dest": $build_dist
            },
            "images": {
                "mode": true,
                "src": "images/**",
                "dest": $build_dist
            },
            "js": {
                "mode": true,
                "cwd": "dist/",
                "src": "**",
                "dest": $build_dist + "js/",
                "expand": true,
                "flatten": true
            }
        },
        "handlebars": {
            "compile": {
                "options": {
                    "amd": true
                },
                "src": ["js/templates/**/*.hbs"],
                "dest": "dist/templates.js"
            }
        },
        "requirejs": {
            "compile": {
                "options": {
                    "name": "main",
                    "baseUrl": "js/",
                    "mainConfigFile": "js/main.js",
                    "out": "dist/main.js",
                    "optimizer": "none",
                    "inlineJSON": false
                }
            }
        }
    });
    grunt.registerTask("default", ["clean", "handlebars", "requirejs", "copy"]);
};