/**
 * @fileoverview Runs a production server for serving the site/www files
 */

const browserSync = require("browser-sync").create('productionServer');
const baseDir = 'site/www';

browserSync.init({
  codesync: false,
  index: 'base.html',
  injectChanges: false,
  open: false,
  server: {
    baseDir: baseDir
  },
  logLevel: 'info',
  logPrefix: 'Pendo',
  port: 80,
  ui: false
});
