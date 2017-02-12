import { sign as signToken, verify as verifyToken } from 'jsonwebtoken'

import { error } from './util'
import { SECRET } from '../config'

export function createTokenForUser(user) {
  return signToken({ userId: user.id }, SECRET)
}

export function verifyAuthorization(request, response, next) {
  const authHeader = request.get('Authorization')
  if (!authHeader) {
    response.status(403).send(error.MISSING_AUTH_HEADER)
  } else {
    const token = authHeader.replace('Bearer ', '')
    let decoded
    try {
      decoded = verifyToken(token, SECRET)
    } catch (e) {
      response.status(403).send(error.MALFORMED_TOKEN)
    }
    if (decoded) {
      response.locals.userId = decoded.userId // eslint-disable-line no-param-reassign
      next()
    }
  }
}

export function verifyUsername(username) {
  let error = null
  const usernameRegex = /^[a-zA-Z0-9]+$/
  if (username.length < 3) error = error.USERNAME_TOO_SHORT
  if (username.length > 25) error = error.USERNAME_TOO_LONG
  if (!username.match(usernameRegex)) {
    error = error.USERNAME_ILLEGAL_CHARACTERS
  }
  return error;
}

export function verifyPassword(password) {
  let error = null
  const passwordRegex = /^[a-zA-Z0-9]+$/
  if (password.length < 3) error = error.PASSWORD_TOO_SHORT
  if (password.length > 100) error = error.PASSWORD_TOO_LONG
  if (!password.match(passwordRegex)) {
    error = error.PASSWORD_ILLEGAL_CHARACTERS
  }
  return error
}
