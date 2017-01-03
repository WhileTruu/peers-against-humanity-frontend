import { Router } from 'express'

import { findById, getAllCards, create, getRandomCard, connectCardToTag } from './repository'
import { validateCardData } from './util'
import { verifyAuthorization } from '../authorizationService'


const router = new Router()

router.get('/all', (request, response) => {
  getAllCards()
    .then(cards => response.status(200).json(cards))
    .catch(error => response.status(404).json(error))
})

router.get('/random', (request, response) => {
  getRandomCard()
    .then(card => response.status(200).json(card))
    .catch(error => response.status(404).json(error))
})

router.get('/:id', (request, response) => {
  findById(request.params.id)
    .then(card => response.status(200).json(card))
    .catch(error => response.status(500).json(error))
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
      Promise.all(cardData.tags.map(tag => connectCardToTag(card.id, tag.value)))
        .then(() => response.status(201).json(card))
        .catch((err) => {
          response.status(500).json({ card, message: 'The card was added, but the tags were a bit messy.'})
        })
    })
    .catch(error => response.status(500).json({ message: 'That card has already been made or something.' }))
  }
})

export default router
