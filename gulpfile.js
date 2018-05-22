var gulp = require('gulp');
var gls = require('gulp-live-server');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var minifyify = require('minifyify');
var babelify = require('babelify');
var IS_PRODUCTION = process.env.NODE_ENV === 'production';

var paths = {
  main_css: ['src/stylesheets/main.css'],
  css: ['src/stylesheets/**/*.css'],
  main_js: ['src/app.js'],
  js: ['src/**/*.js*'],
};

gulp.task('js', function() {
  var bundler = browserify(paths.main_js)
                .transform('babelify', {
                  presets : [ 'es2015', 'react' ]
                });

  if (IS_PRODUCTION) {
    bundler = bundler.plugin('minifyify', {
      map      : false,
      compress : {
        drop_debugger : true,
        drop_console  : true
      }
    });
  }

  bundler.bundle().on('error', function(err) {
    console.error('[browserify error]', err.message);
  }).pipe(source('bundle.js'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('serve', ['js'], function () {
  gulp.watch(['*.css', 'index.html'], function (file) {
    server.notify.apply(server, [file]);
  });
  gulp.watch(paths.js,  ['js']);

  // Start the app server.
  var server = gls.static('./', 3000);
  server.start();

  // Notify server when frontend files change.
  gulp.watch(['dist/**/*.js', '*.{css,html}'], function(file) {
    server.notify(file);
  });
});

gulp.task('default', ['js']);
