// -------------------------------------
//   Task: Build Site
//   Compile the website css
// -------------------------------------

module.exports = (gulp, gconfig) => {

  gulp.task('site:css:compile', () => {
    return gulp.src([
      './node_modules/@infor/ids-web/dist/ids-reset.min.css',
      './node_modules/@infor/ids-web/dist/ids-reset.min.css.map',
      './node_modules/@infor/ids-web/dist/ids-web.min.css',
      './node_modules/@infor/ids-web/dist/ids-web.min.css.map',
      './node_modules/@infor/documentation-css/dist/documentation.min.css',
      './node_modules/@infor/documentation-css/dist/documentation.min.css.map'
    ])
      .pipe(gulp.dest(`${gconfig.paths.site.www}/lib`));
  });
}
