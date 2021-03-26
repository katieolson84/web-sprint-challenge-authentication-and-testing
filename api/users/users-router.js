const router = require('express').Router();
const users = require('./users-model');


router.get('/', (req,res,) => {
    res.status(200).json(users);
})

module.exports= router;
