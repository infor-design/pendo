// -------------------------------------
//   Task: Clean
// -------------------------------------

module.exports = (gulp, paths) => {

  gulp.task('clean', () => {

    const del = require('del');

    return del([
      `${paths.site.www}/*.html`
    ]);
  });
}
