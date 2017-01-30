import { Router } from 'express'

import { findById, getAllCards, create, getRandomCard, connectCardToTag, vote} from './repository'
import { validateCardData } from './util'
import { verifyAuthorization } from '../authorizationService'

import logger from '../../logger'

const router = new Router()

router.get('/all', (request, response) => {
  getAllCards()
    .then(cards => response.status(200).json(cards))
    .catch(error => {
      logger.error(error.detail)
      response.status(404).json(error)
    })
})

router.get('/random', (request, response) => {
  getRandomCard()
    .then(card => response.status(200).json(card))
    .catch(error => {
      logger.error(error.message)
      response.status(404).json(error.message)
    })
})

router.post('/new', verifyAuthorization, (request, response) => {
  const cardData = request.body
  const error = validateCardData(cardData)
  cardData.userId = response.locals.userId
  if (error.length) {
    response.status(400).json({ message: error })
  } else {
    create(cardData)
      .then(card => {
        Promise.all(cardData.tags ? cardData.tags.map(tag => connectCardToTag(card.id, tag.value)) : [])
          .then(() => response.status(201).json(card))
          .catch((error) => {
            logger.error(error.detail)
            response.status(500).json({ card, message: 'The card was added, but the tags were a bit messy.'})
          })
      })
      .catch(error => {
        logger.error(error.detail)
        response.status(500).json({ message: 'That card has already been made or something.' })
      })
  }
})

router.post('/:id/vote/up', verifyAuthorization, (request, response) => {
  const userId = request.locals.userId
  const cardId = request.params.id
  vote(cardId, userId, true)
    .then((result) => response.status(200).json(result))
    .catch((error) => {
      logger.error(error.detail)
      response.status(500).json({ message: 'Something went wrong with upvoting.' })
    })
})

router.post('/:id/vote/down', verifyAuthorization, (request, response) => {
  const userId = request.locals.userId
  const cardId = request.params.id
  vote(cardId, userId, false)
    .then((result) => response.status(200).json(result))
    .catch((error) => {
      logger.error(error.detail)
      response.status(500).json({ message: 'Something went wrong with downvoting.' })
    })
})

router.get('/:id', (request, response) => {
  findById(request.params.id)
    .then(card => response.status(200).json(card))
    .catch(error => {
      logger.error(error.detail)
      response.status(500).json(error)
    })
})

export default router
