const express = require('express');
const { body } = require('express-validator/check');

const isAuth = require('../middlewares/is-auth');

const router = express.Router();

module.exports = router;
