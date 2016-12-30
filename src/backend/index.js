import express from 'express'
import { json } from 'body-parser'

import controller from './api'
import { runMigrations, undoMigrations } from './database'
import { PORT } from './config'

const app = express()

app.use(json())

app.use('/api/v1', controller)

undoMigrations()
  .then(() => runMigrations('up')
    .then(() => runMigrations('initialdata'))
    .catch(err => console.log(err))
  )
app.listen(PORT, () => console.log(`Server running at ${PORT}`))
