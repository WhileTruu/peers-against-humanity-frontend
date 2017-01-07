import gulp from 'gulp'
import babel from 'gulp-babel'
import eslint from 'gulp-eslint'
import sourcemaps from 'gulp-sourcemaps'
import { migrations } from './scripts/migrations'

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

gulp.task('migrations:down:all', () => migrations.down.all()
  .then(() => process.nextTick(() => process.exit(0)))
  .catch(err => {
    console.log(err)
    process.nextTick(() => process.exit(1))
  })
)
gulp.task('migrations:up:all', () => migrations.up.all()
  .then(() => process.nextTick(() => process.exit(0)))
  .catch(err => {
    console.log(err)
    process.nextTick(() => process.exit(1))
  })
)
gulp.task('migrations:data:init', () => migrations.data.init()
  .then(() => process.nextTick(() => process.exit(0)))
  .catch(err => {
    console.log(err)
    process.nextTick(() => process.exit(1))
  })
)

gulp.task('watch', ['lint', 'build'], () => gulp
  .watch([paths.sourceFiles, paths.copyFiles], ['lint', 'build']))

gulp.task('default', ['watch'])
