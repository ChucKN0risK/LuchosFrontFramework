// ---------------------------------------------------------------
// Include Plugins
// ---------------------------------------------------------------
var gulp             = require('gulp');
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
var del              = require('del');
var critical         = require('critical').stream;
var imagemin         = require('gulp-imagemin');
var rename           = require('gulp-rename');
var svgstore         = require('gulp-svgstore');
var svg2png          = require('gulp-svg2png');
var svgmin           = require('gulp-svgmin');
var rename           = require('gulp-rename');
var size             = require('gulp-size');
var dom              = require('gulp-dom');
var changed          = require('gulp-changed');
var parallel         = require('concurrent-transform');
var os               = require('os');
var rename           = require('gulp-rename');

// ---------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------
var path = {
    sass: 'app/assets/scss/**/*.scss',
    css: 'app/assets/css/',
    js: 'app/assets/js/*.js',
    js_vendor: 'app/assets/js/vendor/*.js',
    img: 'app/assets/img/**/*.{png,jpeg,jpg,gif}',
    img_resized: 'app/assets/img/',
    img_to_resize: 'app/assets/img-to-resize/**/*.{png,jpeg,jpg,gif}',
    icons: 'app/assets/icons/*.svg',
    svgSprite: 'app/assets/icons/dest',
    fonts: 'app/assets/fonts/*.{ttf,woff,eof,svg,otf}',
    html: 'app/*.html',
    php: 'app/*.php',
    dist: 'dist/',
    dist_js: 'dist/assets/js/',
    dist_js_vendor: 'dist/assets/js/vendor/',
    dist_css: 'dist/assets/css/',
    dist_img: 'dist/assets/img/',
    dist_fonts: 'dist/assets/fonts/',
    dist_icons: 'dist/assets/icons/',
};

var autoprefixerOptions = {
    browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
};

var reload = browserSync.reload;

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
        }));
};

// ---------------------------------------------------------------
// MICRO TASKS
// ---------------------------------------------------------------

// Static Server
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
    })
});

// Watch our .scss, .html, .js or img files
gulp.task('watch', ['sass', 'serve'], function() {
    gulp.watch(path.sass, ['sass']);
    gulp.watch(path.html, reload);
    gulp.watch(path.js, reload);
    gulp.watch(path.img_to_resize, ['img']);
});

// Generate SassDoc + Add Sourcemaps + Autoprefixer 
// + cache modified files 
// + size the final css filereload on change
// + refresh stream
gulp.task('sass', function() {
    return gulp
        .src(path.sass)
        .pipe(sassdoc())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.css))
        .pipe(size())
        .pipe(reload({ stream: true }));
});

// Production Sass Task : Compile SASS into CSS + Remove comments 
// + Remove unused css + Autoprefixer
// + Rename + Minify + Move to dest folder
gulp.task('sass-prod', function() {
    return gulp
        .src(path.sass)
        .pipe(sass({
            onError: console.error.bind(console, 'SASS error')
        }))
        .pipe(stripCssComments())
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(cleanCSS({ debug: true }, function(details) {
            console.log(details.name + ' original size : ' + details.stats.originalSize);
            console.log(details.name + ' minified size : ' + details.stats.minifiedSize);
        }))
        .pipe(size())
        .pipe(gulp.dest(path.dist_css));
});

// Once the sass-prod task has compiled the
// style.scss into a style.css we remove inside
// this file the css rules that are not applied
// in the .html files of the app/.
gulp.task('uncss', function() {
    return gulp
        .src(path.dist_css + "style.css")
        .pipe(uncss({
            html: [path.html]
        }))
        .pipe(gulp.dest(path.dist_css));
});

// JS Prod Task = Minimify JS + Move it to dist
gulp.task('js-prod', function() {
    return gulp
        .src(path.js)
        .pipe(uglify())
        .pipe(gulp.dest(path.dist_js));
});

gulp.task('copy-img', function() {
    return gulp.src(path.img_to_resize)
        .pipe(changed(path.img_resized))
        .pipe(gulp.dest(path.img_resized));
});

gulp.task('resize-ipad2', function() {
    return gulp.src(path.img_to_resize)
        .pipe(changed(path.img_resized))
        .pipe(parallel(
            imageResize({ width: 2048 }),
            os.cpus().length
        ))
        .pipe(rename(function(path) { path.basename += "_med2"; }))
        .pipe(gulp.dest(path.img_resized));
});

