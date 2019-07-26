const jwt = require('jsonwebtoken');

const { secret } = require('../config.js');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const e = new Error('Not authenticated.');
    e.statusCode = 401;
    throw e;
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, secret);
  } catch (e) {
    e.statusCode = 500;
    throw e;
  }
  if (!decodedToken) {
    const e = new Error('Not authenticated.');
    e.statusCode = 401;
    throw e;
  }
  req.userId = decodedToken.userId;
  next();
};
