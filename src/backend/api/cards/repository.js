import database from '../../database'


export function findById(id) {
  return database
    .oneOrNone('SELECT * FROM cards WHERE id=${id}', { id }) //eslint-disable-line
}

export function getAllCards() {
  return database
    .manyOrNone('SELECT * FROM cards;')
}

/* eslint-disable */
export function create(card) {
  return database
    .one('INSERT INTO cards(language_id, color_id, card_text, pick, user_id) VALUES (${languageId}, ${colorId}, ${cardText}, ${pick}, ${userId}) RETURNING *;', card)
}

export function getRandomCard() {
  return database
    .oneOrNone('SELECT * FROM cards \
      ORDER BY RANDOM() \
      LIMIT 1')
}
/* eslint-enable */

export function connectCardToTag(cardId, tagId) {
  return database
    .one('INSERT INTO card_tags(card_id, tag_id) VALUES (${cardId}, ${tagId}) RETURNING *;', {cardId, tagId}) //eslint-disable-line
}
