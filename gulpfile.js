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
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var flatten = require('gulp-flatten');
var merge = require('merge-stream');
var bom = require('gulp-bom');
var babel = require('gulp-babel');

var onError = function(err) {
	//notify.onError({
	//	title:    "Gulp",
	//	subtitle: "Failure!",
	//	message:  "Error: <%= error.message %>",
	//	sound:    "Beep"
	//})(err);

	this.emit('end');
};


gulp.task('clean', function(cb) {
	//del(['Sources/prod'], cb)
});

gulp.task('styles', function() {
	return gulp.src(['**/*.less', '!**/bin/**/*.less', '!**/bld/**/*.less'], { cwd: 'BringThePopcorn',  base : '.' })
	.pipe(plumber({errorHandler: onError}))
	.pipe(less())
	.pipe(bom())
	.pipe(gulp.dest(''));	
});

var tsKodiProject = ts.createProject({
    declarationFiles: true,
    noExternalResolve: true,
    target: 'ES5',
    noEmitOnError: false
});

gulp.task('compilekodi', function () {
    var tsResult = gulp.src([
		'BringThePopcorn/typings/**/*.d.ts',
		'BringThePopcorn/Kodi/**/*.ts',
    ], { base: '.' })
	.pipe(plumber({ errorHandler: onError }))
	.pipe(sourcemaps.init())
	.pipe(ts(tsKodiProject));

    return merge([
        tsResult.dts.pipe(flatten()).pipe(concat('kodi.d.ts')).pipe(bom()).pipe(gulp.dest('BringThePopcorn/dist')),
        tsResult.js
            .pipe(concat('kodi.js'))
        	.pipe(sourcemaps.write(".",{
        	    sourceRoot: function (file) {
        	        var sources = [];
        	        file.sourceMap.sources.forEach(function (s) {
        	            var filename = s.substr(s.lastIndexOf('/') + 1);
        	            console.log(filename)
        	            sources.push("../kodi/" + [filename]);
        	        });
        	        file.sourceMap.sources = sources;
                    return ' ';
                }
            }))
            .pipe(bom())
        	.pipe(gulp.dest('BringThePopcorn/dist'))
    ]);
});

gulp.task('compilewinjscontrib', function () {
    
    return merge([
        gulp.src([
		    'scripts/winjscontrib/js/winjscontrib.core.js',
            'scripts/winjscontrib/js/winjscontrib.ui.webcomponents.js',
            'scripts/winjscontrib/js/winjscontrib.winrt.core.js',
		    'scripts/winjscontrib/js/winjscontrib.winrt.upnp.js',
            'scripts/winjscontrib/js/winjscontrib.bindings.js',
            'scripts/winjscontrib/js/winjscontrib.date.utils.js',
            'scripts/winjscontrib/js/winjscontrib.messenger.js',
            'scripts/winjscontrib/js/winjscontrib.datacontainer.winrt.file.js',
            //'scripts/winjscontrib/js/winjscontrib.search.js',
            'scripts/winjscontrib/js/winjscontrib.ui.jquery.js',
            'scripts/winjscontrib/js/winjscontrib.ui.dataform.js',
            'scripts/winjscontrib/js/winjscontrib.ui.navigator.js',
            'scripts/winjscontrib/js/winjscontrib.ui.animation.js',
            'scripts/winjscontrib/js/winjscontrib.ui.elasticbutton.js',
            'scripts/winjscontrib/js/winjscontrib.ui.fowrapper.js',
            'scripts/winjscontrib/js/winjscontrib.ui.multipass-renderer.js',
            'scripts/winjscontrib/js/winjscontrib.ui.grid.js',
            //'scripts/winjscontrib/js/winjscontrib.ui.datasourcemanager.js',
            'scripts/winjscontrib/js/winjscontrib.ui.aspectratio.js',
            'scripts/winjscontrib/js/winjscontrib.ui.visualstate.js',
            
        ], { base: '.', cwd: 'BringThePopcorn' })
	    .pipe(plumber({ errorHandler: onError }))
	    .pipe(sourcemaps.init())
        //.pipe(uglify())
        .pipe(concat('winjscontrib-custom.js'))
        .pipe(sourcemaps.write(".", {
            sourceRoot: function (file) {
                var sources = [];
                file.sourceMap.sources.forEach(function (s) {
                    var filename = s.substr(s.lastIndexOf('/') + 1);
                    console.log(filename)
                    sources.push("../scripts/winjscontrib/js/" + [filename]);
                });
                file.sourceMap.sources = sources;
                return ' ';
            }
        }))
        .pipe(bom())
        .pipe(gulp.dest('BringThePopcorn/dist')),

        gulp.src([
		    'scripts/winjscontrib/css/winjscontrib.ui.css',
		    'scripts/winjscontrib/css/segoe.symbol.css',
            'scripts/winjscontrib/css/winjscontrib.ui.extended-splashscreen.css',
            'scripts/winjscontrib/css/winjscontrib.ui.globalprogress.css',
            'scripts/winjscontrib/css/winjscontrib.ui.hamburger.css',
            'scripts/winjscontrib/css/winjscontrib.ui.elasticbutton.css',
        ], { base: '.', cwd: 'BringThePopcorn' })
	    .pipe(plumber({ errorHandler: onError }))
	    .pipe(sourcemaps.init())
        .pipe(minifycss())
        .pipe(concat('winjscontrib-custom.css'))
        .pipe(sourcemaps.write(".", {
            sourceRoot: function (file) {
                var sources = [];
                file.sourceMap.sources.forEach(function (s) {
                    var filename = s.substr(s.lastIndexOf('/') + 1);
                    console.log(filename)
                    sources.push("../scripts/winjscontrib/css/" + [filename]);
                });
                file.sourceMap.sources = sources;
                return ' ';
            }
        }))
        .pipe(bom())
        .pipe(gulp.dest('BringThePopcorn/dist'))
    ]);
});

