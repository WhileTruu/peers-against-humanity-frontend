import { Router } from 'express'
import { hash, compare } from 'bcrypt'

import { findById, create, findByUsername } from './repository'
import { error as errorMessage } from '../util'
import logger from '../../logger'
import {
  createTokenForUser,
  verifyAuthorization,
  verifyUsername,
  verifyPassword,
} from '../authorizationService'

const router = new Router()

router.get('/:id', verifyAuthorization, (request, response) => {
  if (response.locals.userId !== parseInt(request.params.id, 10)) {
    response.status(403).send(errorMessage.ACCESS_DENIED)
  } else {
    findById(request.params.id)
      .then(user => response.status(200).json(user))
      .catch(error => {
        logger.error(`users/${request.params.id}: ${error}`)
        response.status(503).send(errorMessage.SERVICE_UNAVAILABLE)
      })
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
      .then(password => create(username, password))
      .then(({ id }) => {
        response.status(201).json({ username, id, token: createTokenForUser({ id }) })
      })
      .catch(error => {
        logger.error(`users/registration: ${error.detail}`)
        response.status(500).json({ message: error.detail })
      })
  }
})

router.post('/authentication', (request, response) => {
  const { username = '', plainTextPassword = '' } = request.body
  if (!username.trim() || !plainTextPassword) {
    response.status(400).json({ message: 'Username or password missing.' })
  } else {
    findByUsername(username)
      .then((authorization) => {
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
            .catch(error => response.status(500).json({ message: error.detail }))
        }
      })
      .catch(error => {
        logger.error(`users/authentication: ${error.detail}`)
        response.status(500).json({ message: error.detail })
      })
  }
})

export default router
