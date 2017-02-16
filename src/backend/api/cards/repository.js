import database from '../../database'

export function findById(id) {
  return database('cards').select('*').where({ id }).first()
}

export function findCardByText(text) {
  return database('cards').where({ text }).first()
}

export function getAllCards() {
  return database('cards').select('*')
}

export function createNewCard(card) {
  const { languageId, colorId, text, pickCount, userId } = card
  return database('cards').returning('id').insert({
    language_id: languageId,
    color_id: colorId,
    text: text,
    pick_count: pickCount,
    user_id: userId,
  })
}

export function getRandomCard() {
  return database.raw(`SELECT * FROM cards ORDER BY RANDOM() LIMIT 1;`)
}

export function connectCardWithCategory(cardId, categoryId) {
  return database('card_category').insert({
    card_id: cardId,
    category_id: categoryId,
  })
}

export function upVote(cardId, userId) {
  return database('card_votes').returning('id').insert({
    card_id: cardId,
    user_id: userId,
    vote: 1,
  })
}

export function downVote(cardId, userId) {
  return database('card_votes').returning('id').insert({
    card_id: cardId,
    user_id: userId,
    vote: -1,
  })
}
