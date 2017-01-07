import express from 'express'
import { json } from 'body-parser'

import logger, { loggingMiddleware } from './logger';
import path from 'path'
import controller from './api'
import { PORT } from './config'

const app = express()

app.use(json())
app.use(loggingMiddleware())
app.use('/api/v1', controller)

app.use('/', express.static(path.join(__dirname, '../build')));
app.use('/cards*', express.static(path.join(__dirname, '../build')));
app.use('/users*', express.static(path.join(__dirname, '../build')));

app.listen(PORT, () => logger.info(`Server running at ${PORT}`))
