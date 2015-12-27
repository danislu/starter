var gulp = require('gulp'),
    gutil = require('gulp-util'),
    Config = require('./gulpfile.config'),
    tslint = require("gulp-tslint"),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    ts = require('gulp-typescript'),
    inject = require('gulp-inject');

var config = new Config();
var tsProject = ts.createProject('tsconfig.json', { sortOutput: true });

gulp.task('gen-ts-refs', function () {
    var target = gulp.src(config.appTypeScriptReferences);
    var sources = gulp.src([config.allTypeScript], { read: false });
    
    return target.pipe(inject(sources, {
        starttag: '//{',
        endtag: '//}',
        transform: function (filepath) {
            return '/// <reference path="../..' + filepath + '" />';
        }
    })).pipe(gulp.dest(config.typings));
});


gulp.task('build-css', function () {
    gulp.src(config.allSCSS)
        .pipe(sourcemaps.init())
            .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.outputCssPath));
});

gulp.task('build-ts', function (done) {
    var tsResult = gulp.src(config.allTypeScript)
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject, undefined, ts.reporter.fullReporter() /* ts.reporter.longReporter() */));

    return tsResult.js
        .pipe(concat(config.outputJsBundleFile))  
        //.pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.outputJsPath))
});

gulp.task('copyHtml', function () {
    gulp.src('src/**/*.html').pipe(gulp.dest('web'));
});

gulp.task('lint-ts', function () {
    return gulp.src(config.allTypeScript)
        .pipe(tslint())
        .pipe(tslint.report('verbose'));
});

gulp.task('watch-css', function () {
    gulp.watch(config.allSCSS, ['build-css']);
});

gulp.task('watch-ts', function () {
    gulp.watch(config.allTypeScript, ['lint-ts', 'build-ts']);
});

gulp.task('build', ['lint-ts', 'build-ts', 'build-css']);
gulp.task('watch', ['watch-ts', 'watch-css']);
gulp.task('default', ['build', 'watch']);
