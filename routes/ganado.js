const express = require('express');
const { body, param } = require('express-validator');

const empresaValidators = require('./custom_validators/empresa');
const authValidators = require('./custom_validators/auth');
const employeeValidators = require('./custom_validators/employee');
const employeeControllers = require('../controllers/employee');
const ganadoControllers = require('../controllers/ganado');
const ganadoValidators = require('./custom_validators/ganado');
const isAuth = require('../middlewares/is-auth');
const sharedValidator = require('./custom_validators/shared');

const upload = require('../util/fileUpload');

const router = express.Router();

router.post(
  '/createRaza',
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
    body('deRaza')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese una descripcion para la raza')
      .custom(ganadoValidators.deRazaExist)
  ],
  ganadoControllers.createRaza
);

router.get(
  '/getRazas/:idEmpresa',
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
  ganadoControllers.getRazas
);

router.put(
  '/updateRaza',
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
    body('idRaza')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la raza')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(ganadoValidators.razaExist),
    body('deRaza')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese una descripcion para la raza')
      .custom(ganadoValidators.updateDeRaza)
  ],
  ganadoControllers.updateRaza
);

router.post(
  '/createGanado',
  isAuth,
  upload.single('foGanado'),
  [
    body('idEmpresa')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la empresa')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(empresaValidators.empresaExist),
    body('idRaza')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la raza')
      .custom(ganadoValidators.razaExistOrMestizo),
    body('idEstadoGanado')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id del estado del ganado')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .isIn(['1', '2', '3', '4'])
      .withMessage('El id del estado ingresado es incorrecto'),
    body('tipoGanado')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id del tipo del ganado')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(ganadoValidators.tipoGanado),
    body('peGanado')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el peso del ganado')
      .isNumeric()
      .withMessage('El peso debe de ser numerico'),
    body('feGanado')
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese la fecha de nacimiento del ganado')
      .custom(sharedValidator.dateValidator),
    body('idPaGanado')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id del padre del ganado')
      .isInt()
      .withMessage('El id debe de ser un numero entero'),
    body('idMaGanado')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la madre del ganado')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(ganadoValidators.idPaMaGanado),
    body('idPaPajuela')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la pajuela')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(ganadoValidators.idPaMaGanado),
    body('coGanado')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el codigo del ganado')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(ganadoValidators.codigoExist)
  ],
  ganadoControllers.createGanado
);

module.exports = router;