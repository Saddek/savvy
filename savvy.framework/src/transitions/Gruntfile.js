module.exports = function(grunt) {
  pkg: grunt.file.readJSON('package.json'),
  grunt.initConfig({

    // Concatenate CSS files
    concat: {
      dist: {
        src: [
          // _base.css required for .animated helper class
          'source/_base.css',
          'source/**/*.css'
        ],
        dest: 'transitions.css'
      }
    },

    // Auto-prefix CSS properties using Can I Use?
    autoprefixer: {
      options: {
        browsers: ['last 3 versions', 'bb 10', 'android 3']
      },
      no_dest: {
        // File to output
        src: 'transitions.css'
      },
    },

    // Minify CSS
    csso: {
      dist: {
        files: {
          // Output compressed CSS to style.min.css
          'transitions.min.css': ['transitions.css']
        }
      }
    },

    // Watch files for changes
    watch: {
      css: {
        files: [
          'source/**/*',
          '!node_modules',
          'build-config.json'
        ],
        // Run Sass, autoprefixer, and CSSO
        tasks: ['concat-anim', 'autoprefixer', 'csso'],
      }
    }

  });

  // Register our tasks
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-csso');
  grunt.registerTask('default', ['watch']);

  grunt.registerTask('concat-anim', 'Concatenates activated animations', function () {
    var config = grunt.file.readJSON('build-config.json'),
        target = [ 'source/_base.css' ],
        count = 0

    for (var cat in config) {
      for (var file in config[cat]) {
        if (config[cat][file]) {
          target.push('source/' + cat + '/' + file + '.css')
          count++
        }
      }
    }

    if (!count) {
      grunt.log.writeln('No animations activated.')
    }

    grunt.log.writeln(count + (count > 1 ? ' animations' : ' animation') + ' activated.')

    grunt.config('concat', { 'transitions.css': target })
    grunt.task.run('concat')
  });
};