// -------------------------------------
//   Task: Compile:css
//   Compiles/minifies css for adding
//   into a template later so the users
//   can copy the raw string
// -------------------------------------

module.exports = (gulp, gconfig, rawCss) => {

  gulp.task('src:css:compile', () => {


    const atFor = require('postcss-for');
    const atImport = require('postcss-import');
    const atVariables  = require('postcss-at-rules-variables');
    const cssnano = require('cssnano');
    const cssnext = require('postcss-cssnext');
    const flatten = require('gulp-flatten');
    const packageData = require('../../package.json');
    const path = require('path');
    const postcss = require('gulp-postcss');
    const rename = require('gulp-rename');
    const tap = require('gulp-tap');


    // Note: plugin order matters
    const plugins = [
      atImport,
      atVariables,
      cssnext,
      cssnano({ autoprefixer: false })
    ];

    return gulp.src(`${gconfig.paths.src.packages}/*/*.css`)
      .pipe(postcss(plugins, { map: false }))
      .pipe(tap((file, t) => {
        const filename = path.basename(file.path).replace('.css', '');
        const cssString = `/* --- Infor Styles v${packageData.version} --- */${file.contents.toString()}`;
        file.contents = new Buffer(cssString, "utf-8");
      }))
      .pipe(rename({ suffix: '.min' }))

      // Put in package folder dist
      .pipe(rename((path) => {
        path.dirname += '/dist';
      }))
      .pipe(gulp.dest(gconfig.paths.src.packages))

      // Put in site dist
      .pipe(rename((path) => {
        path.dirname = 'dist';
      }))
      .pipe(gulp.dest(`${gconfig.paths.site.www}/assets`))
    });
}
