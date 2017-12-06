// -------------------------------------
//   Task: Build Site HTML
//   Build html files from markdown
// -------------------------------------

module.exports = (gulp, gconfig, rawCss) => {

  gulp.task('src:md:compile', ['src:css:compile', 'site:css:compile'], () => {

    const flatten = require('gulp-flatten');
    const frontMatter = require('gulp-front-matter');
    const fs = require('fs');
    const handlebars = require('Handlebars');
    const markdown = require('gulp-markdown'); // base engine is marked to match json-md-compile
    const pkgJson = require('../../package.json');
    const rename = require('gulp-rename');
    const tap = require('gulp-tap');
    const yaml = require('js-yaml');

    // Load sitemap for sidebar
    const sitemap = yaml.safeLoad(
      fs.readFileSync(`${gconfig.paths.src.root}/sitemap.yaml`, 'utf8')
    );

    // read the template from page.hbs
    return gulp.src(`${gconfig.paths.site.templates}/layout.hbs`)
      .pipe(tap(file => {

        // file is page.hbs so generate template from file
        const template = handlebars.compile(file.contents.toString());

        // read all src markdown files
        return gulp.src(`${gconfig.paths.src.root}/**/*.md`)

          // extract/remove yaml from MD
          .pipe(frontMatter({
            property: 'data.frontMatter'
          }))

          // convert from markdown and add syntax highlighting
          .pipe(markdown(gconfig.options.marked))

          .pipe(tap(file => {
            // file is the converted HTML from the markdown
            // set the contents to the contents property on data
            const data = {
              contents: file.contents.toString(),
              meta: file.data.frontMatter,
              pkgJson: pkgJson,
              sitemap: sitemap
            };

            // we will pass data to the Handlebars template to create the actual HTML to use
            const html = template(data);

            // replace the file contents with the new HTML created from the Handlebars template + data object that contains the HTML made from the markdown conversion
            file.contents = new Buffer(html, "utf-8");
          }))

          // Rename filename of package/*/readme.md files to folder name
          .pipe(rename(file => {
            if (file.basename.toLowerCase() === 'readme') {
              file.basename = file.dirname.replace(`${gconfig.project.prefix}-`, '');
            }
          }))

          // Flatten the directory structure
          .pipe(flatten())
          .pipe(gulp.dest(gconfig.paths.site.www));
      }));
  });
}