var tsPagesProject = ts.createProject({
    declarationFiles: false,
    noExternalResolve: true,
    target: 'ES5',
    jsx : 'react',
    noEmitOnError: false,
    isolatedCompilation: true
});

gulp.task('compilepages', function () {
    var tsResult = gulp.src([
		'BringThePopcorn/typings/**/*.d.ts',
		'BringThePopcorn/dist/kodi.d.ts',
        'BringThePopcorn/js/**/*.ts',
		'BringThePopcorn/pages/**/*.ts',
		'BringThePopcorn/pages/**/*.tsx',
        'BringThePopcorn/controls/**/*.ts',
        'BringThePopcorn/controls/**/*.tsx',
        //'BringThePopcorn/controls/reactplaylist/reactplaylist.tsx',
    ], { base: '.' })
	.pipe(plumber({ errorHandler: onError }))
	.pipe(sourcemaps.init())
	.pipe(ts(tsPagesProject));

    return merge([
        tsResult.js
            .pipe(sourcemaps.write(".", {
        	    sourceRoot: function (file) {
        	        var sources = [];
        	        file.sourceMap.sources.forEach(function (s) {
        	            var filename = s.substr(s.lastIndexOf('/') + 1);
        	            console.log(filename)
        	            sources.push(filename);
        	        });
        	        file.sourceMap.sources = sources;
        	        return ' ';
        	    }
        	}))
        	.pipe(bom())
        	.pipe(gulp.dest(''))
    ]);
});

gulp.task('buildpages', ['compilepages', 'compilekodi'], function () {
});

gulp.task('build', ['clean', 'styles', 'compilewinjscontrib', 'buildpages'], function () {
});

gulp.task('watch', function() {
    gulp.watch(['BringThePopcorn/**/*.less', '!BringThePopcorn/**/bin/**/*.less', '!BringThePopcorn/**/bld/**/*.less'], ['styles']);
    gulp.watch(['BringThePopcorn/kodi/**/*.ts'], ['compilekodi']);
    gulp.watch(['BringThePopcorn/pages/**/*.ts', 'BringThePopcorn/controls/**/*.ts', 'BringThePopcorn/controls/**/*.tsx', 'BringThePopcorn/js/**/*.ts'], ['compilepages']);
});

gulp.task('default', ['build'], function() {
});