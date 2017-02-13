import { Router } from 'express'

import { findById, getTags, addTag } from './repository'
import logger from '../../logger'
import { error as errorMessage } from '../util'

const router = new Router()

router.get('/all', (request, response) => {
  getTags()
    .then(tags => response.status(200).json(tags))
    .catch(error => {
      logger.error(error.detail)
      response.status(404).json(error)
    })
})

router.get('/:id', (request, response) => {
  findById(request.params.id)
    .then(tag => response.status(200).json(tag))
    .catch(error => {
      logger.error(`tags/${request.params.id}: ${error}`)
      response.status(500).send(errorMessage.SERVICE_UNAVAILABLE)
    })
})

router.post('/createNewTag', (request, response) => {
  const { tagName = '' } = request.body
  if (!tagName.trim()) {
    response.status(400).json({ message: 'Tag name missing.' })
  } else {
    addTag(tagName)
      .then((tagId) => {
        response.status(200).json({ tagId, created: true })
      })
      .catch(error => {
        logger.error(error.detail)
        response.status(500).json(error)
      })
  }
})


export default router
