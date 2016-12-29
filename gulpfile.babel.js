import gulp from 'gulp'
import babel from 'gulp-babel'
import eslint from 'gulp-eslint'
import sourcemaps from 'gulp-sourcemaps'

const paths = {
  buildDir: 'dist',
  sourceFiles: 'src/backend/**/*.js',
  copyFiles: 'src/backend/**/!(*.js)',
}

gulp.task('copy', () => gulp
  .src(paths.copyFiles)
  .pipe(gulp.dest(paths.buildDir)))

gulp.task('build', ['copy'], () => gulp
  .src(paths.sourceFiles)
  .pipe(sourcemaps.init())
  .pipe(babel())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(paths.buildDir)))

gulp.task('lint', () => gulp
  .src(paths.sourceFiles)
  .pipe(eslint())
  .pipe(eslint.format()))

gulp.task('watch', ['lint', 'build'], () => gulp
  .watch([paths.sourceFiles, paths.copyFiles], ['lint', 'build']))

gulp.task('default', ['watch'])
