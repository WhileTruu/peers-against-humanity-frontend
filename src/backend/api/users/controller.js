import { Router } from 'express'
import { hash, compare } from 'bcrypt'

import { findById, create, findByUsername } from './repository'
import { error as errorMessage, validateUsernameAndPassword } from '../util'
import logger from '../../logger'
import {
  createTokenForUser,
  verifyAuthorization,
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
        response.status(500).send(errorMessage.SERVICE_UNAVAILABLE)
      })
  }
})

router.post('/registration', validateUsernameAndPassword, (request, response) => {
  const { username = '', plainTextPassword = '' } = request.body
  hash(plainTextPassword, 10)
    .then(password => create(username, password)
      .then(({ id }) => {
        response.status(201).json({ username, id, token: createTokenForUser({ id }) })
      })
      .catch(error => {
        logger.error(`users/registration: ${error}`)
        response.status(500).send(errorMessage.SERVICE_UNAVAILABLE)
      }))
    .catch(error => {
      logger.error(`users/registration: ${error}`)
      response.status(500).send(errorMessage.SERVICE_UNAVAILABLE)
    })
})

router.post('/authentication', validateUsernameAndPassword, (request, response) => {
  const { username = '', plainTextPassword = '' } = request.body
  findByUsername(username)
    .then((authorization) => {
      if (!authorization) {
        response.status(400).send(errorMessage.INVALID_USERNAME)
      } else {
        compare(plainTextPassword, authorization.password)
          .then((valid) => {
            if (!valid) {
              response.status(400).send(errorMessage.INVALID_USERNAME_OR_PASSWORD)
            } else {
              const { id } = authorization
              response.status(200).json({ token: createTokenForUser({ id }) })
            }
          })
          .catch(error => {
            logger.error(`users/authentication: ${error}`)
            response.status(500).send(errorMessage.SERVICE_UNAVAILABLE)
          })
      }
    })
    .catch(error => {
      logger.error(`users/authentication: ${error}`)
      response.status(500).send(errorMessage.SERVICE_UNAVAILABLE)
    })
})

export default router
