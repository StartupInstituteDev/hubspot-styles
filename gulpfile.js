// Modules
var gulp = require('gulp'),
    slim = require('gulp-slim'),
    sass = require('gulp-ruby-sass'),
    plumber = require('gulp-plumber'),
    mainBowerFiles = require('main-bower-files'),
    filter = require('gulp-filter'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    minifycss = require('gulp-minify-css'),
    autoprefix = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync');

// Helpers
var reload = browserSync.reload;

//Paths
var src = {
  'css': './src/sass/*.scss',
  'js': './src/js/**/*.js',
  'html': './src/templates/*.html',
};
var dest = {
  'css': './dist/css/',
  'js': './dist/js/',
  'html':'./dist'
};

// Process css out of bower
gulp.task('bowerCSS', function() {
  gulp.src(mainBowerFiles())
  .pipe(filter('*.css', '!*.min.css'))
  .pipe(concat('vendor.css'))
  .pipe(rename({ suffix: '.min'}))
  .pipe(minifycss())
  .pipe(gulp.dest(dest.css))
  .pipe(reload({stream:true}));
});

// Process sass
gulp.task('sass', function() {
  gulp.src(src.css)
  .pipe(plumber())
  .pipe(sass({
    'loadPath': './bower_components/bootstrap-sass-twbs/assets/stylesheets/'
    }))
  .pipe(autoprefix('last 2 version'))
//  .pipe(rename({ suffix: '.min' }))
//  .pipe(minifycss())
  .on('error', function (err) { console.log(err.message); })
  .pipe(gulp.dest(dest.css))
  .pipe(reload({stream:true}));
});

// Process templates
gulp.task('html', function() {
  gulp.src(src.html)
  .pipe(plumber())
  .pipe(gulp.dest(dest.html))
  .pipe(reload({stream:true}));
});

// Process  javascripts
gulp.task('js', function() {
  gulp.src(mainBowerFiles().concat(src.js))
  .pipe(filter('*.js'))
  .pipe(concat('main.js'))
  .pipe(uglify())
  .pipe(gulp.dest(dest.js))
  .pipe(reload({stream:true}));
})

// Spin up a server
gulp.task('serve', function() {
browserSync({
  server: {
    baseDir: './dist'
    }
  });
});

// Default to build, serve, and watch
gulp.task('default', ['bowerCSS', 'sass', 'html', 'js', 'serve'], function() {
  gulp.watch(src.css, ['sass']);
  gulp.watch(src.html, ['html']);
  gulp.watch(src.js, ['js']);
  gulp.watch('bower_components', ['bowerCSS']);
});
