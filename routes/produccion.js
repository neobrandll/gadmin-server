const express = require('express');
const { body, param } = require('express-validator');

const isAuth = require('../middlewares/is-auth');
const produccionControllers = require('../controllers/produccion');
const produccionValidators = require('./custom_validators/produccion');
const sharedValidators = require('./custom_validators/shared');
const empresaValidators = require('./custom_validators/empresa');
const ganadoValidators = require('./custom_validators/ganado');

const router = express.Router();

router.post(
  '/pesaje',
  isAuth,
  [
    body('idTipoProduccion')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id del tipo de produccion')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .isIn(['4', '5'])
      .withMessage('El id del tipo de produccion es incorrecto'),
    body('idEmpresa')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la empresa')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(empresaValidators.empresaExist),
    body('feProduccion')
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese la fecha de la produccion')
      .custom(sharedValidators.dateValidator)
      .custom(produccionValidators.pesajeDateAvailable),
    body('caProduccion')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese la cantidad de la produccion')
      .isFloat()
      .withMessage('La cantidad debe de ser un numero'),
    body('coGanado')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el codigo del ganado')
      .isInt()
      .withMessage('El codigo debe de ser un numero entero')
      .custom(ganadoValidators.coGanadoExist)
  ],
  produccionControllers.createPesaje
);

router.put(
  '/pesaje',
  isAuth,
  [
    body('idTipoProduccion')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id del tipo de produccion')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .isIn(['4', '5'])
      .withMessage('El id del tipo de produccion es incorrecto'),
    body('idEmpresa')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la empresa')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(empresaValidators.empresaExist),
    body('feProduccion')
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese la fecha de la produccion')
      .custom(sharedValidators.dateValidator)
      .custom(produccionValidators.pesajeDateAvailable),
    body('caProduccion')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese la cantidad de la produccion')
      .isFloat()
      .withMessage('La cantidad debe de ser un numero'),
    body('coGanado')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el codigo del ganado')
      .isInt()
      .withMessage('El codigo debe de ser un numero entero')
      .custom(ganadoValidators.coGanadoExist),
    body('idProduccion')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la produccion')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(produccionValidators.pesajeExist)
  ],
  produccionControllers.updatePesaje
);

router.post(
  '',
  isAuth,
  [
    body('idTipoProduccion')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id del tipo de produccion')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .isIn(['1', '2', '3'])
      .withMessage('El id del tipo de produccion es incorrecto'),
    body('idEmpresa')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la empresa')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(empresaValidators.empresaExist),
    body('feProduccion')
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese la fecha de la produccion')
      .custom(sharedValidators.dateValidator)
      .custom(produccionValidators.produccionDateAvailable),
    body('caProduccion')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese la cantidad de la produccion')
      .isFloat()
      .withMessage('La cantidad debe de ser un numero')
  ],
  produccionControllers.createProduccion
);

router.put(
  '',
  isAuth,
  [
    body('idTipoProduccion')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id del tipo de produccion')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .isIn(['1', '2', '3'])
      .withMessage('El id del tipo de produccion es incorrecto'),
    body('idEmpresa')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la empresa')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(empresaValidators.empresaExist),
    body('feProduccion')
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese la fecha de la produccion')
      .custom(sharedValidators.dateValidator)
      .custom(produccionValidators.produccionDateAvailable),
    body('caProduccion')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese la cantidad de la produccion')
      .isFloat()
      .withMessage('La cantidad debe de ser un numero'),
    body('idProduccion')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la produccion')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(produccionValidators.produccionExist)
  ],
  produccionControllers.updateProduccion
);

module.exports = router;
