/* gulp-config.js */
module.exports = {
  project: {
    prefix: 'pendo-',
    zipName: 'publish'
  },
  paths: {
    root: './',
    dist: {
      root:   './publish',
      docs:   './publish/docs',
      assets: './publish/assets'
    },
    src: {
      root:     './src',
      packages: './src/packages',
    },
    site: {
      root:      './site',
      templates: './site/templates',
      www:       './site/www'
    },
    tasks: './gulp/tasks'
  },
  urls: {
    staging: 'http://docs-site-staging.us-east-1.elasticbeanstalk.com/api/docs/'
  },
  options: {
    marked: {
      gfm: true,
      highlight: function (code, lang, callback) {
        return require('pygmentize-bundled')({ lang: lang, format: 'html' }, code, function (err, result) {
          callback(err, result.toString());
        });
      }
    }
  }
};
