import Knex from 'knex'
import config from './config'

const knex = new Knex(config.database)

export function runMigrations() {
  return knex.migrate.latest(config.migration)
}

export default knex
