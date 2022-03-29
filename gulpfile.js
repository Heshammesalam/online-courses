const gulp = require('gulp'),

    del                       = require('del'),
    sourcemaps                = require('gulp-sourcemaps'),
    plumber                   = require('gulp-plumber'),
    sass                      = require('gulp-sass'),
    autoprefixer              = require('gulp-autoprefixer'),
    minifyCss                 = require('gulp-clean-css'),
    purge                     = require('gulp-purgecss'),
    webpack                   = require('webpack-stream'),
    uglify                    = require('gulp-uglify-es').default,
    concat                    = require('gulp-concat'),
    imagemin                  = require('gulp-imagemin'),
    browserSync               = require('browser-sync').create(),
    dependents                = require('gulp-dependents'),
    nunjucksRender            = require('gulp-nunjucks-render'),
    headerComment             = require('gulp-header-comment'),
    rename                    = require('gulp-rename'),
    rtlcss                    = require('gulp-rtlcss'),
    javascriptObfuscator      = require('gulp-javascript-obfuscator'),
   
    mode                      = require('gulp-mode')({
        modes: ["production", "development"],
        default: "development",
        verbose: false
    }),

    data                      = require('gulp-data'),
    fs                        = require('fs'),


    src_folder                = './src/',
    src_assets_folder         = src_folder + 'assets/',
    dist_folder               = './dist/',
    dist_assets_folder        = dist_folder + 'assets/',
    node_modules_folder       = './node_modules/',
    dist_node_modules_folder  = dist_folder + 'node_modules/',

    node_dependencies         = Object.keys(require('./package.json').dependencies || {}),

    jsSRC = [
        './node_modules/jquery/dist/jquery.js',
        './node_modules/bootstrap/dist/js/bootstrap.bundle.js',
        // './node_modules/intl-tel-input/build/js/intlTelInput.js',
        // './node_modules/jquery-ui-dist/jquery-ui.js',
        './node_modules/slick-carousel/slick/slick.min.js',
//         './node_modules/parsleyjs/dist/parsley.min.js',
//         './node_modules/jquery-bar-rating/dist/jquery.barrating.min.js',
        './src/assets/js/app.js'
    ];


// Removing The Dist Folder
gulp.task('clear', () => del([ dist_folder ]));

// Compile the Nunjucks
gulp.task('html', () => {
    return gulp.src([ src_folder + 'pages/' + '**/*.html' ], {
        base: src_folder + 'pages/',
    })
        .pipe(data(function () {
            return JSON.parse(fs.readFileSync(src_folder +  'template/' + 'data.json'));
        }))
        .pipe(nunjucksRender({
            path: src_folder + 'template/',
            watch: true
        }))
        .pipe(gulp.dest(dist_folder))
        .pipe(browserSync.stream());
});

//Validate the HTML
gulp.task('validate', () => {
    return gulp.src([ dist_folder + '**/*.html' ])
        .pipe(w3cjs())
        .pipe(w3cjs.reporter());
});

// Copy Font Awesome Fonts From NPM
gulp.task('fontAwesome', () => {
    return gulp.src([node_modules_folder + '@fortawesome/fontawesome-free/webfonts/**/*.+(eot|svg|ttf|woff|woff2)'])
        .pipe(gulp.dest(dist_assets_folder + 'webfonts'))
});

// Copy Fonts From SRC Folder
gulp.task('fonts', () => {
    return gulp.src([src_assets_folder + 'fonts/**/*.+(eot|svg|ttf|woff|woff2)'])
        .pipe(gulp.dest(dist_assets_folder + 'fonts'))
});

