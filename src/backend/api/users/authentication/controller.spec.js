import express from 'express'
import request from 'supertest'
import { json } from 'body-parser'

import knex from '../../../database'
import {
  MAX_USERNAME_LENGTH,
  MAX_PASSWORD_LENGTH,
} from '../../config'

import { error } from '../../util'

const { controller } = require('.')
const app = express()
app.use(json())
app.use(controller)

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
      .post('/')
      .send(({ username: 'TheLegend27', plainTextPassword: 'password' }))
      .then(res => {
        expect(res.status).toBe(200)
        expect(res.body.token).toBeDefined()
      })
  })

  it('should return error when username missing', () => {
    return request(app)
      .post('/')
      .send(({ plainTextPassword: 'password' }))
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.text).toBe(error.MISSING_USERNAME_OR_PASSWORD)
      })
  })

  it('should return error when password missing', () => {
    return request(app)
      .post('/')
      .send(({ username: 'TheLegend27' }))
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.text).toBe(error.MISSING_USERNAME_OR_PASSWORD)
      })
  })

  it('should return error when username too long', () => {
    return request(app)
      .post('/')
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
      .post('/')
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
      .post('/')
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
      .post('/')
      .send(({
        username: 'TheLegend27',
        plainTextPassword: 'Pa',
      }))
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.text).toBe(error.INVALID_PASSWORD)
      })
  })

  it('should respond with status 500 when something is wrong with db', () => {
    return knex.migrate.rollback()
      .then(() => {
        request(app)
          .post('/')
          .send(({ username: 'DatBoiiiiii', plainTextPassword: 'Owaddup' }))
          .then((res) => {
            expect(res.status).toBe(500)
            expect(res.text).toEqual(error.SERVICE_UNAVAILABLE)
          })
      })
  })

  it('should return error when username contains weird characters', () => {
    return request(app)
      .post('/')
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
      .post('/')
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
