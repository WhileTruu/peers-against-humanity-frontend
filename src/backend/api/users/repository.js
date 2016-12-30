import database from '../../database'

export function findByUsername(username) {
  return database
    .oneOrNone('SELECT * FROM users WHERE username=${username} LIMIT 1;', { username }) //eslint-disable-line
}

export function findById(id) {
  return database
    .oneOrNone('SELECT * FROM users WHERE id=${id}', { id }) //eslint-disable-line
}

export function create(username, password) {
  return database
    .one('INSERT INTO users(username, password) VALUES (${username}, ${password}) RETURNING *;', { username, password }) //eslint-disable-line
}
