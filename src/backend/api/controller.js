import { Router } from 'express'
import { controller as usersController } from './users'
import { controller as tagsController } from './tags'

const router = new Router()

router.use('/users', usersController)
router.use('/tags', tagsController)

export default router
