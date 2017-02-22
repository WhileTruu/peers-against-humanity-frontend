import { findCardByText } from './repository'
import { findCategoryByName } from '../categories/repository'
import { error } from '../util'
import logger from '../../logger'

const colors = { white: 1, black: 2 }
const languages = { english: 1, estonian: 2 }

export function validateCardData(request, response, next) {
  const { languageId, colorId, pickCount, text, category } = request.body
  if (
    validateText(text) &&
    validateColor(colorId) &&
    validateLanguage(languageId) &&
    validatePickCount(colorId, pickCount)
  ) {
    findCardByText(text)
      .then(card => {
        if (!card) {
          findCategoryByName(category)
            .then(category => {
              if (category) {
                response.locals.categoryId = category.id
                next()
              } else {
                logger.error(`cards/new: no such category exists (${category})`)
                response.status(400).send(error.BAD_REQUEST)
              }
            })
            .catch(error => {
              logger.error(`cards/new: ${error}`)
              response.status(400).send(error.BAD_REQUEST)
            })
        }
      })
      .catch(error => {
        logger.error(`cards/new: ${error}`)
        response.status(400).send(error.BAD_REQUEST)
      })
  } else {
    logger.error(`cards/new: invalid card data`)
    response.status(400).send(error.BAD_REQUEST)
  }
}

function validateText(text) {
  if (text.trim() === '') return false
  if (text.trim().length < 3) return false
  if (text.trim().length > 255) return false
  return true
}

function validateColor(colorId) {
  return colorId === 1 || colorId === 2
}

function validatePickCount(colorId, pickCount) {
  return !pickCount || (colorId === colors.black && 1 <= pickCount && pickCount <= 3)
}

function validateLanguage(languageId) {
  const { english, estonian } = languages
  return (languageId === english || languageId === estonian)
}
