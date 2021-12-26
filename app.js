const config = require('./utils/config')
const express = require('express')
const cors = require('cors')
const app = express()
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const Blog = require('./models/blog')

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

app.use(blogsRouter)

module.exports = app