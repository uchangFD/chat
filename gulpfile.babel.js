'use strict';

import gulp from 'gulp';
import babel from 'gulp-babel';
import concat from 'gulp-concat';

gulp.task('babel', () => {
  return gulp.src('./static/js/chat.js')
             .pipe(babel({ 
                presets: ['es2015'],
                plugins: ['transform-es2015-modules-commonjs']
              }))
             .pipe(concat('chat.build.js'))
             .pipe(gulp.dest('./static/js/'));
});
