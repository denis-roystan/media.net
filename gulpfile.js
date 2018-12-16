var gulp = require('gulp'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    htmlmin = require('gulp-htmlmin'),
    less = require('gulp-less'),
    connect = require('gulp-connect'),
    del = require('del');

var paths = {
    styles: {
        src: [
            './styles/*.less',
            './styles/**/*.less'
        ],
        dest: './dist/styles/'
    },
    scripts: {
        src: [
            './controllers/*.js',
            './controllers/**/**.js'
            ],
        dest: './dist/controllers/'
    }
};

function clean() {
    return del([ './dist' ]);
}

gulp.task('less', function(done) {
    gulp.src(paths.styles.src)
    .pipe(less())
    .pipe(concat('style-bundle.css'))
    .pipe(gulp.dest(paths.styles.dest), { overwrite: true })
    .pipe(connect.reload());
    done();
});

gulp.task('minify-js', function(done) {
    gulp.src(paths.scripts.src)
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(concat('script-bundle.js'))
    // .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest), { overwrite: true })
    .pipe(connect.reload());
    done()
});

gulp.task('render-html', function(done) {
    gulp.src('./index.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('./dist/'), { overwrite: true })
    .pipe(connect.reload());
    done();
});

gulp.task('connect', function(done) {
    connect.server({
        root: 'dist',
        livereload: true
    });
    done();
});

gulp.task('watch', function(done) {
    gulp.watch(paths.styles.src, gulp.series('less'));
    gulp.watch(paths.scripts.src, gulp.series('minify-js'));
    gulp.watch('./index.html', gulp.series('render-html'));
    done();
});

var build = gulp.series(clean, gulp.series('render-html', 'less', 'minify-js'));

gulp.task('build', build);

gulp.task('default', gulp.series('build', 'connect', 'watch'));