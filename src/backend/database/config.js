import { join } from 'path'

module.exports = {
  database: {
    client: 'sqlite3',
    connection: {
      filename: join(__dirname, 'db.sqlite3'),
    },
    useNullAsDefault: true,
  },
  migration: {
    directory: join(__dirname, 'migrations'),
  },
}
