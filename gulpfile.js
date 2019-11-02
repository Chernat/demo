const gulp = require('gulp'),
  sass = require('gulp-sass'),
  plumber = require('gulp-plumber'),
  autoprefixer = require('gulp-autoprefixer'),
  image = require('gulp-imagemin'),
  uglify = require('gulp-uglify'),
  pipeline = require('readable-stream').pipeline,
  del = require('del'),
  browserSync = require('browser-sync').create();

function style() {
  return gulp.src('./src/scss/main.scss')
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: require('node-normalize-scss').includePaths
    }).on('error', sass.logError))
    .pipe(plumber())
    .pipe(autoprefixer({
      overrideBrowserslist: ['> 1%', 'last 2 Chrome versions', 'Firefox ESR'],
      cascade: false
    }))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
}

function htmlCopy() {
  return gulp.src('./src/*.html')
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.stream());
}

function jsCopy() {
  return gulp.src('./src/js/*.js')
        .pipe(gulp.dest('./dist/js'))
        .pipe(browserSync.stream());
}

function imageCopy() {
  return gulp.src('./src/img/*')
        .pipe(image())
        .pipe(gulp.dest('./dist/img'));
}

function fontsCopy() {
  return gulp.src('./src/fonts/*')
        .pipe(image())
        .pipe(gulp.dest('./dist/fonts'));
}

function jsMin() {
  return pipeline(
        gulp.src('./src/js/*.js'),
        uglify(),
        gulp.dest('./dist/js')
  );
}

function watch() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
    notify: false,
    tunnel: true
  });

  gulp.watch('./src/js/*.js', jsMin).on('change', browserSync.reload);
  gulp.watch('./src/scss/*.scss', style).on('change', browserSync.reload);
  gulp.watch('./src/*.html', htmlCopy).on('change', browserSync.reload);
}


function clean() {
  return del(['dist/*']);
}

gulp.task('fontsCopy', fontsCopy);
gulp.task('imageCopy', imageCopy);
gulp.task('jsMin', jsMin);
gulp.task('clean', clean);
gulp.task('style', style);
gulp.task('watch', watch);
gulp.task('htmlCopy', htmlCopy);
gulp.task('build', gulp.series(clean, gulp.parallel(fontsCopy, imageCopy, jsMin, style, htmlCopy)))
