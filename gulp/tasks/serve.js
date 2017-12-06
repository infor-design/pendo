// -------------------------------------
//   Task: Serve
// -------------------------------------

module.exports = (gulp, gconfig) => {

  const browserSync = require('browser-sync').create('localDocServer');
  const gutil = require('gulp-util');

  gulp.task('serve', () => {
    browserSync.init({
      codesync: false,
      index: 'index.html',
      injectChanges: false,
      open: false,
      server: {
        baseDir: [gconfig.paths.site.www]
      },
      logLevel: 'info',
      logPrefix: 'Pendo',
      ui: false
    });

    const toWatch = [
      `${gconfig.paths.src.root}/**/*[.md, .yaml]`,
      `${gconfig.paths.src.packages}/**/*.css`,
      `${gconfig.paths.site.templates}/**/*`,
      `${gconfig.paths.site.www}/css/*`
    ];

    const changeEvent = (evt) => {
      gutil.log('File', gutil.colors.cyan(evt.path.replace(new RegExp('/.*(?=/' + gconfig.paths.root + ')/'), '')), 'was', gutil.colors.magenta(evt.type));
    };

    gulp
      .watch(toWatch, ['watchDone'])
      .on('change', (evt) => {
        changeEvent(evt);
      });
  });

  gulp.task('watchDone', ['src:md:compile'], (done) => {
    browserSync.reload();
    done();
  });
}
