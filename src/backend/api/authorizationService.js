import { sign as signToken, verify as verifyToken } from 'jsonwebtoken'

import { SECRET } from '../config'
export function createTokenForUser(user) {
  return signToken({ userId: user.id }, SECRET)
}

export function verifyAuthorization(request, response, next) {
  const authHeader = request.get('Authorization')
  if (!authHeader) {
    response.status(403).json('Your request was made without an authorization header, kind sir.')
  } else {
    const token = authHeader.replace('Bearer ', '')
    let decoded
    try {
      decoded = verifyToken(token, SECRET)
    } catch (e) {
      response.status(403).json('The token sir sent to our humble selves is sligtly malformed.')
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
  if (username.length < 3) error = 'Username should be longer than 3 characters.'
  if (username.length > 25) error = 'Username should not be longer than 25 characters.'
  if (!username.match(usernameRegex)) {
    error =  'Username should consist of only upper and lowercase characters and numbers'
  }
  return error;
}

export function verifyPassword(password) {
  let error = null
  const passwordRegex = /^[a-zA-Z0-9]+$/
  if (password.length < 3) error = 'Password should be longer than 3 characters.'
  if (password.length > 100) error = 'Password should not be longer than 100 characters.'
  if (!password.match(passwordRegex)) {
    error =  'Username should consist of only upper and lowercase characters and numbers'
  }
  return error
}
