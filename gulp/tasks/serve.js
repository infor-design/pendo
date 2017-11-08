// -------------------------------------
//   Task: Serve
// -------------------------------------

module.exports = (gulp, paths) => {

  gulp.task('serve', () => {

    const browserSync = require('browser-sync').create('localDocServer');
    const gutil = require('gulp-util');

    browserSync.init({
      codesync: false,
      index: 'index.html',
      injectChanges: false,
      open: false,
      server: {
        baseDir: [paths.site.www]
      },
      logLevel: 'info',
      logPrefix: 'Pendo',
      ui: false
    });

    const toWatch = [
      `${paths.src.root}/**/*.md`,
      `${paths.src.packages}/**/*.css`,
      `${paths.site.templates}/**/*`,
      `${paths.site.css}/*`
    ];

    gulp
      .watch(toWatch, ['watchDone'])
      .on('change', (evt) => {
        changeEvent(evt);
      });
  });

  gulp.task('watchDone', ['build'], (done) => {
    browserSync.reload();
    done();
  });

  function changeEvent(evt) {
    gutil.log('File', gutil.colors.cyan(evt.path.replace(new RegExp('/.*(?=/' + paths.root + ')/'), '')), 'was', gutil.colors.magenta(evt.type));
  }

}
