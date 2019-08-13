const express = require('express');
const { body, param } = require('express-validator');

const ganadoValidators = require('./custom_validators/ganado');
const empresaValidators = require('./custom_validators/empresa');
const loteValidators = require('./custom_validators/lote');
const loteControllers = require('../controllers/lote');
const isAuth = require('../middlewares/is-auth');
const sharedValidator = require('./custom_validators/shared');

const router = express.Router();

router.post(
  '/createLote',
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
    body('deLote')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese una descripcion para el lote')
      .custom(loteValidators.deLoteAvailable)
  ],
  loteControllers.createLote
);

router.put(
  '/updateLote',
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
    body('deLote')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese una descripcion para el lote')
      .custom(loteValidators.deLoteAvailable),
    body('idLote')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de el lote')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(loteValidators.loteExist)
  ],
  loteControllers.updateLote
);

router.delete(
  '/delete/:idEmpresa/:idLote',
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
    param('idLote')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de el lote')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(loteValidators.loteExist)
  ],
  loteControllers.deleteLote
);

router.get(
  '/lotes/:idEmpresa',
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
  loteControllers.getLotes
);

router.post(
  '/addGanadoToLote',
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
    body('idLote')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de el lote')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(loteValidators.loteExist),
    body('coGanado')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el codigo del ganado')
      .isInt()
      .withMessage('El codigo debe de ser un numero entero')
      .custom(ganadoValidators.coGanadoExist)
  ],
  loteControllers.addGanadoToLote
);

router.delete(
  '/removeGanadoFromLote/:idEmpresa/:idLote/:coGanado',
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
    param('idLote')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de el lote')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(loteValidators.loteExist),
    param('coGanado')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el codigo del ganado')
      .isInt()
      .withMessage('El codigo debe de ser un numero entero')
      .custom(ganadoValidators.coGanadoExist)
  ],
  loteControllers.removeGanadoFromLote
);
module.exports = router;
