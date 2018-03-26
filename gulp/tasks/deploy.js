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
  const argv = require('yargs').argv

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

  // Post data to docs site
  gulp.task('deploy:post', ['deploy:zip'], (done) => {
    let url = gconfig.urls.local;
    if (argv.site && Object.keys(gocnfig.urls.local).includes(argv.site)) {
      url = gconfig.urls[argv.site];
    }

    const formData = require('form-data');

    let form = new formData();
    form.append('file', fs.createReadStream(`${gconfig.paths.dist.root}.zip`));
    form.append('root_path', `${packageJson.name}/${packageJson.version}`);
    form.append('post_auth_key', process.env.DOCS_API_KEY ? process.env.DOCS_API_KEY : "");

    gutil.log(`Attempting to publish to '${url}'`);

    form.submit(url, (err, res) => {
      if (err) {
        gutil.log(err);
      } else {
        if (res.statusCode == 200) {
          gutil.log(`Success! Status ${res.statusCode}: published to '${url}'`);
        } else {
          gutil.log(`Failed! Status ${res.statusCode}`);
        }
        res.resume();
      }
      done(err);
    });
  });

  // Clean Publish files
  gulp.task('deploy:clean', () => {
    const del = require('del');

    return del([
      `${gconfig.paths.dist.root}`,
      `${gconfig.project.zipName}.zip`,
    ]);
  });

  // Copy assets to dist folder to be zipped
  gulp.task('deploy:copy:assets', () => {
    return gulp.src(`${gconfig.paths.site.www}/assets/**/*`)
      .pipe(gulp.dest(`${gconfig.paths.dist.assets}`))
  });

  // Get all raw css files and publish them as assets
  // for the documents to reference
  gulp.task('deploy:copy:css', ['src:css:compile'], () => {
    return gulp.src(`${gconfig.paths.src.packages}/*/dist/*.min.css`)
      .pipe(flatten())
      .pipe(gulp.dest(`${gconfig.paths.dist.assets}/dist`))
  });

  // Convert MD files to JSON
  gulp.task('deploy:md:json', () => {
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
        file.basename = file.basename.toLowerCase();
        if (file.basename === 'readme') {
          file.basename = helperFns.createFileNameFromFolder(file.dirname);
        }
        file.extname = ".json";
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
  gulp.task('deploy:yaml:json', () => {
    const yaml = require('gulp-yaml');

    return gulp.src(`${gconfig.paths.src.root}/*.yaml`)
      .pipe(yaml({ schema: 'DEFAULT_SAFE_SCHEMA' }))
      .pipe(gulp.dest(gconfig.paths.dist.root));
  });

  // Zip the built files
  gulp.task('deploy:zip', [`deploy:copy:css`, 'deploy:copy:assets', 'deploy:md:json', 'deploy:yaml:json'], () => {
    const zip = require('gulp-zip');

    return gulp.src(`${gconfig.paths.dist.root}/**/*`)
      .pipe(zip(`${gconfig.paths.dist.root}.zip`))
      .pipe(gulp.dest(gconfig.paths.root));
  });
}
