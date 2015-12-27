var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    ts = require('gulp-typescript'),
    
    source = require('vinyl-source-stream'),
    streamify = require('streamify'),
    
    browserify = require('browserify'),
    tsify = require('tsify'),
    domain = require('domain'),
    tap = require('gulp-tap');

var tsProject = ts.createProject('tsconfig.json', { sortOutput: true });

gulp.task('build-css', function(){
    gulp.src('src/scss/**/*.scss')
        .pipe(sourcemaps.init())
            .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('web/css'));
});

gulp.task('build-ts', function(done){
    var tsResult = gulp.src('src/ts/**/*.ts')
        .pipe(sourcemaps.init())
//        .pipe(ts(tsProject, undefined, ts.reporter.longReporter()))
        .pipe(ts(tsProject, undefined, ts.reporter.fullReporter()));

    return tsResult.js
        .pipe(concat('output.js'))  
        .pipe(sourcemaps.write())  
        .pipe(gulp.dest('web/js'))
});

gulp.task('build-ts6', function(done){
    return gulp.src('src/ts/**/*.ts')
        .pipe(ts(tsProject))
        .pipe(gulp.dest('web/js'));
});

gulp.task('build-ts5', function() {
    gulp.src('src/ts/index.ts', {read: false})
        .pipe(tap(function(file) {
            var d = domain.create();

            d.on("error", function(err) {
                gutil.log(
                    gutil.colors.red("Browserify compile error:"), 
                    err.message, 
                    "\n\t", 
                    gutil.colors.cyan("in file"), 
                    file.path,
                    "@",
                    err.line + ":" + err.column
                );
            });

            d.run(function() {
                file.contents = browserify({
                    entries: [file.path]
                })
                .plugin(tsify)
                .bundle();
            });
        }))
        .pipe(gulp.dest('./public/assets/js/bundle.js'))
});

gulp.task('build-ts4', function(){
    return browserify('src/ts/index.ts')
        .plugin(tsify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('public/assets/js'));
});

gulp.task('build-ts3', function(){
    var tsResult = gulp.src('src/ts/**/*ts')
        .pipe(ts(tsProject));
        
    return tsResult.js.pipe(gulp.dest('public/assets/js'));
});

gulp.task('build-ts2', function(){
    var tsResult = gulp.src('src/ts/**/*ts')
        .pipe(ts(tsProject));
        
    return tsResult.js.pipe(gulp.dest('public/assets/js'));
});

gulp.task('build-ts1', function(){
    return gulp.src('src/ts/**/*.ts')
        .pipe(ts({ 
            noImplicitAny: true,
            module: 'commonjs'
        }))
        .pipe(gulp.dest('public/assets/js'));
});

gulp.task('build-js', function(){
    gulp.src('src/js/**/*.js')
        .pipe(sourcemaps.init())
            .pipe(concat('bundle.js'))
            .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
        .pipe(sourcemaps.write());
});


gulp.task('copyHtml', function(){
    gulp.src('src/*.html').pipe(gulp.dest('public'));
});

gulp.task('jshint', function(){
    gulp.src('src/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('watch', function() {
  gulp.watch('src/js/**/*.js', ['jshint']);
  gulp.watch('src/scss/**/**.scss', ['build-css'])
});

gulp.task('watch-css', function(){
    gulp.watch('src/scss/**/*.scss', ['build-css']);
});

gulp.task('watch-ts', function(){
    gulp.watch('src/ts/**/*.ts', ['build-ts']);
});

gulp.task('build', ['build-ts', 'build-css']);
gulp.task('watch', ['watch-ts', 'watch-css']);
gulp.task('default', ['build', 'watch']);
