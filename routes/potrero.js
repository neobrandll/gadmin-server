const express = require('express');
const { body, param, query } = require('express-validator');

const empresaValidators = require('./custom_validators/empresa');
const potreroValidators = require('./custom_validators/potrero');
const potreroControllers = require('../controllers/potrero');
const isAuth = require('../middlewares/is-auth');

const router = express.Router();

router.post(
  '/createPasto',
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
    body('dePasto')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese una descripcion para el lote')
      .custom(potreroValidators.dePastoAvailable)
  ],
  potreroControllers.createPasto
);

router.put(
  '/pasto',
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
    body('dePasto')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese una descripcion para el tipo de pasto')
      .custom(potreroValidators.dePastoAvailable),
    body('idPasto')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de el pasto')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(potreroValidators.pastoExist)
  ],
  potreroControllers.updatePasto
);

router.get(
  '/pastos/:idEmpresa',
  isAuth,
  [
    param('idEmpresa')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la empresa')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(empresaValidators.empresaExist)
  ],
  potreroControllers.getPastos
);

router.post(
  '/createPotrero',
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
    body('idPasto')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de el pasto')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(potreroValidators.pastoExist),
    body('dePotrero')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese una descripcion para el potrero')
      .custom(potreroValidators.dePotreroAvailable)
  ],
  potreroControllers.createPotrero
);

router.put(
  '/potrero',
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
    body('idPasto')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de el pasto')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(potreroValidators.pastoExist),
    body('dePotrero')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese una descripcion para el potrero')
      .custom(potreroValidators.dePotreroAvailable),
    body('idPotrero')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de el potrero')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(potreroValidators.potreroExist)
  ],
  potreroControllers.updatePotrero
);

router.get(
  '/potreros/:idEmpresa',
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
    query('idPasto')
      .optional()
      .trim()
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(potreroValidators.pastoExist)
  ],
  potreroControllers.getPotreros
);

router.delete(
  '/:idEmpresa/:idPotrero',
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
    param('idPotrero')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de el potrero')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(potreroValidators.potreroExist)
  ],
  potreroControllers.deletePotrero
);
module.exports = router;
