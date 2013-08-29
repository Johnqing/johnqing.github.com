/**
 * 压缩合并配置文件
 * @author johnqing(刘卿)
 */
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    cssmin: {
      minify: {
        expand: true,
        cwd: 'css/',
        src: ['*.css', '!*.min.css'],
        dest: 'css/',
        ext: '.min.css'
      }
    },
    uglify: {
        target: {
            files: {
              'js/site.min.js': ['js/site.js']
            }
        }
    },
    watch: {
      scripts: {
        files: ['**/*'],
        tasks: ['default'],
        options: {
          spawn: false
        }
      }
    }
  });
  // Load grunt tasks from NPM packages
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("default",["cssmin","uglify", "watch"]);

};