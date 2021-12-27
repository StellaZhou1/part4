const User = require('../models/user')
const jwt = require('jsonwebtoken')
const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        request.token = authorization.substring(7)
    }
    else{
        request.token = null
    }
    next()
}

const userExtractor = async (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
      const token = authorization.substring(7)
      const decodedToken = jwt.verify(token, process.env.SECRET)
      const user = await User.findById(decodedToken.id)
      request.user = user
  }
  else{
      request.user = null
  }
  next()
}

  module.exports = {
    tokenExtractor,
    userExtractor
  }