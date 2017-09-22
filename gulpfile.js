// *************************************
//
//   Gulpfile
//
// *************************************
//
// Available tasks:
//   'gulp default'
//   'gulp build'
//      'gulp build:site'
//        'gulp build:site:css'
//        'gulp build:site:html'
//        'gulp build:site:json'
//        'gulp build:site:packages'
//      'gulp build:demo'
//   'gulp clean'
//     'gulp clean:site:json'
//   'gulp stylelint'
//      'gulp stylelint:packages'
//      'gulp stylelint:site'
//   `gulp pre-commit'
//   'gulp serve:site'
//   'gulp svg:optimize'
//   'gulp svg:store'
//   `gulp test`
//   'gulp watch-md'
//   'gulp watch-site'
//   'gulp watch-packages'
//
// *************************************

// -------------------------------------
// Load gulp & config
// gulp: The streaming build system
// -------------------------------------
const gulp   = require('gulp'),
  gConfig    = require('./gulp-config.js'),
  basePath   = gConfig.paths.base.root;
  sourcePath = gConfig.paths.sources,
  destPath   = gConfig.paths.destinations;

// -------------------------------------
// Load "gulp-" plugins
// -------------------------------------
// gulp-accessibility: Access Standards
// gulp-concat       : Concatenate files
// gulp-gitmodified  : List modified files
// gulp-hb           : Handlebars parser
// gulp-pandoc       : File converter
// gulp-postcss      : Transform styles with JS
// gulp-rename       : Rename files
// gulp-stylelint    : Lint the styles
// gulp-svgmin       : SVGO for gulp
// gulp-svgstore     : Combine svg files
// gulp-tap          : Easily tap into a pipeline (debug)
// gulp-util         : Utility functions
// -------------------------------------
const access  = require('gulp-accessibility');
  concat      = require('gulp-concat'),
  flatten     = require('gulp-flatten'),
  gitmodified = require('gulp-gitmodified'),
  hb          = require('gulp-hb'),
  pandoc      = require('gulp-pandoc'),
  postcss     = require('gulp-postcss'),
  rename      = require('gulp-rename'),
  stylelint   = require('gulp-stylelint'),
  svgmin      = require('gulp-svgmin'),
  svgstore    = require('gulp-svgstore'),
  tap         = require('gulp-tap'),
  gutil       = require('gulp-util');


// -------------------------------------
//   Utility NPM Plugins
// -------------------------------------
// annotateBlock  : Parse css for comment blocks
// browserSync    : Method of serving sites
// del            : Delete files
// fs             : Read/sync file stream
// glob           : File pattern matching
// is-color       : Validate hex colors
// -------------------------------------
const annotateBlock = require('css-annotation-block'),
  browserSync       = require('browser-sync').create('localDocServer'),
  del               = require('del'),
  fs                = require('fs'),
  glob              = require('glob'),
  isColor           = require('is-color');


// -------------------------------------
//   PostCSS Plugins
// -------------------------------------
// postcss-for       : Allow at-for loops
// postcss-variables : Allow at-vars in at-for loops
// postcss-import    : Include css files with '@'
// postcss-commas    : Allow lists of properties per value
// postcss-cssnext   : Collection of future proof plugins
// cssnano           : CSS minify
// lost              : Grid system
// -------------------------------------
const atFor    = require('postcss-for'),
  atImport     = require('postcss-import'),
  atVariables  = require('postcss-at-rules-variables'),
  commas       = require('postcss-commas'),
  cssnext      = require('postcss-cssnext'),
  cssnano      = require('cssnano'),
  lost         = require('lost');


// -------------------------------------
//   Global Variables
// -------------------------------------
let ICONS_ARR = [];
let SVG_HTML = fs.readFileSync(`${sourcePath.icons}/icons.svg`, 'utf-8');


// -------------------------------------
//   Task: Default
//   Does a build and serves the website
// -------------------------------------
gulp.task('default', ['clean', 'build', 'serve']);


// -------------------------------------
//   Task: Build
// -------------------------------------
gulp.task('build', ['svg:store', 'build:demo', 'build:site']);


// -------------------------------------
//   Task: Build:Site
// -------------------------------------
gulp.task('build:site', ['build:site:html', 'build:site:css', 'build:site:packages']);


// -------------------------------------
//   Task: Build Docs
//   Build html documentation files
// -------------------------------------
gulp.task('build:site:html', () => {
  const packageData = require('./package.json')
  let templateData = createCssAnnotations();

  if (ICONS_ARR.length === 0) {
    ICONS_ARR = parseIcons();;
  }
  templateData.svgIcons = ICONS_ARR;
  templateData.packageData = packageData;


  let hbStream = hb()
    .partials(`${sourcePath.templates}/partials/*.hbs`)
    .data(templateData);

  return gulp.src(`${sourcePath.packages}/**/README.md`)
    // Parse any handlebar templates in the markdown
    .pipe(hbStream)

    // Convert markdown to html and insert into layout template
    .pipe(pandoc({
      from: 'markdown-markdown_in_html_blocks', // http://pandoc.org/MANUAL.html#raw-html
      to: 'html5+yaml_metadata_block',
      ext: '.html',
      args: [
        `--data-dir=${sourcePath.site}`, // looks for template dir inside data-dir
        '--template=layout.html',
        '--table-of-contents',
        `--variable=icons:${SVG_HTML}`,
        `--variable=releaseversion:${packageData.version}`,
        '--variable=lang:en'
      ]
    }))
    .pipe(rename((path) => {
      // Rename filename of readme to folder name
      path.basename = path.dirname.replace('iux-', '');
    }))
    .pipe(flatten())
    .pipe(gulp.dest(destPath.site));
});


// -------------------------------------
//   Task: Build docs json
//   Build json documentation files
// -------------------------------------
gulp.task('build:site:json', () => {
    const markdownToJSON = require('gulp-markdown-to-json');
    const marked = require('marked');

    const packageData = require('./package.json')
    let templateData = createCssAnnotations();

    if (ICONS_ARR.length === 0) {
      ICONS_ARR = parseIcons();;
    }
    templateData.svgIcons = ICONS_ARR;
    templateData.packageData = packageData;


    let hbStream = hb()
      .partials(`${sourcePath.templates}/partials/*.hbs`)
      .data(templateData);

    marked.setOptions({
      pedantic: true,
      smartypants: true
    });

    gulp.src(`${sourcePath.packages}/**/README.md`)
      .pipe(rename((path) => {
        // Rename filename of readme to folder name
        path.basename = path.dirname.replace('iux-', '');
      }))
      .pipe(hbStream)
      .pipe(markdownToJSON(marked))
      .pipe(flatten())
      .pipe(gulp.dest(destPath.dist));
});


// -------------------------------------
//   Task: Build Site
//   Compile the website css
// -------------------------------------
gulp.task('build:site:css', () => {

  // Note: plugin order matters
  const plugins = [
    atImport,
    commas,
    atVariables,
    atFor,
    lost,
    cssnext,
    cssnano({ autoprefixer: false })
  ];

  return gulp.src(`${sourcePath.site}/css/site.css`)
    .pipe(postcss(plugins, { map: true }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(`${destPath.site}/dist`));
});


// -------------------------------------
//   Task: Build Site Packages
// -------------------------------------
gulp.task('build:site:packages', () => {

  // Note: plugin order matters
  const plugins = [
    atImport,
    commas,
    atVariables,
    atFor,
    lost,
    cssnext,
    cssnano({ autoprefixer: false })
  ];

  return gulp.src(`${sourcePath.packages}/iux-components-webapp/iux.css`)
    .pipe(postcss(plugins, { map: true }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(`${destPath.site}/dist`));
});


// -------------------------------------
//   Task: Build Demo
//   Build demo css
// -------------------------------------
gulp.task('build:demo', () => {
  // Note: plugin order matters
  const plugins = [
    atImport,
    commas,
    atVariables,
    atFor,
    lost,
    cssnext
  ];

  const postcssOptions = {
    map: true
  };

  return gulp.src(`${sourcePath.packages}/**/[^_]*.css`)
    .pipe(postcss(plugins, postcssOptions))
    // .pipe(postcss([
    //   require('cssnano')({ autoprefixer: false })
    // ], postcssOptions))
    .pipe(rename({ suffix: '-demo' }))
    .pipe(gulp.dest(`${destPath.demo}`));
});


// -------------------------------------
//   Task: Clean
//   Delete built files
// -------------------------------------
gulp.task('clean', ['clean:site:json'], () => {
  return del([
    `${destPath.site}/**`,
    `!${destPath.site}`,
    `${destPath.demo}/**/*-demo.css`,
    `log`
  ]);
});

// -------------------------------------
//   Task: Clean JSON files only
//   Delete dist json files
// -------------------------------------
gulp.task('clean:site:json', () => {
  return del([
    `${destPath.dist}`
  ]);
});


// -------------------------------------
//   Task: Lint
// -------------------------------------
gulp.task('stylelint', ['stylelint:packages', 'stylelint:site']);


// -------------------------------------
//   Task: Lint:packages:css
//   Lint the source css
// -------------------------------------
gulp.task('stylelint:packages', () => {
  return gulp.src(`${sourcePath.packages}/**/*.css`)
    .pipe(stylelint({
      failAfterError: true,
      reporters: [{
        formatter: 'verbose',
        console: true
      }]
    }))
});

// -------------------------------------
//   Task: Lint:site:css
//   Lint the website css
// -------------------------------------
gulp.task('stylelint:site', () => {
  return gulp.src(`${sourcePath.siteCss}/**/*.css`)
    .pipe(stylelint({
      failAfterError: true,
      reporters: [{
        formatter: 'verbose',
        console: true
      }]
    }))
});


// -------------------------------------
//   Task: Pre-commit
//   Run things before committing
// -------------------------------------
gulp.task('pre-commit', () => {

  // Lint only modified css files
  return gulp.src([`${sourcePath.packages}/**/*.css`, `${sourcePath.siteCss}/**/*.css`])
    .pipe(gitmodified(['modified']))
    .pipe(stylelint({
      failAfterError: true,
      reporters: [{
        formatter: 'verbose',
        console: true
      }]
    }));
});


// -------------------------------------
//   Task: Serve Demo
// -------------------------------------
gulp.task('serve:demo', () => {
  let demoServer = require('browser-sync').create('demoServer');

  demoServer.init({
    codesync: false,
    injectChanges: false,
    open: false,
    server: {
      baseDir: [destPath.demo]
    },
    logLevel: 'info',
    logPrefix: 'IUX Demo',
    ui: false
  });

  gulp
    .watch(`${sourcePath.packages}/**/*.css`, ['watch-packages'])
    .on('change', (evt) => {
      changeEvent(evt);
    });
});


// -------------------------------------
//   Task: Serve Demo & site
// -------------------------------------
gulp.task('serve', () => {
  browserSync.init({
    codesync: false,
    index: 'base.html',
    injectChanges: false,
    open: false,
    server: {
      baseDir: [destPath.site, destPath.demo]
    },
    logLevel: 'info',
    logPrefix: 'IUX',
    ui: false
  });


  const srcMarkdown = [
    `${sourcePath.templates}/**/*`,
    `${sourcePath.packages}/**/*.md`
  ];

  const siteCss = [
    `${sourcePath.siteCss}/**/*.css`
  ];

  const packagesCss = [
    `${sourcePath.packages}/**/*.css`
  ];

  gulp
    .watch(srcMarkdown, ['watch-md'])
    .on('change', (evt) => {
      changeEvent(evt);
    });

  gulp
    .watch(siteCss, ['watch-site'])
    .on('change', (evt) => {
      changeEvent(evt);
    });

  gulp
    .watch(packagesCss, ['watch-packages'])
    .on('change', (evt) => {
      changeEvent(evt);
    });
});


// -------------------------------------
//   Task: SVG Optimization
//   Optimizes the svg icon markup
// -------------------------------------
gulp.task('svg:optimize', () => {
  return gulp.src(`${sourcePath.icons}/svg/*.svg`)
    .pipe(svgmin())
    .pipe(gulp.dest(`${sourcePath.icons}/svg`));
});


// -------------------------------------
//   Task: SVG Store
//   Creates and builds the svg icons
// -------------------------------------
gulp.task('svg:store', () => {
  ICONS_ARR = parseIcons(); // Refresh icons list

  return gulp.src(`${sourcePath.icons}/svg/*.svg`)
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename('icons.svg'))
    .pipe(gulp.dest(sourcePath.icons))
    .pipe(gulp.dest(destPath.site));
});


// -------------------------------------
//   Task: Test
//   Test accessibility level WCAG2A
// -------------------------------------
gulp.task('test', ['build'], () => {

  del(['log/accessibility']);

  return gulp.src(`${destPath.site}/*.html`)
    .pipe(access({
      accessibilityLevel: 'WCAG2A',
      force: true,
      reportLevels: {
        notice: false,
        warning: false,
        error: true
      }
    }))
    .on('error', console.log)
    .pipe(access.report({ reportType: 'txt' }))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest('log/accessibility'));
});


// -------------------------------------
//   Task: watch-md
//   Guarantees reload is last task
// -------------------------------------
gulp.task('watch-md', ['build:site:html', 'build:site'], (done) => {
  browserSync.reload();
  done();
});


// -------------------------------------
//   Task: watch-site
//   Guarantees reload is last task
// -------------------------------------
gulp.task('watch-site', ['build:site'], (done) => {
  browserSync.reload();
  done();
});


// -------------------------------------
//   Task: watch-packages
//   Guarantees reload is last task
// -------------------------------------
gulp.task('watch-packages', ['build:demo', 'build:site:html', 'build:site'], (done) => {
  browserSync.reload();
  done();
});


// -------------------------------------
//   Function: changeEvent()
// -------------------------------------
function changeEvent(evt) {
  gutil.log('File', gutil.colors.cyan(evt.path.replace(new RegExp('/.*(?=/' + basePath + ')/'), '')), 'was', gutil.colors.magenta(evt.type));
}


// -------------------------------------
//   Function: cloneSimpleObj()
// -------------------------------------
function cloneSimpleObj(obj) {
  return JSON.parse(JSON.stringify(obj));
}


// -------------------------------------
//   Function: cssVarToCamelCaseStr()
// -------------------------------------
function cssVarToCamelCaseStr(str) {
  // parse "var(--var-name)" into "--var-name"
  str = str.replace('var(', '').replace(')', '')
  str = str.substr(str.indexOf('--') + 2);

  // parse "var-name" into "varName"
  return str.replace(/-([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
}

// -------------------------------------
//   Function: createCssAnnotations()
// -------------------------------------
function createCssAnnotations() {
  let content, blocks, cssVarAnnotations = {};

  // Parse the defaults first
  const defaultVarsObj = parseCss(`${sourcePath.packages}/iux-base/_variables.css`);

  const themes = [
    { name: 'themeDark',         path: `${sourcePath.packages}/iux-theme-dark/theme-dark.css` },
    { name: 'themeHighContrast', path: `${sourcePath.packages}/iux-theme-high-contrast/theme-high-contrast.css` }
  ];

  cssVarAnnotations = {
    default: cloneSimpleObj(defaultVarsObj)
  };

  // Build the theme objects
  themes.forEach(theme => {
    cssVarAnnotations[theme.name] = cloneSimpleObj(cssVarAnnotations['default']);
    parseCss(theme.path, cssVarAnnotations[theme.name]);
  });

  return cssVarAnnotations;
};


// -------------------------------------
//   Function: isCssVar()
// -------------------------------------
function isCssVar(str) {
  return str.substr(0, 3) === 'var';
}


// -------------------------------------
//   Function: parseCss()
// -------------------------------------
function parseCss(cssPath, themeAnnotationsObj = {}) {
  let content,
      blocks;

  content = fs.readFileSync(cssPath, 'utf-8').trim();
  blocks = annotateBlock(content);

  blocks.forEach(block => {
    block.nodes.forEach(node => {
      node.walkDecls(decl => {

        let propStr = cssVarToCamelCaseStr(decl.prop);

        themeAnnotationsObj[propStr] = {
          originalDeclaration: decl.prop,
          originalValue: decl.value,
          value: decl.value
        };

        if (block.name === 'colorPalette') {
          themeAnnotationsObj[propStr].isColor = true;
        }
      });
    });
  });

  // Replace all values that are variables with actual values
  let val,
    varNameToLookUp = '';

  for (let cssProp in themeAnnotationsObj) {
    val = themeAnnotationsObj[cssProp].value;
    if (isCssVar(val)) {

      varNameToLookUp = cssVarToCamelCaseStr(val);

      // Set the current prop value of the variable
      themeAnnotationsObj[cssProp].value = themeAnnotationsObj[varNameToLookUp].value;
    }
  }
  return themeAnnotationsObj;
};


// -------------------------------------
//   Function: parseIcons()
// -------------------------------------
function parseIcons() {
  const iconFiles = glob.sync('*.svg', { cwd: `${sourcePath.icons}/svg` })
  return iconSet = iconFiles.map(file => {
    return file.substring(0, file.lastIndexOf('.'));
  });
};


// -------------------------------------
// Task: Push
// rsync www to soho site in branchName dir
// -------------------------------------
gulp.task('push', ['build'], () => {
  let path = require('path');

  let getGitBranchName = require('git-branch-name');
  let dirPath = path.resolve(__dirname, '.');

  return getGitBranchName(dirPath, (err, branchName) => {
    let exec = require('child_process').exec;

    let src = `${dirPath}/site/www/`,
      dest = `~/Projects/mediawiki/data/static/foundation`;

//    if (branchName.substr(branchName.length - 2) === '.x') {
//      dest += `/${packageData.version}`;
//    } else {
//      dest += `/${branchName}`;
//    }

    return exec(`rsync -avz ${src} ${dest}`, function (err, stdout, stderr) {
      gutil.log(`Deployed to ${branchName}/index.html`);

      console.log(stdout);
      console.log(stderr);
    });
  });

});
