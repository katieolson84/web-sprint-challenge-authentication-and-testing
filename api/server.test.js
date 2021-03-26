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
    it('responds with the correct message on invalid credentials', async () => {
      const res = await request(server).post('/api/auth/login')
      .send({ username: 'katie', password: '1234abcd' })
      expect(res.body.message).toMatch('invalid credentials')
    }, 500)
    it('can find a user by the id ', async () => {
      await db('users').insert({username: "katie", password: "1234"})
      const katie= await User.getById(1)
      expect(katie).toMatchObject({ id: 1, username: "katie"})
    })
  })
})