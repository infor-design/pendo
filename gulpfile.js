// *************************************
//
//   Gulpfile
//
// *************************************

// -------------------------------------
// Load gulp & config
// -------------------------------------
const gulp  = require('gulp');

const paths = {
  root: './',
  src: {
    root:      './src',
    packages:  './src/packages',
  },
  site: {
    root:      './site',
    css:       './site/www/css',
    templates: './site/templates',
    www:       './site/www'
  },
  dist: './publish',
  tasks: './gulp/tasks'
};

// -------------------------------------
//   Global Variables
// -------------------------------------
let rawCss = {};


// -------------------------------------
//   Load Tasks
// -------------------------------------
require(`${paths.tasks}/build.js`)(gulp, paths, rawCss);
require(`${paths.tasks}/clean.js`)(gulp, paths);
require(`${paths.tasks}/compile-css.js`)(gulp, paths, rawCss);
require(`${paths.tasks}/serve.js`)(gulp, paths);
require(`${paths.tasks}/stylelint.js`)(gulp, paths);


// -------------------------------------
//   Common Tasks
// -------------------------------------
gulp.task('default', ['build']);
gulp.task('dev', ['build', 'serve']);
