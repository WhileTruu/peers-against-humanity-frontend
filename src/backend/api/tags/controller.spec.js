import express from 'express'
import request from 'supertest'
import { json } from 'body-parser'

import knex from '../../database'

import { error } from '../util'

const { controller } = require('.')
const app = express()
app.use(json())
app.use(controller)

describe('tags', () => {

  describe('GET /api/v1/tags/:id', () => {
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

    it('should receive object for requested tag', () => {
      return request(app)
        .get('/1')
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTQ4NTkzODI5Mn0.kH3mPmxNoRZJxkkIvJZFENPUP8YHC1vo17zmBw1BwWM')
        .then((res) => {
          expect(res.status).toBe(200)
          expect(res.body.created_at).toBeDefined()
          expect(res.body.id).toBe(1)
          expect(res.body.name).toBe("A Game of Thrones")
        })
    })

    it('should return 500 when db not ok', (done) => {
      knex.migrate.rollback()
        .then(() => {
          request(app)
            .get('/1')
            .set('Authorization', 'Bearer EyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTQ4NTkzODI5Mn0.kH3mPmxNoRZJxkkIvJZFENPUP8YHC1vo17zmBw1BwWM')
            .then((res) => {
              expect(res.status).toBe(500)
              expect(res.text).toBe(error.SERVICE_UNAVAILABLE)
              done()
            })
        })
    })

    //it('should send missing auth header error when no auth header specified', () => {
    //  return request(app)
    //    .get('/1337')
    //    .then((res) => {
    //      expect(res.status).toBe(403)
    //      expect(res.text).toBe(error.MISSING_AUTH_HEADER)
    //    })
    //})

    //it('should deny access when requesting user info that does not belong to you', () => {
    //  return request(app)
    //    .get('/1337')
    //    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTQ4NTkzODI5Mn0.kH3mPmxNoRZJxkkIvJZFENPUP8YHC1vo17zmBw1BwWM')
    //    .then((res) => {
    //      expect(res.status).toBe(403)
    //      expect(res.text).toBe(error.ACCESS_DENIED)
    //    })
    //})

    //it('should respond with status 500 when something is wrong with db', (done) => {
    //  knex.migrate.rollback()
    //    .then(() => {
    //      request(app)
    //        .get('/1')
    //        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTQ4NTkzODI5Mn0.kH3mPmxNoRZJxkkIvJZFENPUP8YHC1vo17zmBw1BwWM')
    //        .then((res) => {
    //          expect(res.status).toBe(500)
    //          expect(res.text).toEqual(error.SERVICE_UNAVAILABLE)
    //          done()
    //        })
    //    })
    //})
  })
})
