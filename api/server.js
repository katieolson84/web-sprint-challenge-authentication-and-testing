const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const {restricted} = require('./middleware/restricted');

const usersRouter = require('./users/users-router');
const authRouter = require('./auth/auth-router.js');
const jokesRouter = require('./jokes/jokes-router.js');

const server = express();

// session
const config = {
    name: 'peanutbutter',
    secret: 'keep it secret, keep it safe',
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false,
        httpOnly: false
    },
    resave: false,
    saveUninitialized: false,

    store: new KnexSessionStore({
        knex: require('../data/dbConfig'),
        tablename: 'sessions',
        sidfieldname: 'sid',
        createTable: true,
        clearInterval: 1000 * 60 * 60
    })
}

server.use(session(config));
server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/jokes', restricted, jokesRouter); // only logged-in users should have access!
server.use('/api/users', restricted, usersRouter);

server.get('/', (req,res)=> {
    res.status(200).json({api: 'up and running'})
})

// middleware for errors
server.use((err, req, res, next) => { // eslint-disable-line
    res.status(500).json({
      message: err.message,
      stack: err.stack,
    });
  });

module.exports = server;

