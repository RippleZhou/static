var gulp = require('gulp');
var iconfont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');

var paths = {
    iconfont: {
        name: 'iconfont',
        fontPath: '../font/iconfont/',
        input: {
            icon: ['icon/*.svg'],
            template: 'icon/iconfont.css'
        },
        output: {
            font: 'font/iconfont/',
            css: 'css/'
        }
    },
    fontDir: 'font/',
};

// 注册"iconfont"任务：根据svg生成字体
gulp.task('iconfont', function () {
    return gulp.src(paths.iconfont.input.icon)
        .pipe(iconfont({
            fontName: paths.iconfont.name,
            appendUnicode: true,
            formats: ['eot', 'svg', 'ttf', 'woff'],
        }))
        .on('glyphs', function(glyphs, options) {
            gulp.src(paths.iconfont.input.template)
                .pipe(consolidate('lodash', {
                    glyphs: glyphs,
                    fontName: paths.iconfont.name,
                    fontPath: paths.iconfont.fontPath,
                    className: paths.iconfont.name
                }))
                .pipe(gulp.dest(paths.iconfont.output.css));
        })
        .pipe(gulp.dest(paths.iconfont.output.font));
});
