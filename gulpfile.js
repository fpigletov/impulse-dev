const {src, dest, watch, parallel, series} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const fileInclude = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const size = require('gulp-size');
const plumber = require('gulp-plumber');
const svgSprite = require('gulp-svg-sprite');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const fs = require('fs');
const del = require('del');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const uglify = require('gulp-uglify-es').default;
const tiny = require('gulp-tinypng-compress');
const svgmin = require('gulp-svgmin');
const webp = require('gulp-webp');

//Transform Font Formats
const fonts = () => {
    src('./src/fonts/**.ttf')
        .pipe(ttf2woff())
        .pipe(dest(['./src/fonts/']));
    src('./src/fonts/**.ttf')
        .pipe(ttf2woff2())
        .pipe(dest(['./src/fonts/']));
    return src(['./src/fonts/*.woff', './src/fonts/*.woff2'])
        .pipe(dest('./app/fonts/'))
        .pipe(browserSync.stream());
};

//SVG Sprite
const svgSprites = () => {
    return src('./src/img/svg/*.svg')
        .pipe(svgmin({
            js2svg: {
                pretty: true,
            },
        }))
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: "../sprite.svg"
                }
            }
        }))
        .pipe(dest('./app/img/sprites'));
};

//Styles SASS, CSS
const styles = () => {
    return src('./src/sass/**/*.sass')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(plumber({
            errorHandler: notify.onError()
        }))
        .pipe(rename({
			suffix: '.min'
        }))
        .pipe(autoprefixer({
			cascade: false,
		}))
		.pipe(cleanCSS({
			level: 2
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./app/css/'))
        .pipe(browserSync.stream());
};

//All Other Files
const resources = () => {
    return src('./src/resources/**')
        .pipe(dest('./app/resources/'));
};

//HTML files
const html = () => {
    return src('./src/*.html')
        .pipe(plumber({
            errorHandler: notify.onError()
        }))
        .pipe(fileInclude({
			prefix: '@@',
			basepath: '@file'
		}))
        .pipe(size({ title: 'Before'}))
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(size({ title: 'After'}))
        .pipe(dest('./app'))
        .pipe(browserSync.stream());
    
};

//Webp
const webpImages = () => {
    return src(['./src/img/**/*.{jpg,jpeg,png}'])
        .pipe(webp())
        .pipe(dest('./src/img/'));
};

//Delete App Folder
const clear = () => {
    return del(['app/*']);
};

//Moving img to App folder
const imgToApp = () => {
    return src(['./src/img/**/*.jpg', './src/img/**/*.png', './src/img/**/*.jpeg', './src/img/**/*.webp'])
        .pipe(dest('./app/img'));
};

//Scripts
const scripts = () => {
    return src('./src/js/script.js')
        .pipe(webpackStream({
            mode: 'development',
            output: {
                filename: 'script.js',
            },
            module: {
                rules: [{
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                }]
            },
        }))
        .on('error', function (err) {
            console.error('WEBPACK ERROR', err);
            this.emit('end'); // Don't stop the rest of the task
        })

        .pipe(sourcemaps.init())
        .pipe(uglify().on("error", notify.onError()))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./app/js'))
        .pipe(browserSync.stream());
};

//All Other Files
const moveScripts = () => {
    return src('./src/js/vendors/*.js')
        .pipe(dest('./app/js/vendors/'));
};

//Watch Files
const watchFiles = () => {
    browserSync.init({
        server: {
            baseDir: "./app"
        }
    });

    watch('./src/sass/**/*.sass', styles);
    watch('./src/**/*.html', html);    
    watch('./src/img/**/**.{jpg,jpeg,png}', webpImages);
    watch('./src/img/**/**.{jpg,jpeg,png,svg,webp}', imgToApp);    
    watch('./src/img/**/*.svg', svgSprites);
    watch('./src/resources/**', resources);
    watch('./src/fonts/**.ttf', fonts);    
    watch('./src/js/**/*.js', scripts);
    watch('./src/js/**/*.js', moveScripts);
};

exports.styles = styles;
exports.watchFiles = watchFiles;
exports.html = html;

exports.default = series(clear, parallel(html, scripts, moveScripts, fonts, resources, webpImages, imgToApp, svgSprites), styles, watchFiles);

// Build Version
const tinypng = () => {
    return src(['./src/img/**/*.jpg', './src/img/**/*.png', './src/img/**/*.jpeg'])
        .pipe(tiny({
            key: '6YqzQHqjrJ35n8SGgcz7GF8KgBLvXG00',
            log: true
        }))
        .pipe(dest('./app/img'));
};

const stylesBuild = () => {
    return src('./src/sass/**/*.sass')
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(plumber({
            errorHandler: notify.onError()
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(autoprefixer({
            cascade: false,
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(dest('./app/css/'));
};

const scriptsBuild = () => {
    return src('./src/js/script.js')
        .pipe(webpackStream({
            mode: 'development',
            output: {
                filename: 'script.js',
            },
            module: {
                rules: [{
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                }]
            },
        }))
        .on('error', function (err) {
            console.error('WEBPACK ERROR', err);
            this.emit('end'); // Don't stop the rest of the task
        })
        .pipe(uglify().on("error", notify.onError()))
        .pipe(dest('./app/js'));
};

exports.build = series(clear, parallel(html, scriptsBuild, fonts, resources, webpImages, imgToApp, svgSprites), stylesBuild, tinypng);