gulp.task('resize-ipad', function() {
    return gulp.src(path.img_to_resize)
        .pipe(changed(path.img_resized))
        .pipe(parallel(
            imageResize({ width: 1024 }),
            os.cpus().length
        ))
        .pipe(rename(function(path) { path.basename += "_med"; }))
        .pipe(gulp.dest(path.img_resized));
});

gulp.task('resize-mobile2', function() {
    return gulp.src(path.img_to_resize)
        .pipe(changed(path.img_resized))
        .pipe(parallel(
            imageResize({ width: 1536 }),
            os.cpus().length
        ))
        .pipe(rename(function(path) { path.basename += "_small2"; }))
        .pipe(gulp.dest(path.img_resized));
});

gulp.task('resize-mobile', function() {
    return gulp.src(path.img_to_resize)
        .pipe(changed(path.img_resized))
        .pipe(parallel(
            imageResize({ width: 768 }),
            os.cpus().length
        ))
        .pipe(rename(function(path) { path.basename += "_small"; }))
        .pipe(gulp.dest(path.img_resized));
});

// Compress Images
gulp.task('clean-img-resized', function() {
    return del.sync(path.img_resized);
});

// Compress Images
gulp.task('img', ['copy-img', 'clean-img-resized', 'resize-ipad2', 'resize-ipad', 'resize-mobile2', 'resize-mobile'], function() {
    return gulp
        .src(path.img)
        .pipe(changed(path.dist_img))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
        }))
        .pipe(gulp.dest(path.dist_img));
});

// Sprite all the SVG inside the 'icons' folder
// into a single SVG file in 'icons/dest'
// Usage : <svg><use xlink:href="icons/dest/icons.svg#twitter"></use></svg>
gulp.task('svgstore', function() {
    return gulp
        .src(path.icons)
        .pipe(svgmin())
        .pipe(svgstore())
        .pipe(rename({ baseline: 'sprite' }))
        .pipe(gulp.dest(path.svgSprite));
});

// Generates PNG fallback for each SVG files in /icons directory
// and puts them in icons/dest directory. This dest allows
// svg4everybody to use these fallbacks.
gulp.task('svg2png', function () {
    // Define source files
    return gulp.src( path.icons )
        // Run the svg2png npm module on these source files
        .pipe( svg2png() )
        // Define where the response is distributed to
        .pipe( gulp.dest( path.svgSprite ) )
});

// Generate & Inline Critical-path CSS
gulp.task('critical', function() {
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
gulp.task('PSIMobile', function() {
    return psi(site, {
        // key: key
        nokey: 'true',
        strategy: 'mobile',
    }, function(err, data) {
        console.log(data.score);
        console.log(data.pageStats);
    });
});

// Run a Google Page Speed Insight Test for desktop
gulp.task('PSIDesktop', function() {
    return psi(site, {
        nokey: 'true',
        // key: key,
        strategy: 'desktop',
    }, function(err, data) {
        console.log(data.score);
        console.log(data.pageStats);
    });
});

// Deleting all dist content
gulp.task('clean', function() {
    return del.sync('dist');
});

// ---------------------------------------------------------------
// MACRO TASKS
// ---------------------------------------------------------------

gulp.task('default', ['watch'], function() {});

gulp.task('build', ['clean', 'sass-prod', 'js-prod', 'img', 'svgstore'], function() {
    // Copy JS Vendor files to dist
    gulp.src(path.js_vendor)
        .pipe(gulp.dest(path.dist_js_vendor));

    // Remove breakpoint block in document + Copy HTML files to dist
    gulp.src(path.html)
        .pipe(dom(function(){
            this.querySelector('body').classList.add('build-prod');
            return this;
        }))
        .pipe(gulp.dest(path.dist));

    // Copy PHP files to dist
    gulp.src(path.php)
        .pipe(gulp.dest(path.dist));

    // Copy fonts files to dist
    gulp.src(path.fonts)
        .pipe(gulp.dest(path.dist_fonts));

    // Copy SVG icons to dist
    gulp.src(path.icons)
        .pipe(gulp.dest(path.dist_icons));

    // Copy SVG sprite & PNG fallbacks to dist
    gulp.src('app/assets/icons/dest/*.{svg,png}')
        .pipe(gulp.dest(path.dist_icons + 'dest/'));

    // Copy Config files to dist
    gulp.src('app/*.{htaccess,xml,txt}', { dot: true })
        .pipe(gulp.dest(path.dist));
});
