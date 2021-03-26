// Write your tests here
const server = require('./server');
const request = require('supertest');
const db = require('../data/dbConfig');
const bcrypt = require('bcryptjs');
const User = require('./users/users-model')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db('users').truncate()
})
afterAll(async () => {
  await db.destroy()
})

it('process.env.NODE_ENV must be "testing"', () => {
  expect(process.env.NODE_ENV).toBe('testing')
})


describe('users endpoints', () => {
  describe('[POST] /api/auth/register',() => {
    it('creates a new user in the db', async ()=> {
      await request(server).post('/api/auth/register')
      .send({username: 'katie', password: '1234abcd'})
      const katie = await db('users')
      .where('username', 'katie').first()
      expect(katie).toMatchObject({username: 'katie'})
    }), 500

    it('new user password is bcrypted', async () => {
      await request(server).post('/api/auth/register')
      .send({username: 'katie', password: '1234abcd'})
      const katie = await db('users')
      .where('username', 'katie').first()
      expect(bcrypt.compareSync('1234abcd', katie.password)).toBeTruthy()
    })
  })

  describe('[POST] /api/auth/login', () => {
    it('responds with the correct message when username or password are missing', async () => {
      const res = await request(server).post('/api/auth/login')
      .send({ username: 'katie'})
      expect(res.body.message).toMatch('username and password required')
    }, 500)
    it('can find a user by the id ', async () => {
      await db('users').insert({username: "katie", password: "1234"})
      const katie= await User.getById(1)
      expect(katie).toMatchObject({ id: 1, username: "katie"})
    })
  
  })
  describe('[GET] /api/users', () => {
    it('responds with the proper status code and message on not-logged-in user', async () => {
      const res = await request(server).get('/api/users')
      expect(res.status).toBe(401)
      expect(res.body.message).toMatch('token required')
    }, 500)
    it('shows error message of "invalid credentials" if not verified', async () => {
      await db('users').insert({username: "katie", password: "1234"})
      let res = await request(server).post('/api/auth/login')
      .send({ username: 'katie', password: '1234' })
      expect(res.body.message).toMatch('invalid credentials')
    })
  })
  describe('[GET] /api/jokes', () => {
    it('responds with the proper status code and message on not-logged-in user', async () => {
      const res = await request(server).get('/api/jokes')
      expect(res.status).toBe(401)
      expect(res.body.message).toMatch('token required')
    }, 500)
    it('shows error message of "invalid credentials" if not verified', async () => {
      await db('users').insert({username: "katie", password: "1234"})
      let res = await request(server).post('/api/auth/login')
      .send({ username: 'katie', password: '1234' })
      expect(res.body.message).toMatch('invalid credentials')
    })
  })

  
})