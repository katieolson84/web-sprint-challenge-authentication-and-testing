const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../secrets');
const User = require('../users/users-model');

const restricted = (req, res, next) => {
  const token = req.headers.authorization

  if(!token) {
    res.status(401).json({message: 'token required'})
  }else{
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if(err){
        res.status(401).json({message: 'token invalid'})
      }else{
        req.decodedJwt = decoded;
        next()
      }
    })
  }
};

const checkUsernameFree = async (req,res,next) => {
  const rows = await User.getBy({username: req.body.username})
  if(!rows.length) {
    next()
  }else{
    res.status(422).json({message: 'username taken'})
  }
}
//   try{
//     const rows = await User.getBy({username: req.body.username})
//     if(!rows.length) {
//       next()
//     }else{
//       res.status(422).json({message: 'username taken'})
//     }
//   }catch(e){
//     res.status(500).json(`Server error: ${e}`)
//   }
// }

const checkUserNameExists = (req, res, next) => {
  const { username } = req.body;
  const checkUser = User.getBy({ username }).first();
  if(checkUser.username === username) {
    res.status(401).json({message: 'username and password required'});
  }else{
    next();
  }
}

const checkPasswordExists = (req, res, next) => {
  const {password} = req.body;
  const checkPassword = User.getBy({ password }).first();
  if(checkPassword.password === password) {
    res.status(401).json({message: 'username and password required'})
  }else{
    next()
  }
}

module.exports = {
  restricted, 
  checkUsernameFree,
  checkUserNameExists,
  checkPasswordExists,
}
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */