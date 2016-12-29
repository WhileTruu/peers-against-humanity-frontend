import { sign as signToken, verify as verifyToken } from 'jsonwebtoken'

import { SECRET } from '../../config'

export function createTokenForUser(user) {
  return signToken({ userId: user.id }, SECRET)
}

export function verifyAuthorization(request, response, next) {
  const authHeader = request.get('Authorization')
  if (!authHeader) {
    response.sendStatus(403)
  } else {
    const token = authHeader.replace('Bearer ', '')
    let decoded
    try {
      decoded = verifyToken(token, SECRET)
    } catch (e) {
      response.sendStatus(403)
    }
    if (decoded) {
      response.locals.userId = decoded.userId // eslint-disable-line no-param-reassign
      next()
    }
  }
}
