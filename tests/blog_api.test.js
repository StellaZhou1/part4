const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')

const Blog = require('../models/blog')


beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('GET request to /api/blogs returns correct number of records', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
}, 100000)

test('the unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach((blog)=>{
    expect(blog.id).toBeDefined()
  })
});

test('POST request to /api/blogs creates a record that matches the input', async () => {
  const newBlog =   {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  }
  await api.post('/api/blogs')
  .send(newBlog)
  .expect(201)
  .expect('Content-Type', /application\/json/)
  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length+1)
  expect(blogsAtEnd[blogsAtEnd.length-1]).toEqual({
    id:newBlog._id,
    title:newBlog.title,
    author:newBlog.author,
    url:newBlog.url,
    likes:newBlog.likes
  })
}, 100000)

test('if the likes property is missing from the request, it will default to the value 0', async () => {
  const newBlog =   {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    __v: 0
  }
  
  await api.post('/api/blogs')
  .send(newBlog)
  .expect(201)
  .expect('Content-Type', /application\/json/)
  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd[blogsAtEnd.length-1].likes).toEqual(0)
}, 100000)

test('if the title and url properties are missing in post request to /api/blogs, the response status code is 400', async () => {
  const newBlog =   {
    _id: "5a422ba71b54a676234d17fb",
    author: "Robert C. Martin",
    __v: 0
  }
  await api.post('/api/blogs')
  .send(newBlog)
  .expect(400)
}, 100000)

test('delete request to /api/blogs:id deletes a record', async () => {
  await api.delete('/api/blogs/5a422a851b54a676234d17f7')
  .expect(204)
  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd.length).toEqual(helper.initialBlogs.length-1)
}, 100000)

test('put request to /api/blogs:id with {likes:Number} changes the value of likes property of record with id', async () => {
  const newBlog = {
    likes: 2
  }
  const updatedBlog = await api.put('/api/blogs/5a422a851b54a676234d17f7')
  .send(newBlog)
  expect(updatedBlog.body.likes).toEqual(2)
}, 100000)

afterAll(() => {
  mongoose.connection.close()
})