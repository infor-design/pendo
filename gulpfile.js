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
const runSequence = require('run-sequence');


// -------------------------------------
//   Global Variables
// -------------------------------------
let publishDocObj = {};
let rawCss = {};


// -------------------------------------
//   Load Tasks
// -------------------------------------
require(`${gconfig.paths.tasks}/clean.js`)(gulp, gconfig);
require(`${gconfig.paths.tasks}/deploy.js`)(gulp, gconfig);
require(`${gconfig.paths.tasks}/serve.js`)(gulp, gconfig);
require(`${gconfig.paths.tasks}/site-css-compile.js`)(gulp, gconfig);
require(`${gconfig.paths.tasks}/src-md-compile.js`)(gulp, gconfig, rawCss);
require(`${gconfig.paths.tasks}/src-css-compile.js`)(gulp, gconfig, rawCss);
require(`${gconfig.paths.tasks}/stylelint.js`)(gulp, gconfig);


// -------------------------------------
//   Common Tasks
// -------------------------------------
gulp.task('default', ['src:md:compile']);

gulp.task('dev', ['clean'], done => {
  runSequence('src:md:compile', 'serve', done)
});


gulp.task('publish', (done) => {
  runSequence('deploy:clean', 'deploy:post', done);
});