// Compile SCSS and Minify CSS
gulp.task('sass', () => {
    return gulp.src([src_assets_folder + 'scss/**/*.scss'])
        .pipe(mode.development(sourcemaps.init()))
        .pipe(mode.development(plumber()))
        .pipe(dependents())
        .pipe(sass({
            includePaths: ['node_modules']
        }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(minifyCss()) // Removing this line makes an error called  MIME type ('text/html')
        .pipe(mode.development(sourcemaps.write('.')))
        .pipe(mode.production(headerComment(`
            Generated on <%= moment().format('YYYY-MM-DD') %>
            Author: <%= _.capitalize(pkg.author) %>
            Credits: <%= _.capitalize(pkg.credit) %>
        `)))
        .pipe(gulp.dest(dist_assets_folder + 'css'))
        .pipe(browserSync.stream());
});

// Compile SCSS, Minify CSS and RTL Support
gulp.task('sass-rtl', () => {
    return gulp.src([src_assets_folder + 'scss/**/*.scss'])
        .pipe(mode.development(sourcemaps.init()))
        .pipe(mode.development(plumber()))
        .pipe(dependents())
        .pipe(sass({
            includePaths: ['node_modules']
        }).on('error', sass.logError))
        .pipe(rtlcss())
        .pipe(autoprefixer())
        .pipe(minifyCss()) // Removing this line makes an error called  MIME type ('text/html')
        .pipe(rename({suffix: '-rtl'})) // Append "-rtl" to the filename.
        .pipe(mode.development(sourcemaps.write('.')))
        .pipe(mode.production(headerComment(`
            Generated on <%= moment().format('YYYY-MM-DD') %>
            Author: <%= _.capitalize(pkg.author) %>
            Credits: <%= _.capitalize(pkg.credit) %>
        `)))
        .pipe(gulp.dest(dist_assets_folder + 'css'))
        .pipe(browserSync.stream());
});

// Remove Unnecessary CSS
gulp.task('purge', () => {
    return gulp.src([dist_assets_folder + 'css/**/*.css'])
        .pipe(mode.production(purge({
            content: [ dist_folder + '/**/*.html']
        })))
        .pipe(mode.production(gulp.dest( dist_assets_folder + 'css')))
});

// Compile JS Code
gulp.task('js', () => {
    return gulp.src(jsSRC)
        .pipe(plumber())
        // .pipe(webpack({
        //     mode: 'production'
        // }))
        .pipe(mode.production(sourcemaps.init()))
        .pipe(concat('app.js'))
        .pipe(mode.production(uglify()))
        .pipe(mode.production(javascriptObfuscator({
            compact:true,
            sourceMap: true
        })))
        .pipe(mode.production(headerComment(`
            Generated on <%= moment().format('YYYY-MM-DD') %>
            Author: <%= _.capitalize(pkg.author) %>
            Credits: <%= _.capitalize(pkg.credit) %>
        `)))
        .pipe(mode.production(sourcemaps.write('.')))
        .pipe(gulp.dest(dist_assets_folder + 'js'))
        .pipe(browserSync.stream());
});

// Minify Images
gulp.task('images', () => {
    return gulp.src([src_assets_folder + 'images/**/*.+(png|jpg|jpeg|gif|svg|ico|webmanifest)'])
        .pipe(mode.production(imagemin()))
        .pipe(gulp.dest(dist_assets_folder + 'images'))
        .pipe(browserSync.stream());
});

// Adding The Browser Config Into The Root Directory
gulp.task('browser-config', () => {
    return gulp.src([src_assets_folder + 'images/favicon/**/*.xml'])
        .pipe(gulp.dest(dist_folder))
});

// Moving The Util Library Only Used With Tel-Input Package
// gulp.task('util', () => {
//     return gulp.src([
//         node_modules_folder + 'intl-tel-input/build/js/utils.js'
//     ], { since: gulp.lastRun('util') })
//         .pipe(gulp.dest(dist_assets_folder + 'js'))
// });

gulp.task('build', gulp.series('clear', 'html', 'sass', 'sass-rtl', 'js', 'images', 'fontAwesome','fonts', 'browser-config'));
gulp.task('dev', gulp.series('html', 'sass', 'sass-rtl', 'js'));

// Browser Sync
gulp.task('serve', () => {
    return browserSync.init({
        server: {
            baseDir: [ 'dist' ]
        },
        port: 3000
    });
});

// Watch Task To Watch All The Files Changes
gulp.task('watch', () => {
    const watchImages = [
        src_assets_folder + 'images/**/*.+(png|jpg|jpeg|gif|svg|ico)'
    ];

    gulp.watch(src_folder + '**/*.html', gulp.series('html', 'validate')).on('change', browserSync.reload);
    gulp.watch(src_folder +  'template/' + 'data.json', gulp.series('html', 'validate')).on('change', browserSync.reload);
    gulp.watch(src_folder + '**/*.js', gulp.series('js')).on('change', browserSync.reload);
    gulp.watch(src_folder + '**/*.scss', gulp.series('sass', 'sass-rtl')).on('change', browserSync.reload);
    gulp.watch(watchImages, gulp.series('images')).on('change', browserSync.reload);
});

gulp.task('default', gulp.series('build', gulp.parallel('serve', 'watch')));