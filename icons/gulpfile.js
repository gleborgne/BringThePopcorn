var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var notify = require('gulp-notify');
var minifycss = require('gulp-minify-css');
var plumber = require('gulp-plumber');
var del = require('del');
var rename = require('gulp-rename');
var iconfont = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');
var consolidate = require('gulp-consolidate');

var onError = function(err) {
	notify.onError({
		title:    "Gulp",
		subtitle: "Failure!",
		message:  "Error: <%= error.message %>",
		sound:    "Beep"
	})(err);

	this.emit('end');
};


gulp.task('clean', function(cb) {
	del(['dist'], cb)
});

gulp.task('Iconfont', function(){
  gulp.src(['basefont/*.svg'])
  	.pipe(iconfont({
      fontName: 'kodipassion',
      fixedWidth: true,
      normalize: true,
      centerHorizontally: true,
      //descent: 0
    }))
    .on('codepoints', function(codepoints, options) {
      gulp.src('font-template.css')
        .pipe(consolidate('lodash', {
          glyphs: codepoints,
          fontName: 'kodipassion',
          fontPath: '',
          className: 'kdp'
        }))
        .pipe(rename('kodipassion.css'))
        .pipe(gulp.dest('dist/fonts/'));
    })

    .pipe(gulp.dest('dist/fonts/'));
});


gulp.task('default', ['clean'], function() {
	gulp.start('Iconfont');
});