module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            files: ["src/**/*js", "demoAssets/script.js"]
        },
        watch: {
            files: ["src/**/*js", "demoAssets/script.js"],
            tasks: ["jshint"]
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-watch");
};