// *************************************
//
//   Gulpfile
//
// *************************************

// -------------------------------------
// Load gulp & config
// -------------------------------------

const gulp = require('gulp');
const gconfig = require('./gulp/gulp-config.js');

// -------------------------------------
//   Global Variables
// -------------------------------------
let rawCss = {};


// -------------------------------------
//   Load Tasks
// -------------------------------------
require(`${gconfig.paths.tasks}/build.js`)(gulp, gconfig, rawCss);
require(`${gconfig.paths.tasks}/clean.js`)(gulp, gconfig);
require(`${gconfig.paths.tasks}/site-css-compile.js`)(gulp, gconfig);
require(`${gconfig.paths.tasks}/src-css-compile.js`)(gulp, gconfig, rawCss);
require(`${gconfig.paths.tasks}/serve.js`)(gulp, gconfig);
require(`${gconfig.paths.tasks}/stylelint.js`)(gulp, gconfig);


// -------------------------------------
//   Common Tasks
// -------------------------------------
gulp.task('default', ['build']);
gulp.task('dev', ['build', 'serve']);
