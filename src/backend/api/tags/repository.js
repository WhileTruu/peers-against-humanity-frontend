import database from '../../database'

export function addTag(name) {
  return database('tags')
    .returning(['id', 'tagName'])
    .insert({ name })
    .then(([id]) => ({ id }))
}

export function getTags() {
  return database.select('*').from('tags')
}

export function findById(id) {
  return database('tags')
    .where('id', id)
    .first('*')
}

export function connectCardToTag(cardId, tagId) {
  return database.raw(```
      SELECT card.id, tag.id FROM cards, tags
        WHERE card.id = ${cardId} AND tag.id = tagId
    ```)
}
