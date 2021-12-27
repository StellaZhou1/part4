const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const User = require('../models/user')
describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'zixinzhou',
      name: 'Zixin Zhou',
      password: '12345',
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  },100000)

  test('creation fails with an invalid username', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'z',
      name: 'Zixin Zhou',
      password: '12345',
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(500)
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  },100000)
})

afterAll(() => {
    mongoose.connection.close()
  })