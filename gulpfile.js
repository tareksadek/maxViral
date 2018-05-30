var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var autoprefixer = require('gulp-autoprefixer');

//paths
var SOURCEPATHS = {
		sassSource: 'src/scss/*.scss',
		htmlSource: 'src/html/*.html'
}

var APPPATH = {
		root: 'app',
		css: 'app/css',
		js: 'app/js'
}

//sass compiler
gulp.task('sass', function(){
	return gulp.src('src/scss/app.scss')
		.pipe(autoprefixer('last 2 versions')) //adding cross browser css (-webkit-)
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
		.pipe(gulp.dest(APPPATH.css));
});

//copy HTML files to app
gulp.task('copyHTML', function(){
	gulp.src(SOURCEPATHS.htmlSource)
		.pipe(gulp.dest(APPPATH.root));
});

//browserSync
gulp.task('serve', ['sass'], function(){
	browserSync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], {
		server: {
			baseDir: APPPATH.root
		}
	})
});

//watch for changes
gulp.task('watch', ['serve', 'sass', 'copyHTML'], function(){
	gulp.watch([SOURCEPATHS.sassSource], ['sass']);
	gulp.watch([SOURCEPATHS.htmlSource], ['copyHTML']);
});

gulp.task('default', ['watch']);