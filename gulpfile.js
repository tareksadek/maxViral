var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var autoprefixer = require('gulp-autoprefixer');
var clean = require('gulp-clean');

//paths
var SOURCEPATHS = {
		sassSource: 'src/scss/*.scss',
		htmlSource: 'src/html/*.html',
		jsSource: 'src/js/*.js'
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
gulp.task('copyHTML', ['cleanHTML'], function(){
	gulp.src(SOURCEPATHS.htmlSource)
		.pipe(gulp.dest(APPPATH.root));
});

//cleane removed html files from app
gulp.task('cleanHTML', function(){
	return gulp.src(APPPATH.root + '/*.html', {read: false, force: true})
		.pipe(clean());
});

//copy js files to app
gulp.task('copyJS', ['cleanJS'], function(){
	gulp.src(SOURCEPATHS.jsSource)
		.pipe(gulp.dest(APPPATH.js));
});

//cleane removed html files from app
gulp.task('cleanJS', function(){
	return gulp.src(APPPATH.js + '/*.js', {read: false, force: true})
		.pipe(clean());
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
gulp.task('watch', ['serve', 'sass', 'copyHTML', 'cleanHTML', 'copyJS', 'cleanJS'], function(){
	gulp.watch([SOURCEPATHS.sassSource], ['sass']);
	gulp.watch([SOURCEPATHS.htmlSource], ['copyHTML']);
	gulp.watch([SOURCEPATHS.jsSource], ['copyJS']);
});

gulp.task('default', ['watch']);