import database from '../../database'

export function findByUsername(username) {
  return database.raw(`SELECT * FROM users WHERE username='${username}' LIMIT 1;`)
}

export function findById(id) {
  return database.raw(`SELECT * FROM users WHERE id='${id}'`)
}

export function create(username, password) {
  return database.raw(`
    INSERT INTO users(username, password)
    VALUES ('${username}', '${password}') RETURNING *;
  `)
}
