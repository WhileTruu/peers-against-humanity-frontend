const colors = {
  1: 'white',
  2: 'black',
}

export function validateTags(tags) {
  if (tags.length >= 4) return 'One card may not have over 4 tags.'
  return ''
}

export function validateText(text, defaultText) {
  if (text.trim() === defaultText.trim()) return 'Cannot let you submit default text'
  if (text.trim() === '') return 'You have not written anything on the card.'
  if (text.trim().length < 3) return 'The text you wrote is too short.'
  if (text.trim().length > 255) return 'The text you wrote is too long.'
  return ''
}

export function getOtherColorId(colorId) {
  if (colorId === 2) return 1
  return 2
}

export function getColorName(colorId) {
  return colors[colorId]
}
