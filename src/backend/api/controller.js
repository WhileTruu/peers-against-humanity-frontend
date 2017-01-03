import { Router } from 'express'
import { controller as usersController } from './users'
import { controller as tagsController } from './tags'
import { controller as cardsController } from './cards'

const router = new Router()

router.use('/users', usersController)
router.use('/tags', tagsController)
router.use('/cards', cardsController)

export default router
