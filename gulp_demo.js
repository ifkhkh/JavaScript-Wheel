// packages.json
{
    "dependencies": {
        "babel-core": "^6.26.3",
        "babel-preset-env": "^1.7.0",
        "babel-preset-es2015": "^6.24.1",
        "gulp": "3.9",
        "gulp-babel": "7",
        "gulp-cached": "^1.1.1",
        "gulp-changed": "^3.2.0",
        "gulp-clean": "^0.4.0",
        "gulp-clean-css": "^4.0.0",
        "gulp-concat": "^2.6.1",
        "gulp-debug": "^4.0.0",
        "gulp-htmlmin": "^5.0.1",
        "gulp-imagemin": "^5.0.3",
        "gulp-load-plugins": "^1.5.0",
        "gulp-remember": "^1.0.1",
        "gulp-rename": "^1.4.0",
        "gulp-rev": "^9.0.0",
        "gulp-replace": "^1.0.0",
        "gulp-rev-collector": "^1.3.1",
        "gulp-sourcemaps": "^2.6.5",
        "gulp-uglify": "^3.0.2",
        "gulp-watch": "^5.0.1",
        "run-sequence": "^2.2.1"
      },
      "scripts": {
        "build": "gulp"
      }
}

// gulpfile

const gulp = require('gulp')
const babel = require('gulp-babel')
const runSequence = require('run-sequence')
const rev = require('gulp-rev')
const revCollector = require('gulp-rev-collector')
const uglify = require('gulp-uglify')
const clean = require('gulp-clean')
const cleanCSS = require('gulp-clean-css')
const sourcemaps = require('gulp-sourcemaps')
const debug = require('gulp-debug')
const replace = require('gulp-replace')
const changed = require('gulp-changed')
const process = require('process')
const log = console.log.bind(console)

const oldPath = {
    css: 'static/css/**/*.css',
    js: ['static/js/**/*.js','!static/js/config.js'],
    html: 'templates/**/*.html',
    vendor: 'static/vendor/**/*',
    images: 'static/image/**/*',
    webfonts: 'static/webfonts/**/*',
    configJs: 'static/js/config.js'
}

const buildPath = {
    css: 'build/css',
    js: 'build/js',
    vendor: 'build/vendor',
    image: 'build/image',
    webfonts: 'build/webfonts',
    template: 'build/templates',
}

const revPath = {
    json: 'rev/**/*.json',
}

gulp.task('clean', function() {
    let stream = gulp.src(['build', 'rev'], {
        read: false
    }).pipe(clean())
    return stream
})

gulp.task('buildCss', function() {
    log('✨✨✨ (๑•́ ₃ •̀๑) build CSS is here ✨✨✨')
    let stream = gulp.src(oldPath.css, {base: 'static/css'})
        .pipe(replace(/\r\n/g, '\n')) //通一替换 win 和 mac 不同的回车换行符
        .pipe(rev())
        .pipe(changed(buildPath.css))
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(debug({
            title: 'css 编译'
        }))
        .pipe(gulp.dest(buildPath.css))
        .pipe(rev.manifest('rev/rev-manifest-css.json', {
            base: process.cwd() + '/rev',
            merge: true
        }))
        .pipe(gulp.dest('rev'))
    return stream
})

gulp.task('buildImage', function() {
    log('✨✨✨ (๑•́ ₃ •̀๑) build Image is here ✨✨✨')
    let stream = gulp.src(oldPath.images)
        .pipe(changed(buildPath.image))
        .pipe(debug({
            title: 'images 编译'
        }))
        .pipe(gulp.dest(buildPath.image))
    return stream
})

gulp.task('buildFont', function() {
    log('✨✨✨ (๑•́ ₃ •̀๑) build Font is here ✨✨✨')
    let stream = gulp.src(oldPath.webfonts)
        .pipe(changed(buildPath.webfonts))
        .pipe(debug({
            title: 'font 编译'
        }))
        .pipe(gulp.dest(buildPath.webfonts))
    return stream
})

gulp.task('buildJs', function() {
    log('✨✨✨ (๑•́ ₃ •̀๑) build JS is here ✨✨✨')
    let stream = gulp.src(oldPath.js)
        .pipe(replace(/\r\n/g, '\n'))
        .pipe(rev())
        .pipe(changed(buildPath.js))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(debug({
            title: 'js 编译'
        }))
        .pipe(gulp.dest(buildPath.js))
        .pipe(rev.manifest(`rev/rev-manifest-js.json`, {
            base: process.cwd() + '/rev',
            merge: true
        }))
        .pipe(gulp.dest('rev'))
    return stream
})

gulp.task('buildConfigJs', function() {
    log('✨✨✨ (๑•́ ₃ •̀๑) build Vendor is here ✨✨✨')
    let stream = gulp.src(oldPath.configJs)
        .pipe(changed(buildPath.js))
        .pipe(gulp.dest(buildPath.js))
    return stream
})

gulp.task('buildVendor', function() {
    log('✨✨✨ (๑•́ ₃ •̀๑) build Vendor is here ✨✨✨')
    let stream = gulp.src(oldPath.vendor)
        .pipe(changed(buildPath.vendor))
        .pipe(debug({
            title: 'vendor 编译',
        }))
        .pipe(gulp.dest(buildPath.vendor))
    return stream
})

gulp.task('buildHtml', function() {
    log('✨✨✨ (๑•́ ₃ •̀๑) build HTML is here ✨✨✨')
    let stream = gulp.src([revPath.json, oldPath.html])
        .pipe(revCollector())
        .pipe(debug({
            title: 'html 编译'
        }))
        .pipe(gulp.dest(buildPath.template))
    return stream
})


gulp.task('build', function (done) {
    runSequence(
        'buildCss',
        'buildImage',
        'buildFont',
        'buildJs',
        'buildConfigJs',
        'buildVendor',
        'buildHtml',
        done
    )
})


//监控文件变化
gulp.task('watch', function() {
    let sc = oldPath
    let stream = gulp.watch([
        sc.css,
        sc.js,
        sc.html,
        sc.images,
    ], ['build'])
    return stream
})

gulp.task('default', function(done) {
    runSequence(
        'clean',
        'build',
        'watch',
        done
    )
})

gulp.task('server', function(done) {
    runSequence(
        'clean',
        'build',
        done
    )
})
