import knex from '../database'

export const error = {
  ACCESS_DENIED: 'ACCESS_DENIED',
  MALFORMED_TOKEN: 'MALFORMED_TOKEN',
  MISSING_AUTH_HEADER: 'MISSING_AUTH_HEADER',
  PASSWORD_TOO_LONG: 'PASSWORD_TOO_LONG',
  PASSWORD_TOO_SHORT: 'PASSWORD_TOO_SHORT',
  USERNAME_TOO_LONG: 'USERNAME_TOO_LONG',
  USERNAME_TOO_SHORT: 'USERNAME_TOO_SHORT',
  PASSWORD_ILLEGAL_CHARACTERS: 'USERNAME_ILLEGAL_CHARACTERS',
  USERNAME_ILLEGAL_CHARACTERS: 'USERNAME_ILLEGAL_CHARACTERS',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
}

export function migrate() {
  return knex.migrate.rollback()
      .then(() => {
        knex.migrate.latest()
          .then(() => {
            knex.seed.run()
          })
      })
}

export function unmigrate() {
  return knex.migrate.rollback()
}
