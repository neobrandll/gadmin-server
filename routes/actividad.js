const express = require('express');
const { body, param, query } = require('express-validator');

const isAuth = require('../middlewares/is-auth');
const actividadControllers = require('../controllers/actividad');
const actividadValidators = require('./custom_validators/actividad');
const empresaValidators = require('./custom_validators/empresa');
const ganadoValidators = require('./custom_validators/ganado');
const pajuelaValidators = require('./custom_validators/pajuela');

const router = express.Router();

module.exports = router;
