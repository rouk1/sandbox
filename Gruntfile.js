module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt)

  var SCSS = {
    'src/css/styles.css': 'src/scss/styles.scss'
  }
  var BUNDLES = {
    'src/js/main.bundle.js': ['src/js/main.js']
  }
  var SRC_FILES = [
    'src/fonts/**/*.{eot,svg,ttf,woff}',
    'src/sounds/**/*.{mp3,ogg,wav}',
    'src/img/**/*.{jpg,png,svg,ico,icns}',
    'src/video/**/*.{mp4,ogv,webm}',
    'src/js/*.bundle.js',
    'src/css/**/*.css',
    'src/**/*.html'
  ]

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      dev: {
        options: {
          sourceMap: true
        },
        files: SCSS
      },
      dist: {
        options: {
          sourceMap: false,
          outputStyle: 'compressed'
        },
        files: SCSS
      }
    },

    browserify: {
      dev: {
        options: {
          watch: true,
          browserifyOptions: {
            debug: true
          },
          transform: [
            ['babelify', {presets: ['es2015']}],
            ['stringify', {}]
          ]
        },
        files: BUNDLES
      },
      dist: {
        options: {
          browserifyOptions: {
            debug: false
          },
          transform: [
            ['babelify', {presets: ['es2015']}],
            ['stringify', {}],
            ['uglifyify', {
              global: true
            }]
          ]
        },
        files: BUNDLES
      }
    },

    watch: {
      assets: {
        files: SRC_FILES,
        options: {
          livereload: true,
          interrupt: true
        }
      },
      sass: {
        files: [
          'src/scss/**/*.scss'
        ],
        tasks: ['sass:dev']
      }
    },

    clean: {
      dev: ['src/css', 'src/js/*.bundle.js'],
      dist: ['dist']
    },

    connect: {
      dev: {
        options: {
          base: 'src'
        }
      },
      dist: {
        options: {
          base: 'dist',
          keepalive: true
        }
      }
    },

    copy: {
      all: {
        expand: true,
        cwd: 'src',
        src: SRC_FILES
          .map(function (item) {
            return item.replace('src/', '')
          }).filter(function (item) {
            return item.indexOf('.html') === -1
          }),
        dest: 'dist'
      },
      markup: {
        expand: true,
        cwd: 'src',
        src: '**/*.html',
        dest: 'dist',
        options: {
          process: function (content, srcpath) {
            var r = content.replace(/<!-- livereload -->(.|[\r\n])*<!-- livereload -->/gm, '')
            return r
          }
        }
      }
    }
  })

  grunt.registerTask('default', ['clean:dev', 'browserify:dev', 'sass:dev', 'connect:dev', 'watch'])
  grunt.registerTask('build', ['clean', 'browserify:dist', 'sass:dist', 'copy', 'clean:dev'])
  grunt.registerTask('live', ['build', 'connect:dist'])
}
