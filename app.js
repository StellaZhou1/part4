const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const cors = require('cors')
const app = express()
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')

logger.info('connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI)
.then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })
app.use(cors())
app.use(express.json())

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
app.use(middleware.userExtractor)
app.use(blogsRouter)
app.use(usersRouter)
app.use(loginRouter)

module.exports = app