// -------------------------------------
//   Task: Publish Zip (file)
// -------------------------------------

module.exports = (gulp, gconfig) => {

  // -------------------------------------
  //   Functions
  // -------------------------------------
  const helperFns = {
    /**
     * Returns the last folder in the path
     * @param  {String} filePath - The full dir path without the file
     * @return {String}          - The last folder in the path
     */
    createFileNameFromFolder: (filePath) => {
      let pathArr = filePath.split('/');
      let str = pathArr[pathArr.length - 1];

      if (gconfig.project.prefix) {
        str = str.replace(gconfig.project.prefix, '');
      }
      return str;
    }
  };

  // -------------------------------------
  //   Variables
  // -------------------------------------
  const flatten = require('gulp-flatten');
  const fs = require('fs');
  const gutil = require('gulp-util');
  const packageJson = require('../../package.json');
  const path = require('path');
  const rename  = require('gulp-rename');
  const runSequence = require('run-sequence');

  let publishDocObj = {};

  // -------------------------------------
  //   Setup
  // -------------------------------------

  // Create folders if needed
  if (!fs.existsSync(gconfig.paths.dist.root)){
    fs.mkdirSync(gconfig.paths.dist.root);
  }

  if (!fs.existsSync(gconfig.paths.dist.docs)){
    fs.mkdirSync(gconfig.paths.dist.docs);
  }

  // -------------------------------------
  //   Publish
  // -------------------------------------
  gulp.task('publish', (done) => {
    runSequence('publish:clean', 'publish:post', done);
  });

  // -------------------------------------
  //   Sub Tasks
  // -------------------------------------

  gulp.task('publish:post', ['publish:zip'], (done) => {
    const formData = require('form-data');

    let form = new formData();
    form.append('file', fs.createReadStream(`${gconfig.paths.dist.root}.zip`));
    form.append('root_path', `${packageJson.name}/${packageJson.version}`);

    form.submit(gconfig.urls.staging, (err, res) => {
      if (err) {
        gutil.log(err);
      } else {
        if (res.statusCode == 200) {
          gutil.log(`Status ${res.statusCode}: published to '${gconfig.urls.staging}'`);
        } else {
          gutil.log(`Status ${res.statusCode}`);
        }
        res.resume();
      }
      done(err);
    });
  });

  // Clean Publish files
  gulp.task('publish:clean', () => {
    const del = require('del');

    return del([
      `${gconfig.paths.dist.root}`,
      `${gconfig.project.zipName}.zip`,
    ]);
  });

  // Copy assets to dist folder to be zipped
  gulp.task('publish:copy:assets', () => {
    return gulp.src(`${gconfig.paths.site.www}/assets/**/*`)
      .pipe(gulp.dest(`${gconfig.paths.dist.assets}`))
  });

  // Get all raw css files and publish them as assets
  // for the documents to reference
  gulp.task('publish:copy:css', ['src:css:compile'], () => {
    return gulp.src(`${gconfig.paths.src.packages}/*/dist/*.min.css`)
      .pipe(flatten())
      .pipe(gulp.dest(`${gconfig.paths.dist.assets}/css`))
  });

  // Convert MD files to JSON
  gulp.task('publish:md:json', () => {
    const frontMatter = require('gulp-front-matter');
    const markdown = require('gulp-markdown');
    const mdToJson = require('gulp-markdown-to-json');
    const tap = require('gulp-tap');

     // Use the same engine gulp-markdown uses in src:md:compile
     // to keep ouput the same
    const marked = require('marked');
    marked.setOptions(gconfig.options.marked);

    return gulp.src(`${gconfig.paths.src.root}/**/*.md`)

      // Extract/remove yaml from markdown
      .pipe(frontMatter({ property: 'data.frontMatter' }))

      // Parse and highlight
      .pipe(markdown(gconfig.options.marked))

      // Convert to JSON
      .pipe(mdToJson(marked))

      // Rename filename of package/*/readme.md files
      // to folder (package) name
      .pipe(rename(file => {
        let lowerCaseName = file.basename.toLocaleLowerCase();
        if (lowerCaseName === 'readme') {
          file.basename = helperFns.createFileNameFromFolder(file.dirname);
        } else {
          file.basename = lowerCaseName;
        }
      }))

      // Merge json data and write to json file
      .pipe(tap((file) => {
        const fileName = path.parse(file.path).name;
        const tmpObj = JSON.parse(file.contents.toString());
        const mergedObj = { ...file.data.frontMatter, ...tmpObj };

        file.contents = new Buffer(JSON.stringify(mergedObj, "utf-8"));
      }))
      .pipe(flatten())
      .pipe(gulp.dest(gconfig.paths.dist.docs));
  });

  // Convert YAML files to JSON
  gulp.task('publish:yaml:json', () => {
    const yaml = require('gulp-yaml');

    return gulp.src(`${gconfig.paths.src.root}/*.yaml`)
      .pipe(yaml({ schema: 'DEFAULT_SAFE_SCHEMA' }))
      .pipe(gulp.dest(gconfig.paths.dist.root));
  });

  // Zip the built files
  gulp.task('publish:zip', [`publish:copy:css`, 'publish:copy:assets', 'publish:md:json', 'publish:yaml:json'], () => {
    const zip = require('gulp-zip');

    return gulp.src(`${gconfig.paths.dist.root}/**/*`)
      .pipe(zip(`${gconfig.paths.dist.root}.zip`))
      .pipe(gulp.dest(gconfig.paths.root));
  });
}
