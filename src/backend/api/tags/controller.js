import { Router } from 'express'

import { repository } from './'

const router = new Router()

router.get('/:id', (request, response) => {
  repository
    .findById(request.params.id)
    .then(tag => response.status(200).json(tag))
    .catch(error => response.status(500).json(error))
})

router.post('/createNewTag', (request, response) => {
  const { tagName = '' } = request.body
  if (!tagName.trim()) {
    response.status(400).json({ message: 'Tag name missing.' })
  } else {
    repository
    .addTag(tagName)
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

router.get('/all', (request, response) => {
  repository.getTags()
    .then(tags => response.status(200).json({ tags }))
    .catch(error => response.status(404).json(error))
})
