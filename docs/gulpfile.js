//GULP 4.x
//Documenation Builder
const { series, src, dest, watch } = require('gulp');
//other used Plugins
var run = require('child_process').exec;
const zip = require('gulp-zip');

// *** just runs Main CLI Commands ***
// ***********************************

function gitpull(cb) {
  // prod: 'git pull'
  run('git pull', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
};

function gitpull(cb) {
  run('git pull', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
};

function genMKdocs(cb) {
  // prod: 'mkdocs gh-deploy --config-file docs/mkdocs.yml --remote-branch gh-pages'
  // test: 'mkdocs build'
  run('mkdocs build', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
};

function genZIP(cb) {
    var today = new Date();
    today = today.getFullYear().toString() + '-' + (today.getMonth() + 1).toString() + '-' + today.getDate().toString() + 
            '-' + today.getHours().toString() + '-' + today.getMinutes().toString();
    src('site/**')
        .pipe(zip('site-'+today+'.zip'))
        .pipe(dest('backup'))
    cb();
};

exports.default = series(gitpull, genMKdocs);
