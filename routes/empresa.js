const express = require('express');
const { body, param } = require('express-validator');

const empresaControllers = require('../controllers/empresa');
const authValidators = require('./custom_validators/auth');
const empresaValidators = require('./custom_validators/empresa');
const isAuth = require('../middlewares/is-auth');

const router = express.Router();

router.get(
  '/getProfiles/:id_empresa',
  isAuth,
  [
    param('id_empresa', 'No se envio el id de la empresa.')
      .trim()
      .not()
      .isEmpty()
  ],
  empresaControllers.getProfiles
);

router.post(
  '/createEmpresa',
  isAuth,
  [
    body('pais')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese un pais'),
    body('estado')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese un estado'),
    body('ciudad')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese una ciudad'),
    body('calle')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese una calle'),
    body('nombreEmpresa')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el nombre de la empresa'),
    body('rifEmpresa')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el rif de la empresa')
      .isInt()
      .withMessage('El rif debe de ser un numero entero')
      .custom(empresaValidators.rifExist)
  ],
  empresaControllers.createEmpresa
);

router.put(
  '/updateAddress',
  isAuth,
  [
    body('pais')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese un pais'),
    body('estado')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese un estado'),
    body('ciudad')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese una ciudad'),
    body('calle')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese una calle'),
    body('empresaId')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la empresa')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
  ],
  empresaControllers.updateAddress
);

router.put(
  '/updateProfile',
  isAuth,
  [
    body('rifEmpresa')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el rif de la empresa')
      .isInt()
      .withMessage('El rif debe de ser un numero entero')
      .custom(empresaValidators.updateRif),
    body('nombreEmpresa')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el nombre de la empresa'),
    body('idEmpresa')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la empresa')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
  ],
  empresaControllers.updateProfile
);

router.get(
  '/:id_empresa',
  isAuth,
  [
    param('id_empresa')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la empresa')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
  ],
  empresaControllers.getEmpresa
);

module.exports = router;
