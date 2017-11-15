// -------------------------------------
//   Task: Stylelint
// -------------------------------------

module.exports = (gulp, gconfig) => {

  gulp.task('stylelint', () => {

    const stylelint = require('gulp-stylelint');

    return gulp.src([`${gconfig.paths.src.packages}/**/*.css`])
      .pipe(stylelint({
        failAfterError: true,
        reporters: [{
          formatter: 'verbose',
          console: true
        }]
      }))
  });
}
