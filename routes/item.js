const express = require('express');
const { body, param, query } = require('express-validator');

const empresaValidators = require('./custom_validators/empresa');
const itemValidators = require('./custom_validators/item');
const itemControllers = require('../controllers/item');

const isAuth = require('../middlewares/is-auth');

const router = express.Router();

module.exports = router;
