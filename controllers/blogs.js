const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/api/blogs', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)  
})

blogsRouter.post('/api/blogs', async (request, response) => {
  if(!request.body.title && !request.body.url){
    response.status(400).end()
  }
  else{
    const blog = new Blog(request.body)
    const result = await blog.save()
    response.status(201).json(result)
  }

})

blogsRouter.delete('/api/blogs/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
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