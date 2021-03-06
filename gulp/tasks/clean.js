// -------------------------------------
//   Task: Clean
// -------------------------------------

module.exports = (gulp, gconfig) => {

  gulp.task('clean', () => {

    const del = require('del');

    return del([
      `${gconfig.paths.site.www}/*.html`,
      `${gconfig.paths.site.www}/assets/dist`,
      `${gconfig.paths.site.www}/lib/*`,
      `${gconfig.paths.src.packages}/*/dist`,
      `${gconfig.paths.dist.root}`,
      `${gconfig.project.zipName}.zip`,
    ]);
  });
}
