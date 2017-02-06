import database from '../../database'

export function addTag(name) {
  return database.raw(`INSERT INTO tags(name) VALUES ('${name}') RETURNING *;`)
}

export function getTags() {
  return database.raw('SELECT * FROM tags;')
}

export function findById(id) {
  return database.raw(`SELECT * FROM tags WHERE id=${id} LIMIT 1;`)
}
