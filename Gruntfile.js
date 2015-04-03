module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ["src/**/*js", "demoAssets/script.js"]
        },
        watch: {
            files: ["src/**/*js", "demoAssets/script.js"],
            tasks: ["jshint"]
        },

        concat: {
            distJs: {
                options: {
                    banner: "/*! <%= pkg.name %> - v<%= pkg.version %>*/\n(function () {",
                    footer: "\n})();",
                    process: function(src, filepath) {
                        return '// Source: ' + filepath + '\n' +
                            src.replace(/(^|\n)[\W]*\(function(\s)*\(\)(\s)*\{(\s|\n)*/, '').replace(/(\s|\n)*\}(\s|\n)*\)(\s|\n)*\((\s|\n)*\)(\s|\n)*;(\s|\n)*$/, '');
                    }
                },
                files: {
                    'dist/<%= pkg.name %>.js': ['src/core/modules/*.js', 'src/core/**/*.js'],
                    'dist/<%= pkg.name %>.config.js': ['src/configuration/*.js']
                }
            },
            distCss: {
                options: {
                    banner: "/*! <%= pkg.name %> - v<%= pkg.version %>*/\n"
                },
                files: {
                    'dist/<%= pkg.name %>.css': ['src/**/*.css']
                }
            },
            distRest: {
                files: {
                    'dist/templates/toastTemplate.html': 'src/core/templates/toastTemplate.html',
                    'dist/templates/toastMessageTemplate.html': 'src/core/templates/toastMessageTemplate.html',
                    'dist/license.txt': 'license.txt'
                }
            }
        },
        uglify: {
            options: {
                sourceMap: true,
                stripBanners: true
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js']
                }
            }
        },
        cssmin: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.css': ['dist/<%= pkg.name %>.css']
                }
            }
        }
    });
    grunt.registerTask("build", ["concat", "uglify", "cssmin"]);

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
};