// -------------------------------------
//   Task: Build Site
//   Compile the website css
// -------------------------------------

module.exports = (gulp, gconfig) => {

  gulp.task('site:css:compile', () => {
    return gulp.src('./node_modules/@infor/documentation-css/dist/documentation.min.css')
      .pipe(gulp.dest(`${gconfig.paths.site.www}/dist`));
  });
}
