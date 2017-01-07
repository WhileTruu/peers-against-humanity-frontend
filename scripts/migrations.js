process.env.NODE_ENV = 'development';

import { runMigrationsInFolder, undoAllMigrations } from '../src/backend/database'

export const migrations = {
  up: {
    all: () => runMigrationsInFolder('up'),
  },
  down: {
    all: () => undoAllMigrations(),
  },
  data: {
    init: () => runMigrationsInFolder('initialdata'),
  },
}
