// -------------------------------------
//   Task: Stylelint
// -------------------------------------

module.exports = (gulp, paths) => {

  gulp.task('stylelint', () => {

    const stylelint = require('gulp-stylelint');

    return gulp.src([`${paths.src.packages}/**/*.css`, `${paths.site.css}/site.css`])
      .pipe(stylelint({
        failAfterError: true,
        reporters: [{
          formatter: 'verbose',
          console: true
        }]
      }))
  });
}
