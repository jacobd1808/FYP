var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');

////////////////////
// build
////////////////////
gulp.task('build', ['sass', 'jshint']);

////////////////////
// default
////////////////////
gulp.task('default', $.taskListing.withFilters(null, 'default'));

////////////////////
// compile-stylus
////////////////////
gulp.task('compile-stylus', function() {
  return gulp.src([__dirname + '/www/lib/onsen/stylus/*-theme.styl'])
    .pipe(plumber())
    .pipe($.stylus({errors: true, define: {mylighten: mylighten}}))
    .pipe($.autoprefixer('> 1%', 'last 2 version', 'ff 12', 'ie 8', 'opera 12', 'chrome 12', 'safari 12', 'android 2'))
    .pipe($.rename(function(path) {
      path.dirname = '.';
      path.basename = 'onsen-css-components-' + path.basename;
      path.ext = 'css';
    }))
    .pipe(gulp.dest(__dirname + '/www/lib/onsen/css/'));

  // needs for compile
  function mylighten(param) {
    if (param.rgba) {
      var result = param.clone();
      result.rgba.a = 0.2;
      return result;
    }
    throw new Error('mylighten() first argument must be color.');
  }
});

////////////////////
// compile-SCSS
////////////////////
gulp.task('sass', function() {
  return gulp.src('www/assets/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('www/assets/css/'))
});

////////////////////
// jshint
////////////////////
gulp.task('jshint', function() {
  return gulp.src([__dirname + '/www/*.js', __dirname + '/www/js/**/*.js'])
    .pipe(plumber())
    .pipe($.cached('jshint'))
    .pipe($.jshint())
    .pipe(jshintNotify())
    .pipe($.jshint.reporter('jshint-stylish'));
});

////////////////////
// typescript
////////////////////
gulp.task('typescript', function() {
  var proj = ts.createProject("scripts/tsconfig.json");
  var result = gulp.src("scripts/**/*.ts").pipe(ts(proj));

  return result.js.pipe(gulp.dest("www/scripts"));
});

////////////////////
// serve
////////////////////
gulp.task('serve', ['build', 'browser-sync'], function() {
  gulp.watch(
    [__dirname + '/www/lib/onsen/stylus/**/*.styl'],
    {debounceDelay: 400},
    ['compile-stylus']
  );

  gulp.watch(
    [__dirname + '/www/assets/scss/**/*.scss'],
    {debounceDelay: 400},
    ['sass']
  );

  gulp.watch(
    [__dirname + '/www/*.js', __dirname + '/www/js/**/*.js'],
    {debounceDelay: 400},
    ['jshint']
  );

  gulp.watch(
    [__dirname + '/www/**/*.*'],
    {debounceDelay: 400},
    ['prepare-cordova']
  );
});

////////////////////
// browser-sync
////////////////////
gulp.task('browser-sync', function() {
  browserSync({
    ghostMode: false,
    notify: false,
    debounce: 200,
    startPath: 'index.html',
    proxy: 'http://localhost/FYP2/www/',
  });

  gulp.watch([
    __dirname + '/www/**/*.{js,html,css,svg,png,gif,jpg,jpeg}'
  ], {
    debounceDelay: 400
  }, function() {
    browserSync.reload();
  });
});

////////////////////
// prepare-cordova
////////////////////
gulp.task('prepare-cordova', function() {
  return gulp.src('')
    .pipe($.plumber())
    .pipe($.shell(['cordova prepare'], {cwd: __dirname}));
});

// utils
function plumber() {
  return $.plumber({errorHandler: $.notify.onError()});
}

function jshintNotify() {
  return $.notify(function(file) {
    if (file.jshint.success) {
      return false;
    }

    var errors = file.jshint.results.map(function (data) {
      return data.error ? '(' + data.error.line + ':' + data.error.character + ') ' + data.error.reason : '';
    }).join('\n');

    return file.relative + ' (' + file.jshint.results.length + ' errors)\n' + errors;
  });
}
