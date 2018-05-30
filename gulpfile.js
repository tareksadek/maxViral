var gulp = require('gulp');
var sass = require('gulp-sass'); //sass to css
var browserSync = require('browser-sync'); //server
var reload = browserSync.reload;
var autoprefixer = require('gulp-autoprefixer'); //add cross browser css syntax
var clean = require('gulp-clean'); //remove deleted files
var concat = require('gulp-concat'); //merge files
var browserify = require('gulp-browserify'); //module loader (eq requirejs)
var merge = require('merge-stream'); //merge css files

//paths
var SOURCEPATHS = {
		sassSource: 'src/scss/*.scss',
		htmlSource: 'src/html/*.html',
		jsSource: 'src/js/*.js',
		fontawesomeSource: 'node_modules/font-awesome/fonts/**'
}

var APPPATH = {
		root: 'app',
		css: 'app/css',
		js: 'app/js',
		fonts : 'app/fonts'
}

//sass compiler
gulp.task('sass', function(){
	var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
	var sassFiles;
	
	sassFiles = gulp.src(SOURCEPATHS.sassSource)
		.pipe(autoprefixer('last 2 versions')) //adding cross browser css (-webkit-)
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
		return merge(bootstrapCSS, sassFiles) //merging sass and bootstrapfiles
		.pipe(concat('app.css'))//concat all css files for the app
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
		.pipe(concat('main.js')) //combine js files in src to 1 file in app
		.pipe(browserify()) //use browserify loader
		.pipe(gulp.dest(APPPATH.js));
});

//cleane removed js files from app
gulp.task('cleanJS', function(){
	return gulp.src(APPPATH.js + '/*.js', {read: false, force: true})
		.pipe(clean());
});

//move fontawesome files to app
gulp.task('fontawesome', function(){
	gulp.src(SOURCEPATHS.fontawesomeSource)
	.pipe(gulp.dest(APPPATH.fonts));
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
gulp.task('watch', ['serve', 'sass', 'copyHTML', 'cleanHTML', 'copyJS', 'cleanJS', 'fontawesome'], function(){
	gulp.watch([SOURCEPATHS.sassSource], ['sass']);
	gulp.watch([SOURCEPATHS.htmlSource], ['copyHTML']);
	gulp.watch([SOURCEPATHS.jsSource], ['copyJS']);
});

gulp.task('default', ['watch']);