import { Router } from 'express'
import { hash, compare } from 'bcrypt'

import { repository } from './'
import {
  createTokenForUser,
  verifyAuthorization,
  verifyUsername,
  verifyPassword,
} from '../authorizationService'

const router = new Router()

router.get('/:id', verifyAuthorization, (request, response) => {
  if (response.locals.userId !== parseInt(request.params.id, 10)) {
    response.status(403).json({ message: 'You do not have access to that user.' })
  } else {
    repository
      .findById(request.params.id)
      .then(user => response.status(200).json(user))
      .catch(error => response.status(500).json(error))
  }
})

router.post('/registration', (request, response) => {
  const { username = '', plainTextPassword = '' } = request.body
  const usernameError = verifyUsername(username)
  const passwordError = verifyPassword(plainTextPassword)
  if (!username.trim() || !plainTextPassword) {
    response.status(400).json({ message: 'Password or username missing.' })
  } else if (usernameError) {
    response.status(401).json({ message: usernameError })
  } else if (passwordError) {
    response.status(401).json({ message: passwordError })
  } else {
    hash(plainTextPassword, 10)
      .then(password => repository.create(username, password))
      .then(({ id }) => {
        response.status(201).json({ username, id, token: createTokenForUser({ id }) })
      })
      .catch(error => response.status(500).json(error))
  }
})

router.post('/authentication', (request, response) => {
  const { username = '', plainTextPassword = '' } = request.body
  if (!username.trim() || !plainTextPassword) {
    response.status(400).json({ message: 'Username or password missing.' })
  } else {
    repository
    .findByUsername(username)
    .then((authorization) => {
      console.log(authorization)
      if (!authorization) {
        response.status(403).json({ message: 'Invalid username or password.' })
      } else {
        compare(plainTextPassword, authorization.password)
          .then((valid) => {
            if (!valid) {
              response.status(403).json({ message: 'Username or password not valid.' })
            } else {
              const { id } = authorization
              response.status(200).json({ valid: true, token: createTokenForUser({ id }) })
            }
          })
          .catch(error => response.status(500).json(error))
      }
    })
    .catch(error => response.status(500).json(error))
  }
})

export default router
