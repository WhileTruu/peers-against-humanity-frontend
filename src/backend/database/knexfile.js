
module.exports = {
  test: {
    client: 'postgresql',
    connection: process.env.CONNECTION_STRING,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: 'src/backend/database/migrations'
    },
    seeds: {
      directory: 'src/backend/database/seeds'
    }
  },

  development: {
    client: 'postgresql',
    connection: process.env.CONNECTION_STRING,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
    }
  },

  staging: {
    client: 'postgresql',
    connection: process.env.CONNECTION_STRING,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: process.env.CONNECTION_STRING,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
