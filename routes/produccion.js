const express = require('express');
const { body, param, query } = require('express-validator');

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

router.delete(
  '/:idEmpresa/:idProduccion',
  isAuth,
  [
    param('idEmpresa')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la empresa')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(empresaValidators.empresaExist),
    param('idProduccion')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la produccion')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(produccionValidators.exist)
  ],
  produccionControllers.delete
);

router.get(
  '/pesaje/:idEmpresa',
  isAuth,
  [
    param('idEmpresa')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la empresa')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(empresaValidators.empresaExist),
    query('idTipoProduccion')
      .optional()
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id del tipo de produccion')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .isIn(['4', '5'])
      .withMessage('El id del tipo de produccion es incorrecto'),
    query('dateFrom')
      .optional()
      .custom(sharedValidators.dateValidator),
    query('dateTo')
      .optional()
      .custom(sharedValidators.dateValidator),
    query('coGanado')
      .optional()
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el codigo del ganado')
      .isInt()
      .withMessage('El codigo debe de ser un numero entero')
      .custom(ganadoValidators.coGanadoExist)
  ],
  produccionControllers.getPesaje
);

router.get(
  '/pesajeCount/:idEmpresa',
  isAuth,
  [
    param('idEmpresa')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la empresa')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(empresaValidators.empresaExist),
    query('idTipoProduccion')
      .optional()
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id del tipo de produccion')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .isIn(['4', '5'])
      .withMessage('El id del tipo de produccion es incorrecto'),
    query('dateFrom')
      .optional()
      .custom(sharedValidators.dateValidator),
    query('dateTo')
      .optional()
      .custom(sharedValidators.dateValidator),
    query('coGanado')
      .optional()
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el codigo del ganado')
      .isInt()
      .withMessage('El codigo debe de ser un numero entero')
      .custom(ganadoValidators.coGanadoExist)
  ],
  produccionControllers.getPesajeCount
);

router.get(
  '/count/:idEmpresa/:producto',
  isAuth,
  [
    param('idEmpresa')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la empresa')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(empresaValidators.empresaExist),
    query('idTipoProduccion')
      .optional()
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id del tipo de produccion')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .isIn(['1', '2', '3'])
      .withMessage('El id del tipo de produccion es incorrecto'),
    query('dateFrom')
      .optional()
      .custom(sharedValidators.dateValidator),
    query('dateTo')
      .optional()
      .custom(sharedValidators.dateValidator),
    param('producto')
      .trim()
      .not()
      .isEmpty()
      .withMessage('el campo producto no puede estar vacio')
      .isIn(['leche', 'queso'])
      .withMessage('valor invalido')
  ],
  produccionControllers.getProduccionTotal
);

router.get(
  '/:idEmpresa/:producto',
  isAuth,
  [
    param('idEmpresa')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la empresa')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(empresaValidators.empresaExist),
    query('idTipoProduccion')
      .optional()
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id del tipo de produccion')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .isIn(['1', '2', '3'])
      .withMessage('El id del tipo de produccion es incorrecto'),
    query('dateFrom')
      .optional()
      .custom(sharedValidators.dateValidator),
    query('dateTo')
      .optional()
      .custom(sharedValidators.dateValidator),
    param('producto')
      .trim()
      .not()
      .isEmpty()
      .withMessage('el campo producto no puede estar vacio')
      .isIn(['leche', 'queso'])
      .withMessage('valor invalido')
  ],
  produccionControllers.getProduccion
);
module.exports = router;
