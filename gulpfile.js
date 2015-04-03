var gulp = require('gulp');
var react = require('gulp-react');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');
var del = require('del');


var config = require('./config.js');

gulp.task('clean', function(cb){
	del([config.build_root], cb);
});

gulp.task('cssmin', function() {
    return gulp.src(config.css)
        .pipe(csso())
        .pipe(gulp.dest(config.css_dest));
});

gulp.task('react2js', function(){
	console.log('react');
	return gulp.src(config.jsx)
			.pipe(react())
			.pipe(uglify())
        .pipe(gulp.dest(config.jsx_dest));;
});

gulp.task('watch', function(){
	gulp.watch(config.jsx, ['react2js']);
	gulp.watch(config.css, ['cssmin']);
});


gulp.task('default', ['watch', 'react2js', 'cssmin']);

