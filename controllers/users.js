const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/api/users', async (request, response) => {
  const body = request.body
  const saltRounds = 10
  if (!body.password||body.password.length<3){
    response.status(400).end()
  }
  else{
    const passwordHash = await bcrypt.hashSync(body.password, saltRounds)
    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash:passwordHash,
    })
    const savedUser = await user.save()
    response.json(savedUser)  
  }

})

usersRouter.get('/api/users', async (_request, response) => {
  const users = await User.find({}).populate('blogs', {url:1,title:1,author:1,id:1})
  response.json(users.map(u => u.toJSON()))
})

module.exports = usersRouter
