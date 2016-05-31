// Require
var gulp = require('gulp');

// Include Plugins
var sass             = require('gulp-sass');
var concat           = require('gulp-concat');
var sourcemaps       = require('gulp-sourcemaps');
var browserSync      = require('browser-sync');
var uglify           = require('gulp-uglify');
var cleanCSS         = require('gulp-clean-css');
var stripCssComments = require('gulp-strip-css-comments');
var uncss            = require('gulp-uncss');
var rename           = require('gulp-rename');
var autoprefixer     = require('gulp-autoprefixer');
var critical         = require('critical').stream;
var imagemin         = require('gulp-imagemin');
var svgstore         = require('gulp-svgstore');
var svgmin           = require('gulp-svgmin');
var rename           = require('gulp-rename');
var size             = require('gulp-size');
var sassdoc          = require('sassdoc');

// Configuration
var path = {
  sass: './assets/scss/**/*.scss',
  js: [
    './assets/js/vendor/modernizr-2.8.3.min.js',
    './assets/js/vendor/typerendering-1.1.0.min.js',
    './assets/js/main.js'
  ],
  img: './assets/img/*',
  html: './*.html',
  dist: './assets/build/',
  js_dist: './assets/js/build/'
};
var autoprefixerOptions = {
  browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
};
var reload = browserSync.reload;
var localConfig = require('./localconfig');

// Static Server + watching scss/html files
gulp.task('serve', function() {
  if(localConfig.enableBrowserSync)
  {
    browserSync({
      proxy: 'http://' + localConfig.serverName + localConfig.subDirectory
    });
  }

  gulp.watch(path.sass, ['sass']);
  gulp.watch(path.html).on('change', reload);
  gulp.watch(path.js, ['js-dev']);
  //.on('change', function(event) {
  //  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  //});
});

// Generate SassDoc + Add Sourcemaps + Autoprefixer 
// + cache modified files 
// + size the final css filereload on change
// + refresh stream
gulp.task('sass', function () {
  return gulp
    .src(path.sass)
    .pipe(sassdoc())
    .pipe(sourcemaps.init())
    .pipe(sass({
      onError: console.error.bind(console, 'SASS error')
    }))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./assets/css/'))
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
        html: ['index.html']
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
  .pipe(gulp.dest(path.dist + '/js'));
});

// Concat all the files in js directory to build/all.js 
// and reload the page
gulp.task('js-dev', function() {
  return gulp
    .src(path.js)
    .pipe(concat('all.js'))
    .pipe(gulp.dest(path.js_dist))
    .pipe(reload({stream: true}));
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

gulp.task('default', ['sass','serve'], function () {});

gulp.task('prod', ['sass-prod', 'js-prod', 'critical', 'img']);

