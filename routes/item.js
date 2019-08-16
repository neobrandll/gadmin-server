const express = require('express');
const { body, param, query } = require('express-validator');

const empresaValidators = require('./custom_validators/empresa');
const itemValidators = require('./custom_validators/item');
const itemControllers = require('../controllers/item');

const isAuth = require('../middlewares/is-auth');

const router = express.Router();

router.post(
  '',
  isAuth,
  [
    body('idEmpresa')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la empresa')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(empresaValidators.empresaExist),
    body('deItem')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese una descripcion para el item')
      .custom(itemValidators.deItemAvailable),
    body('caItem')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese la cantidad del item')
      .isInt()
      .withMessage('la cantidad debe de ser un numero entero'),
    body('idTipoItem')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id del tipo del item')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .isIn(['1', '2', '3', '4', '5'])
      .withMessage('El id del tipo de item es incorrecto')
  ],
  itemControllers.createItem
);

router.put(
  '',
  isAuth,
  [
    body('idEmpresa')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la empresa')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(empresaValidators.empresaExist),
    body('deItem')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese una descripcion para el item')
      .custom(itemValidators.deItemAvailable),
    body('caItem')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese la cantidad del item')
      .isInt()
      .withMessage('la cantidad debe de ser un numero entero'),
    body('idTipoItem')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id del tipo del item')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .isIn(['1', '2', '3', '4', '5'])
      .withMessage('El id del tipo de item es incorrecto'),
    body('idItem')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de el item a modificar')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(itemValidators.itemExist)
  ],
  itemControllers.updateItem
);

router.delete(
  '/:idEmpresa/:idItem',
  isAuth,
  [
    param('idItem')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de el item a modificar')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(itemValidators.itemExist),
    param('idEmpresa')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la empresa')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(empresaValidators.empresaExist)
  ],
  itemControllers.deleteItem
);

router.get(
  '/items/:idEmpresa',
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
    query('idTipoItem')
      .optional()
      .trim()
      .not()
      .isEmpty()
      .withMessage('El tipo del item no puede estar vacio')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .isIn(['1', '2', '3', '4', '5'])
      .withMessage('El id del tipo de item es incorrecto')
  ],
  itemControllers.getItems
);

module.exports = router;
