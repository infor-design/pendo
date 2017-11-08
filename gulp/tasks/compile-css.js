// -------------------------------------
//   Task: Compile:css
//   Compiles/minifies css for adding
//   into a template later so the users
//   can copy the raw string
// -------------------------------------

module.exports = (gulp, paths, rawCss) => {

  gulp.task('compile:css', () => {

    const atFor = require('postcss-for');
    const atImport = require('postcss-import');
    const atVariables  = require('postcss-at-rules-variables');
    const cssnano = require('cssnano');
    const cssnext = require('postcss-cssnext');
    const packageData = require('../../package.json');
    const path = require('path');
    const postcss = require('gulp-postcss');
    const tap = require('gulp-tap');


    // Note: plugin order matters
    const plugins = [
      atImport,
      atVariables,
      cssnext,
      cssnano({ autoprefixer: false })
    ];

    return gulp.src(`${paths.src.packages}/**/[!_]*.css`)
      .pipe(postcss(plugins, { map: false }))
      .pipe(tap((file, t) => {
        const filename = path.basename(file.path).replace('.css', '');
        const cssString = `
          /* ------------------------------
           * -- Infor Styles v${packageData.version} ---
           * ------------------------------ */
          ${file.contents.toString()}`;

        rawCss[`${filename}Css`] = cssString;
      }));
  });

}
