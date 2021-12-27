const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')


blogsRouter.get('/api/blogs', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)  
})

blogsRouter.post('/api/blogs', async (request, response) => {
  if(!request.body.title && !request.body.url){
    response.status(400).end()
  }
  else{
    const user = request.user
    if (!user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const body = request.body
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes:body.likes,
      user: user._id
    })
    const result = await blog.save()
    user.blogs = user.blogs.concat(result._id)
    await user.save()
    response.status(201).json(result)
  }

})

blogsRouter.delete('/api/blogs/:id', async (request, response) => {
    const user = request.user
    if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const blog = await Blog.findById(request.params.id)
  if ( blog.user.toString() === user._id.toString() ){
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }

})

blogsRouter.put('/api/blogs/:id', async (request, response,) => {
  const body = request.body
  const blog = {
    likes: body.likes
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter