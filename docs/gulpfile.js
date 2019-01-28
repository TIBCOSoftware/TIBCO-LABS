//GULP 4.x
//Documenation Builder
const { series, src, dest, watch } = require('gulp');
//other used Plugins
var run = require('child_process').exec;
const zip = require('gulp-zip');

// *** just runs Main CLI Commands ***
// ***********************************

// get latest version from Repo.
function gitpull(cb) {
  run('git pull', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
};

// apply all latest changes to Repo.
function gitadd(cb) {
  run('git add -A', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
};

// comit all latest changes to Repo.
function gitcomit(cb) {
    run('git commit -m "apply latest changes"', function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
  };

// build and deploy to GH-Pages of the Repo.
function genMKdocs(cb) {
  // prod: 'mkdocs gh-deploy --config-file docs/mkdocs.yml --remote-branch gh-pages'
  // test: 'mkdocs build'
  run('mkdocs build', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
};

// create Backup Zip
function genZIP(cb) {
    var today = new Date();
    today = today.getFullYear().toString() + '-' + (today.getMonth() + 1).toString() + '-' + today.getDate().toString() + 
            '-' + today.getHours().toString() + '-' + today.getMinutes().toString();
    src('docs/**')
        .pipe(zip('docs-'+today+'.zip'))
        .pipe(dest('../backup'))
    cb();
};

exports.default = series(gitpull, gitadd, gitcomit, genMKdocs);
