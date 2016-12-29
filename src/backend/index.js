import express from 'express'
import { json } from 'body-parser'

import controller from './api'
import { runMigrations } from './database'
import { PORT } from './config'

const app = express()

app.use(json())

app.use('/api/v1', controller)

runMigrations()
  .then(() => app.listen(PORT, () => console.log(`Server running at ${PORT}`)))
  .catch(error => console.log(error))
