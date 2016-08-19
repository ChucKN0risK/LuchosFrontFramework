// ---------------------------------------------------------------
// Include Plugins
// ---------------------------------------------------------------
var gulp = require('gulp');
var sass             = require('gulp-sass');
var sassdoc          = require('sassdoc');
var plumber          = require('gulp-plumber');
var gutil            = require('gulp-util');
var concat           = require('gulp-concat');
var sourcemaps       = require('gulp-sourcemaps');
var autoprefixer     = require('gulp-autoprefixer');
var cleanCSS         = require('gulp-clean-css');
var stripCssComments = require('gulp-strip-css-comments');
var uncss            = require('gulp-uncss');
var browserSync      = require('browser-sync');
var uglify           = require('gulp-uglify');
var rename           = require('gulp-rename');
var critical         = require('critical').stream;
var imagemin         = require('gulp-imagemin');
var svgstore         = require('gulp-svgstore');
var svgmin           = require('gulp-svgmin');
var rename           = require('gulp-rename');
var size             = require('gulp-size');

// ---------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------
var path = {
  sass: './app/assets/scss/**/*.scss',
  css: './app/assets/css/',
  js: './app/js/**/*.js',
  img: './app/assets/img/*',
  html: './app/*.html',
  dist: './dist/assets/',
  dist_js: './dist/assets/js/',
  dist_css: './dist/assets/css/'
};

var autoprefixerOptions = {
  browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
};

var reload = browserSync.reload;
// var localConfig = require('./localconfig');

// gulp-plumber + gulp-util are used for proper error handling and formatting
// see source : https://www.timroes.de/2015/01/06/proper-error-handling-in-gulp-js/
var gulp_src = gulp.src;
gulp.src = function() {
  return gulp_src.apply(gulp, arguments)
    .pipe(plumber(function(error) {
      // Output an error message
      gutil.log(gutil.colors.red('Error (' + error.plugin + '): ' + error.message));
      // emit the end event, to properly end the task
      this.emit('end');
    })
  );
};

// ---------------------------------------------------------------
// MAIN TASKS
// ---------------------------------------------------------------

// Static Server
gulp.task( 'serve', function(){
  browserSync.init( {
    server: {
      baseDir: 'app'
    },
  } )
} );

// Watch task
gulp.task( 'watch', ['serve'], function(){
  gulp.watch( path.sass, ['sass'] ); 
  gulp.watch( path.html, reload );
  gulp.watch( path.js, reload ); 
} );

// Generate SassDoc + Add Sourcemaps + Autoprefixer 
// + cache modified files 
// + size the final css filereload on change
// + refresh stream
gulp.task('sass', function () {
  return gulp
    .src(path.sass)
    .pipe(sassdoc())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.css))
    .pipe(size())
    .pipe(reload({stream: true}));
});

// Production Sass Task : Compile SASS into CSS + Remove comments 
// + Remove unused css + Autoprefixer
// + Rename + Minify + Move to dest folder
gulp.task('sass-prod', function () {
  return gulp
    .src(path.sass)
    .pipe(sass({
      onError: console.error.bind(console, 'SASS error')
    }))
    .pipe(stripCssComments())
    .pipe(uncss({
        html: ['app/index.html']
    }))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(cleanCSS({debug: true}, function(details) {
        console.log(details.name + ' original size : ' + details.stats.originalSize);
        console.log(details.name + ' minified size : ' + details.stats.minifiedSize);
    }))
    .pipe(size())
    .pipe(gulp.dest(path.dist + '/css'));
});

// JS Prod Task = Minimify JS + Rename it + Move it to build/js
// TODO : Copy vendor minified files in build/js 
// + Concat files + Rename final file
gulp.task('js-prod', function() {
  return gulp
  .src(path.js)
  .pipe(uglify())
  .pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest(path.dist_js));
});

// Compress Images
gulp.task('img', function () {
  return gulp
  .src(path.img)
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
  }))
  .pipe(gulp.dest(path.dist + '/img'));
});

// Sprite all the SVG inside the 'icons' folder
// into a single SVG file in 'icons/dest'
gulp.task('svgstore', function () {
  return gulp
    .src('assets/icons/*.svg')
    .pipe(svgmin())
    .pipe(svgstore())
    .pipe(rename({baseline: 'sprite'}))
    .pipe(gulp.dest('assets/icons/dest'));
});

// Generate & Inline Critical-path CSS
gulp.task('critical', function () {
  return gulp
    .src(path.html)
    .pipe(critical({
      base: './',
      inline: true,
      minify: true,
      dimensions: [{
        height: 1300,
        width: 900
      }]
    }))
    .pipe(gulp.dest(path.dist));
});

// Run a Google Page Speed Insight Test for mobile
gulp.task('mobile', function () {
  return psi(site, {
    // key: key
    nokey: 'true',
    strategy: 'mobile',
}, function (err, data) {
    console.log(data.score);
    console.log(data.pageStats);
  });
});

// Run a Google Page Speed Insight Test for desktop
gulp.task('desktop', function () {
  return psi(site, {
    nokey: 'true',
    // key: key,
    strategy: 'desktop',
  }, function (err, data) {
    console.log(data.score);
    console.log(data.pageStats);
  });
});

gulp.task('default', ['watch'], function () {});

gulp.task('prod', ['sass-prod', 'js-prod', 'critical', 'img']);

