var less = require('gulp-less'),
	gulp = require('gulp'),
	path = require('path'),
    uglify = require('gulp-uglify'),
	del = require('del'),
    livereload = require('gulp-livereload'),
	autoprefixer = require('gulp-autoprefixer'),
	rename = require('gulp-rename'),
	minifyCSS = require('gulp-minify-css');

gulp.task('less', ['clean-less'], function() {
	return gulp.src('src/less/*.less')
		.pipe(less({
			paths: ['src/less/']
		}))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest('src/css/'))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(minifyCSS())
		.pipe(gulp.dest('dist/css/'));
});
gulp.task('clean-less', function() {
	return del(['dist/css/*.css', 'src/css/*.css']);
});

gulp.task('scripts', ['clean-scripts'], function() {
  return gulp.src('src/javascript/*.js')
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/javascript'));
});
gulp.task('clean-scripts', function() {
	return del('dist/javascript/*.js');
});

gulp.task('default', ['less', 'scripts']);

gulp.task('watch', function() {
  // Watch .less files
  gulp.watch('src/less/*.less', ['less']);
  // Watch .js files
  gulp.watch('src/javascript/*.js', ['scripts']);
  livereload.listen();
  // Watch any files in dist/, reload on change
  gulp.watch(['src/less/', 'src/javascript/']).on('change', livereload.changed);
});
