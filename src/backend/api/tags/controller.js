import { Router } from 'express'

import { findById, getTags, addTag } from './repository'

const router = new Router()

router.get('/all', (request, response) => {
  getTags()
    .then(tags => response.status(200).json(tags))
    .catch(error => response.status(404).json(error))
})

router.get('/:id', (request, response) => {
  findById(request.params.id)
    .then(tag => response.status(200).json(tag))
    .catch(error => response.status(500).json(error))
})

router.post('/createNewTag', (request, response) => {
  const { tagName = '' } = request.body
  if (!tagName.trim()) {
    response.status(400).json({ message: 'Tag name missing.' })
  } else {
    addTag(tagName)
      .then((tagId) => {
        console.log(tagId)
        if (!tagId) {
          response.status(403).json({ message: 'Invalid username or password.' })
        } else {
          response.status(200).json({ created: true })
        }
      })
      .catch(error => response.status(500).json(error))
  }
})


export default router
