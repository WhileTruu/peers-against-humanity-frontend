import { Router } from 'express'
import { controller as usersController } from './users'

const router = new Router()
router.use('/users', usersController)

export default router
