import database from '../../database'

export const voteValues = {
  up: 'UP',
  down: 'DOWN',
}

export function findById(id) {
  return database('cards').select().raw(`SELECT * FROM cards WHERE id=${id} LIMIT 1;`)
}

export function getAllCards() {
  return database.raw(`SELECT * FROM cards;`)
  .then(result => result.rows)
}

//export function getAllCards() {
//  return database('cards').select()
//}

/* eslint-disable */
export function create(card) {
  const { languageId, colorId, cardText, pick, userId } = card
  return database.raw(`
    INSERT INTO cards(language_id, color_id, card_text, pick, user_id)
    VALUES (${languageId}, ${colorId}, '${cardText}', ${pick}, ${userId}) RETURNING *;
  `)
}

export function getRandomCard() {
  return database.raw(`SELECT * FROM cards ORDER BY RANDOM() LIMIT 1;`)
}

export function connectCardToTag(cardId, tagId) {
  return database.raw(`
    INSERT INTO card_tags(card_id, tag_id)
    VALUES (${cardId}, ${tagId}) RETURNING *;
  `)
}

export function vote(cardId, userId, voteValue) {
  return database.raw(`
    INSERT INTO card_votes(card_id, user_id, vote)
    VALUES (${cardId}, ${userId}, ${voteValue}) RETURNING *;
  `)
}
