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
//   `gulp pre-commit'
//   'gulp serve:site'
//       'gulp watch'
//
// *************************************

// -------------------------------------
// Load gulp & config
// gulp: The streaming build system
// -------------------------------------
const gulp   = require('gulp'),
  gConfig    = require('./gulp-config.js'),
  basePath   = gConfig.paths.base.root,
  sourcePath = gConfig.paths.sources,
  destPath   = gConfig.paths.destinations;


// -------------------------------------
// Load "gulp-" plugins
// -------------------------------------
// gulp-concat       : Concatenate files
// gulp-gitmodified  : List modified files
// gulp-hb           : Handlebars parser
// gulp-pandoc       : File converter
// gulp-postcss      : Transform styles with JS
// gulp-rename       : Rename files
// gulp-stylelint    : Lint the styles
// gulp-tap          : Easily tap into a pipeline (debug)
// gulp-util         : Utility functions
// -------------------------------------
const concat   = require('gulp-concat'),
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
gulp.task('default', ['build', 'serve']);


// -------------------------------------
//   Task: Build Docs
//   Build html documentation files
// -------------------------------------
gulp.task('build', ['compile:css'], () => {
  const packageData = require('./package.json');

  const hbStream = hb()
      .partials(`${sourcePath.templates}/partials/*.hbs`)
      .data(RAW_CSS);


  return gulp.src(`${sourcePath.packages}/**/README.md`)

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
        `--data-dir=${sourcePath.site}`, // looks for template dir inside data-dir
        '--template=layout.html',
        '--table-of-contents',
        `--variable=releaseversion:${packageData.version}`,
        `--variable=embeddedCss:${RAW_CSS}`,
        '--variable=lang:en'
      ]
    }))
    .pipe(flatten())
    .pipe(gulp.dest(destPath.site));
});


// -------------------------------------
//   Task: Default
//   Does a build and serves the website
// -------------------------------------

gulp.task('compile:css', () => {
  // Note: plugin order matters
  const plugins = [
    atImport,
    atVariables,
    cssnext,
    cssnano({ autoprefixer: false })
  ];

  // console.log(RAW_CSS)
  return gulp.src(`${sourcePath.packages}/**/[!_]*.css`)
    .pipe(postcss(plugins, { map: false }))
    .pipe(tap((file, t) => {
      let filename = path.basename(file.path).replace('.css', '');
      RAW_CSS[`${filename}Css`] = file.contents.toString();
    }));
});



// -------------------------------------
//   Task: Clean
//   Delete built files
// -------------------------------------
gulp.task('clean', () => {
  return del([
    `${destPath.site}/*.html`
  ]);
});


// -------------------------------------
//   Task: stylelint
//   Lint the source css
// -------------------------------------
gulp.task('stylelint', () => {
  return gulp.src(`${sourcePath.packages}/**/*.css`)
    .pipe(stylelint({
      failAfterError: true,
      reporters: [{
        formatter: 'verbose',
        console: true
      }]
    }))
});


// -------------------------------------
//   Task: Pre-commit
//   Run things before committing
// -------------------------------------
gulp.task('pre-commit', () => {
  // // Lint only modified css files
  // return gulp.src(`${sourcePath.packages}/**/*.css`)
  //   .pipe(gitmodified(['modified']))
  //   .pipe(stylelint({
  //     failAfterError: true,
  //     reporters: [{
  //       formatter: 'verbose',
  //       console: true
  //     }]
  //   }));
});


// -------------------------------------
//   Task: Serve Demo & site
// -------------------------------------
gulp.task('serve', () => {
  browserSync.init({
    codesync: false,
    index: 'base.html',
    injectChanges: false,
    open: false,
    server: {
      baseDir: [destPath.site]
    },
    logLevel: 'info',
    logPrefix: 'Pendo',
    ui: false
  });

  const srcMarkdown = [
    `${sourcePath.templates}/**/*`,
    `${sourcePath.packages}/**/*.md`,
    `${sourcePath.packages}/**/*.css`,
    `${sourcePath.siteCss}/*`
  ];

  gulp
    .watch(srcMarkdown, ['watch'])
    .on('change', (evt) => {
      changeEvent(evt);
    });
});


// -------------------------------------
//   Task: watch-files
//   Guarantees reload is last task
// -------------------------------------
gulp.task('watch', ['build'], (done) => {
  browserSync.reload();
  done();
});


// -------------------------------------
//   Function: changeEvent()
// -------------------------------------
function changeEvent(evt) {
  gutil.log('File', gutil.colors.cyan(evt.path.replace(new RegExp('/.*(?=/' + basePath + ')/'), '')), 'was', gutil.colors.magenta(evt.type));
}
