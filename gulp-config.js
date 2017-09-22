/* gulp-config.js */
module.exports = {
  paths: {
    base: {
      root: 'pendo-styles'
    },
    sources: {
      root:      'src',
      packages:  'src/packages',
      templates: 'site/templates',
      site:      'site',
      siteCss:   'site/css'
    },
    destinations: {
      site:  'site/www',
      dist: 'site/www/dist',
      tmp: 'site/www/tmp'
    }
  }
};
