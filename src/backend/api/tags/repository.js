import database from '../../database'

export function addTag(name) {
  return database
    .one('INSERT INTO tags(name) VALUES (${name}) RETURNING *;', { name }) //eslint-disable-line
}

export function getTags() {
  return database
    .many('SELECT * FROM tags;')
}

export function findById(id) {
  return database
    .oneOrNone('SELECT * FROM tags WHERE id=${id};', { id }) //eslint-disable-line
}
