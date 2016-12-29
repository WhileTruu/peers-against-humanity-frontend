import database from '../../database'

export function findByUsername(username) {
  return database('users')
    .where('username', username)
    .first('*')
}

export function findById(id) {
  return database('users')
    .where('id', id)
    .first('*')
}

export function create(authorization) { // eslint-disable-line
  return database('users')
    .returning(['id', 'username'])
    .insert(authorization)
    .then(([id]) => ({ id }))
}
