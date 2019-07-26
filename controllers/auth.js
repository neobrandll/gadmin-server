const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {
  const password = req.body.password;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    if (!err.statusCode) {
      err.statuscode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const user = req.body.user;
  const password = req.body.password;

  try {
  } catch (err) {}
};
