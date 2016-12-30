import postgreSQLFactory, { QueryFile } from 'pg-promise'
import fs from 'fs'

import { CONNECTION_STRING } from '../config'

const libraryOptions = {}
const postgreSQL = postgreSQLFactory(libraryOptions)

const database = postgreSQL(CONNECTION_STRING)

export default database

export function undoMigrations() {
  return database.none(new QueryFile(`${__dirname}/migrations/down/down.sql`))
}

export function runMigrations() {
  fs.readdir(`${__dirname}/migrations/up`, (err, items) => {
    let p = Promise.resolve()

    items.forEach(item => {
      p = p
        .then(() => {
          return database.none(new QueryFile(`${__dirname}/migrations/up/${item}`))
        }, Promise.resolve())
        .catch((error) => console.log(error))
    })
  })
}
