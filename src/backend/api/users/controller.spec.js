// jest.disableAutomock()

import express from 'express'
import request from 'supertest'
import { json } from 'body-parser'

import knex from '../../database'
import {
  MAX_USERNAME_LENGTH,
  MAX_PASSWORD_LENGTH,
} from '../config'

import { error } from '../util'

const { controller } = require('.')
const app = express()
app.use(json())
app.use(controller)

describe('users', () => {

  describe('GET /api/v1/users/:id', () => {
    beforeAll((done) => {
      knex.migrate.rollback()
        .then(() => {
          knex.migrate.latest()
            .then(() => {
              knex.seed.run().then(() => done())
            })
        })
    })

    afterAll((done) => {
      knex.migrate.rollback().then(() => done())
    })
    it('should receive object for requested user', () => {
      return request(app)
        .get('/1')
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTQ4NTkzODI5Mn0.kH3mPmxNoRZJxkkIvJZFENPUP8YHC1vo17zmBw1BwWM')
        .then((res) => {
          expect(res.status).toBe(200)
          expect(res.body.created_at).toBeDefined()
          expect(res.body.id).toBe(1)
          expect(res.body.password).toBe("$2a$10$q6Ktp1YjbjphHYXcmEzHkOzxSsd7gOQIHABcP76uqq33uSUOmmNO6")
        })
    })

    it('should send malformed token error when token is malformed', () => {
      return request(app)
        .get('/1')
        .set('Authorization', 'Bearer EyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTQ4NTkzODI5Mn0.kH3mPmxNoRZJxkkIvJZFENPUP8YHC1vo17zmBw1BwWM')
        .then((res) => {
          expect(res.status).toBe(403)
          expect(res.text).toBe(error.MALFORMED_TOKEN)
        })
    })

    it('should send missing auth header error when no auth header specified', () => {
      return request(app)
        .get('/1337')
        .then((res) => {
          expect(res.status).toBe(403)
          expect(res.text).toBe(error.MISSING_AUTH_HEADER)
        })
    })

    it('should deny access when requesting user info that does not belong to you', () => {
      return request(app)
        .get('/1337')
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTQ4NTkzODI5Mn0.kH3mPmxNoRZJxkkIvJZFENPUP8YHC1vo17zmBw1BwWM')
        .then((res) => {
          expect(res.status).toBe(403)
          expect(res.text).toBe(error.ACCESS_DENIED)
        })
    })

    it('should respond with status 500 when something is wrong with db', (done) => {
      knex.migrate.rollback()
        .then(() => {
          request(app)
            .get('/1')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTQ4NTkzODI5Mn0.kH3mPmxNoRZJxkkIvJZFENPUP8YHC1vo17zmBw1BwWM')
            .then((res) => {
              expect(res.status).toBe(500)
              expect(res.text).toEqual(error.SERVICE_UNAVAILABLE)
              done()
            })
        })
    })
  })

  describe('POST /api/v1/users/registration', () => {
    beforeAll((done) => {
      knex.migrate.rollback()
        .then(() => {
          knex.migrate.latest()
            .then(() => {
              knex.seed.run().then(() => done())
            })
        })
    })

    afterAll((done) => {
      knex.migrate.rollback().then(() => done())
    })

    it('should register and return new user data when info is correct', () => {
      return request(app)
        .post('/registration')
        .send(({ username: 'DatBoiiiiii', plainTextPassword: 'Owaddup' }))
        .then(res => {
          expect(res.status).toBe(201)
          expect(res.body.username).toBe('DatBoiiiiii')
          expect(res.body.token).toBeDefined()
        })
    })

    it('should return error when username missing', () => {
      return request(app)
        .post('/registration')
        .send(({ plainTextPassword: 'Owaddup' }))
        .then(res => {
          expect(res.status).toBe(400)
          expect(res.text).toBe(error.MISSING_USERNAME_OR_PASSWORD)
        })
    })

    it('should return error when password missing', () => {
      return request(app)
        .post('/registration')
        .send(({ username: 'Owaddup' }))
        .then(res => {
          expect(res.status).toBe(400)
          expect(res.text).toBe(error.MISSING_USERNAME_OR_PASSWORD)
        })
    })

    it('should return error when username too long', () => {
      return request(app)
        .post('/registration')
        .send(({
          username: new Array(MAX_USERNAME_LENGTH + 2).join('f'),
          plainTextPassword: `Owadduuuup`,
        }))
        .then(res => {
          expect(res.status).toBe(400)
          expect(res.text).toBe(error.INVALID_USERNAME)
        })
    })

    it('should return error when password too long', () => {
      return request(app)
        .post('/registration')
        .send(({
          username: 'DatBoiiiiii',
          plainTextPassword: new Array(MAX_PASSWORD_LENGTH + 2).join('u'),
        }))
        .then(res => {
          expect(res.status).toBe(400)
          expect(res.text).toBe(error.INVALID_PASSWORD)
        })
    })

    it('should return error when username too short', () => {
      return request(app)
        .post('/registration')
        .send(({
          username: 'Da',
          plainTextPassword: `Owadduuuup`,
        }))
        .then(res => {
          expect(res.status).toBe(400)
          expect(res.text).toBe(error.INVALID_USERNAME)
        })
    })

    it('should return error when password too short', () => {
      return request(app)
        .post('/registration')
        .send(({
          username: 'DatBoiiiiii',
          plainTextPassword: `Ow`,
        }))
        .then(res => {
          expect(res.status).toBe(400)
          expect(res.text).toBe(error.INVALID_PASSWORD)
        })
    })

    it('should respond with status 500 when something is wrong with db', (done) => {
      knex.migrate.rollback()
        .then(() => {
          request(app)
            .post('/registration')
            .send(({ username: 'DatBoiiiiii', plainTextPassword: 'Owaddup' }))
            .then((res) => {
              expect(res.status).toBe(500)
              expect(res.text).toEqual(error.SERVICE_UNAVAILABLE)
              done()
            })
        })
    })

    it('should return error when username contains weird characters', () => {
      return request(app)
        .post('/registration')
        .send(({
          username: '@@@%%%¤¤¤))(())',
          plainTextPassword: 'Password',
        }))
        .then(res => {
          expect(res.status).toBe(400)
          expect(res.text).toBe(error.INVALID_USERNAME)
        })
    })

    it('should return error when password contains weird characters', () => {
      return request(app)
        .post('/registration')
        .send(({
          username: 'TheLegend27',
          plainTextPassword: '@@@%%%¤¤¤))(())',
        }))
        .then(res => {
          expect(res.status).toBe(400)
          expect(res.text).toBe(error.INVALID_PASSWORD)
        })
    })
  })

  describe('POST /api/v1/users/authentication', () => {
    beforeAll((done) => {
      knex.migrate.rollback()
        .then(() => {
          knex.migrate.latest()
            .then(() => {
              knex.seed.run().then(() => done())
            })
        })
    })

    afterAll((done) => {
      knex.migrate.rollback().then(() => done())
    })

    it('should return user data when info is correct', () => {
      return request(app)
        .post('/authentication')
        .send(({ username: 'TheLegend27', plainTextPassword: 'password' }))
        .then(res => {
          expect(res.status).toBe(200)
          expect(res.body.token).toBeDefined()
        })
    })

    it('should return error when username missing', () => {
      return request(app)
        .post('/authentication')
        .send(({ plainTextPassword: 'password' }))
        .then(res => {
          expect(res.status).toBe(400)
          expect(res.text).toBe(error.MISSING_USERNAME_OR_PASSWORD)
        })
    })

    it('should return error when password missing', () => {
      return request(app)
        .post('/authentication')
        .send(({ username: 'TheLegend27' }))
        .then(res => {
          expect(res.status).toBe(400)
          expect(res.text).toBe(error.MISSING_USERNAME_OR_PASSWORD)
        })
    })

    it('should return error when username too long', () => {
      return request(app)
        .post('/authentication')
        .send(({
          username: new Array(MAX_USERNAME_LENGTH + 2).join('c'),
          plainTextPassword: 'password',
        }))
        .then(res => {
          expect(res.status).toBe(400)
          expect(res.text).toBe(error.INVALID_USERNAME)
        })
    })

    it('should return error when password too long', () => {
      return request(app)
        .post('/authentication')
        .send(({
          username: 'TheLegend27',
          plainTextPassword: new Array(MAX_PASSWORD_LENGTH + 2).join('k'),
        }))
        .then(res => {
          expect(res.status).toBe(400)
          expect(res.text).toBe(error.INVALID_PASSWORD)
        })
    })

    it('should return error when username too short', () => {
      return request(app)
        .post('/authentication')
        .send(({
          username: 'Th',
          plainTextPassword: 'Wololo',
        }))
        .then(res => {
          expect(res.status).toBe(400)
          expect(res.text).toBe(error.INVALID_USERNAME)
        })
    })

    it('should return error when password too short', () => {
      return request(app)
        .post('/authentication')
        .send(({
          username: 'TheLegend27',
          plainTextPassword: 'Pa',
        }))
        .then(res => {
          expect(res.status).toBe(400)
          expect(res.text).toBe(error.INVALID_PASSWORD)
        })
    })

    it('should respond with status 500 when something is wrong with db', (done) => {
      knex.migrate.rollback()
        .then(() => {
          request(app)
            .post('/authentication')
            .send(({ username: 'DatBoiiiiii', plainTextPassword: 'Owaddup' }))
            .then((res) => {
              expect(res.status).toBe(500)
              expect(res.text).toEqual(error.SERVICE_UNAVAILABLE)
              done()
            })
        })
    })

    it('should return error when username contains weird characters', () => {
      return request(app)
        .post('/authentication')
        .send(({
          username: '@@@%%%¤¤¤))(())',
          plainTextPassword: 'Password',
        }))
        .then(res => {
          expect(res.status).toBe(400)
          expect(res.text).toBe(error.INVALID_USERNAME)
        })
    })

    it('should return error when password contains weird characters', () => {
      return request(app)
        .post('/authentication')
        .send(({
          username: 'TheLegend27',
          plainTextPassword: '@@@%%%¤¤¤))(())',
        }))
        .then(res => {
          expect(res.status).toBe(400)
          expect(res.text).toBe(error.INVALID_PASSWORD)
        })
    })
  })
})
