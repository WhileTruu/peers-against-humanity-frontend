const colors = {
  white: 1,
  black: 2,
}

const languages = {
  english: 1,
  estonian: 2,
}


export function validateCardData(cardData) {
  const { languageId, colorId, pick, cardText, tags } = cardData
  let error = ''
  error = validateText(cardText)
  error = validateColor(colorId)
  error = validatePick(colorId, pick)
  error = validateLanguage(languageId)
  error = validateTags(tags)
  return error
}

function validateText(text) {
  if (text.trim() === '') return 'You have not written anything on the card.'
  if (text.trim().length < 3) return 'The text you wrote is too short.'
  if (text.trim().length > 255) return 'The text you wrote is too long.'
  return ''
}

function validateColor(colorId) {
  return colorId === 1 || colorId === 2 ? '' : 'That is not even a color'
}

function validatePick(colorId, pick) {
  return (colorId === colors.black && 1 <= pick && pick <= 3) || pick === null ? '' : 'Such pick count is not possible.'
}

function validateLanguage(languageId) {
  const { english, estonian } = languages
  return (languageId === english || languageId === estonian) ? '' : 'That is not an allowed language.'
}

export function validateTags(tags) {
  if (tags && tags.length >= 4) return 'One card may not have over 4 tags.'
  return ''
}
