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

export function connectCardToTag(cardId, tagId) {
  return database
    .one('INSERT INTO card_tags(card_id, tag_id) VALUES (${cardId}, ${tagId});', {cardId, tagId}) //eslint-disable-line
}
