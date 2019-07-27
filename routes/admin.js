const express = require('express');
const { body } = require('express-validator');

const isAuth = require('../middlewares/is-auth');

const router = express.Router();

module.exports = router;
