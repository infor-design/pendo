// *************************************
//
//   Gulpfile
//
// *************************************
//
// Available tasks:
//   'gulp default'
//   'gulp build'
//      'gulp compile:css'
//   'gulp clean'
//   'gulp stylelint'
//   'gulp serve:site'
//
// *************************************

// -------------------------------------
// Load gulp & config
// gulp: The streaming build system
// -------------------------------------
const gulp  = require('gulp');
const paths = {
  root: 'pendo-styles',
  src: {
    root:      'src',
    packages:  'src/packages',
    templates: 'site/templates',
    site:      'site',
    siteCss:   'site/www/css'
  },
  dest: {
    www:  'site/www'
  }
};


// -------------------------------------
// Load "gulp-" plugins
// -------------------------------------
// gulp-flatten      : Flatten file directories
// gulp-gitmodified  : List modified files
// gulp-hb           : Handlebars parser
// gulp-pandoc       : File converter
// gulp-postcss      : Transform styles with JS
// gulp-rename       : Rename files
// gulp-stylelint    : Lint the styles
// gulp-tap          : Easily tap into a pipeline (debug)
// gulp-util         : Utility functions
// -------------------------------------
const
  flatten     = require('gulp-flatten'),
  gitmodified = require('gulp-gitmodified'),
  hb          = require('gulp-hb'),
  pandoc      = require('gulp-pandoc'),
  postcss     = require('gulp-postcss'),
  rename      = require('gulp-rename'),
  stylelint   = require('gulp-stylelint'),
  tap         = require('gulp-tap'),
  gutil       = require('gulp-util');


// -------------------------------------
//   Utility NPM Plugins
// -------------------------------------
// browserSync    : Method of serving sites
// del            : Delete files
// fs             : Read/sync file stream
// -------------------------------------
const browserSync   = require('browser-sync').create('localDocServer'),
  del               = require('del'),
  fs                = require('fs'),
  path              = require('path');


// -------------------------------------
//   PostCSS Plugins
// -------------------------------------
// postcss-for       : Allow at-for loops
// postcss-variables : Allow at-vars in at-for loops
// postcss-import    : Include css files with '@'
// postcss-commas    : Allow lists of properties per value
// postcss-cssnext   : Collection of future proof plugins
// cssnano           : CSS minify
// lost              : Grid system
// -------------------------------------
const atFor    = require('postcss-for'),
  atImport     = require('postcss-import'),
  atVariables  = require('postcss-at-rules-variables'),
  commas       = require('postcss-commas'),
  cssnext      = require('postcss-cssnext'),
  cssnano      = require('cssnano'),
  lost         = require('lost');


// -------------------------------------
//   Global Variables
// -------------------------------------
let RAW_CSS = {};


// -------------------------------------
//   Task: Default
//   Does a build and serves the website
// -------------------------------------
gulp.task('default', ['build']);


// -------------------------------------
//   Task: Default
//   Does a build and serves the website
// -------------------------------------
gulp.task('dev', ['build', 'serve']);


// -------------------------------------
//   Task: Build Docs
//   Build html documentation files from src/packages
// -------------------------------------
gulp.task('build', ['compile:css'], () => {
  const packageData = require('./package.json');

  const hbStream = hb()
      .partials(`${paths.src.templates}/partials/*.hbs`)
      .data(RAW_CSS);


  return gulp.src(`${paths.src.packages}/**/README.md`)

    // Rename filename from readme to the folder name
    .pipe(rename((path) => {
      path.basename = path.dirname.replace('pendo-', '');
    }))

    // Adds raw css to pages with handlebars templates
    .pipe(hbStream)

    // Convert markdown to html and insert into layout template
    .pipe(pandoc({
      from: 'markdown-markdown_in_html_blocks', // http://pandoc.org/MANUAL.html#raw-html
      to: 'html5+yaml_metadata_block',
      ext: '.html',
      args: [
        `--data-dir=${paths.src.site}`, // looks for template dir inside data-dir
        '--template=layout.html',
        '--table-of-contents',
        '--toc-depth=4',
        `--variable=releaseversion:${packageData.version}`,
        `--variable=embeddedCss:${RAW_CSS}`,
        '--variable=lang:en'
      ]
    }))
    .pipe(flatten())
    .pipe(gulp.dest(paths.dest.www));
});


// -------------------------------------
//   Task: Compile:css
//   Compiles/minifies css for adding
//   into a template later so the users
//   can copy the raw string
// -------------------------------------
gulp.task('compile:css', () => {
  const packageData = require('./package.json');

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
      const cssString = `/* ------------------------------
 * -- Infor Styles v${packageData.version} ---
 * ------------------------------ */
 ${file.contents.toString()}`;

      RAW_CSS[`${filename}Css`] = cssString;
    }));
});



// -------------------------------------
//   Task: Clean
//   Delete built files
// -------------------------------------
gulp.task('clean', () => {
  return del([
    `${paths.dest.www}/*.html`
  ]);
});


// -------------------------------------
//   Task: stylelint
//   Lint the source css
// -------------------------------------
gulp.task('stylelint', () => {
  return gulp.src([`${paths.src.packages}/**/*.css`, `${paths.src.siteCss}/site.css`])
    .pipe(gitmodified(['modified']))
    .pipe(stylelint({
      failAfterError: true,
      reporters: [{
        formatter: 'verbose',
        console: true
      }]
    }))
});


// -------------------------------------
//   Task: Serve Demo & site
// -------------------------------------
gulp.task('serve', () => {
  browserSync.init({
    codesync: false,
    index: 'index.html',
    injectChanges: false,
    open: false,
    server: {
      baseDir: [paths.dest.www]
    },
    logLevel: 'info',
    logPrefix: 'Pendo',
    ui: false
  });

  const toWatch = [
    `${paths.src.templates}/**/*`,
    `${paths.src.packages}/**/*.md`,
    `${paths.src.packages}/**/*.css`,
    `${paths.src.siteCss}/*`
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


// -------------------------------------
//   Function: changeEvent()
// -------------------------------------
function changeEvent(evt) {
  gutil.log('File', gutil.colors.cyan(evt.path.replace(new RegExp('/.*(?=/' + paths.root + ')/'), '')), 'was', gutil.colors.magenta(evt.type));
}
