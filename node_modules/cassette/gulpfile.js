const gulp = require('gulp');
const del = require('del');
const ts = require('gulp-typescript');
const project = ts.createProject('tsconfig.json');

gulp.task('default', () => {
  del.sync(['dist/**', '!dist']);
  del.sync(['typings/**', '!typings']);

  const result = project.src()
    .pipe(project());

  result.dts.pipe(gulp.dest('typings'));
  result.js.pipe(gulp.dest('dist'));
});
