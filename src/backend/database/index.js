import Knex from 'knex'
import knexConfig from './knexfile'

const database = new Knex(knexConfig.production)

export default database
