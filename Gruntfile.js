module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

//       CONCATENATE THE FILES IN SRC, OUTPUT TO DEST
    concat: {
      dist: {
        src: [
          'public/client/**/*.js',
        ],
        dest: 'public/dist/production.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          captureFile: 'spec/mocha_test_results.txt',
          quiet: false,
          clearRequireCache: false
        },
        src: ['spec/**/*.js']
      }
    },


//            RUN NODEMON ON THE SERVER
    nodemon: {
      dev: {
        script: 'server/server.js'
      }
    },


//           MINIFY THE ALREADY CONCATENATED VERSION OF THE FILES
    uglify: {
      build: {
        src: 'public/dist/production.js',
        dest: 'public/dist/production.min.js'
      }
    },

//          CHECK ALL .JS FILES FOR SYNTAX ERRORS
    jshint: {
      files: [
        'Gruntfile.js', 'public/client/**/*.js', 'server/*.js'
      ],
      options: {
        force: 'true',
        // jshintrc: '.jshintrc', uncomment IF we decide to specify what to lint for within .jshintrc
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },


//        EQUIVALENT TO UGLIFY-FOR-JS, BUT FOR CSS
    cssmin: {
      dist:{
        options: {
          style: 'compressed'
        },
        files: {
          'public/dist/style.css': 'public/client/styles/style.css'
        }
      }
    },


// will continuously monitor the 'files' and perform the 'tasks' if the files are changed
    watch: {
      scripts: {
        files: [
          'Gruntfile.js',
          'public/client/**/*.js'
        ],
        tasks: [
          'jshint',
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/client/styles/*.css',
        tasks: ['jshint','cssmin']
      }
    },

// We can add additionally terminal command lines here
    shell: {
      prodServer: {
          command: 'git push heroku master'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    // This allows grunt to continue running simultaneously with a node instance by funneling their stdout's together
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'lint', 'concat', 'uglify', 'cssmin'
  ]);

  grunt.registerTask('look', ['watch']);

  grunt.registerTask('lint', ['jshint']);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
        grunt.task.run([ 'shell:prodServer' ]);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    'build', 'upload'
  ]);

};
