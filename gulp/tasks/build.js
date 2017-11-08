// -------------------------------------
//   Task: Build Site HTML
//   Build html files from markdown
// -------------------------------------

module.exports = (gulp, paths, rawCss) => {

  gulp.task('build', ['compile:css'], () => {

    const flatten = require('gulp-flatten');
    const hb = require('gulp-hb');
    const packageData = require('../../package.json');
    const pandoc = require('gulp-pandoc');
    const rename = require('gulp-rename');

    const hbStream = hb()
      .partials(`${paths.site.templates}/partials/*.hbs`)
      .data(rawCss);

    const filter = require('gulp-filter');
    const readmeFilter = filter('*/packages/**/README.md', {restore: true})

    return gulp.src(`${paths.src.root}/**/*.md`)

      // Filter readme files to rename
      .pipe(readmeFilter)

      // Rename filename from readme to the folder name
      .pipe(rename((path) => {
        path.basename = path.dirname.replace('pendo-', '');
      }))

      // Restore filtered out files
      .pipe(readmeFilter.restore)

      // Adds raw css to pages with handlebars temtplates
      .pipe(hbStream)

      // Convert markdown to html and insert into layout template
      .pipe(pandoc({
        from: 'markdown-markdown_in_html_blocks', // http://pandoc.org/MANUAL.html#raw-html
        to: 'html5+yaml_metadata_block',
        ext: '.html',
        args: [
          `--data-dir=${paths.site.root}`, // looks for template dir inside data-dir
          '--template=layout.html',
          `--variable=releaseversion:${packageData.version}`,
          `--variable=embeddedCss:${rawCss}`,
          '--variable=lang:en'
        ]
      }))
      .pipe(rename((path) => {
        path.basename = path.basename.toLowerCase();
      }))
      .pipe(flatten())
      .pipe(gulp.dest(paths.site.www));
  });
}
