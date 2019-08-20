const express = require('express');
const { body, param, query } = require('express-validator');

const empresaValidators = require('./custom_validators/empresa');
const authValidators = require('./custom_validators/auth');
const employeeValidators = require('./custom_validators/employee');
const employeeControllers = require('../controllers/employee');
const ganadoControllers = require('../controllers/ganado');
const ganadoValidators = require('./custom_validators/ganado');
const loteValidators = require('./custom_validators/lote');
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
  '/raza',
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

router.get(
  '/search/:idEmpresa',
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
    query('idLote')
      .optional()
      .trim()
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(loteValidators.loteExist),
    query('idRaza')
      .optional()
      .trim()
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(ganadoValidators.razaExist),
    query('idEstadoGanado')
      .optional()
      .trim()
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .isIn(['1', '2', '3', '4'])
      .withMessage('El id del estado ingresado es incorrecto'),
    query('tipoGanado')
      .optional()
      .trim()
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(ganadoValidators.tipoGanado),
    query('dateFrom')
      .optional()
      .custom(sharedValidator.dateValidator),
    query('dateTo')
      .optional()
      .custom(sharedValidator.dateValidator)
  ],
  ganadoControllers.searchGanado
);

router.get(
  '/:idEmpresa/:coGanado',
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
    body('coGanado')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el codigo del ganado')
      .isInt()
      .withMessage('El codigo debe de ser un numero entero')
      .custom(ganadoValidators.coGanadoExist)
  ],
  ganadoControllers.getGanado
);

router.put(
  '',
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
      .isFloat()
      .withMessage('El peso debe de ser numerico'),
    body('feGanado')
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese la fecha de nacimiento del ganado')
      .custom(sharedValidator.dateValidator),
    // body('coPaGanado')
    //   .trim()
    //   .not()
    //   .isEmpty()
    //   .withMessage('Por favor ingrese el codigo del padre del ganado')
    //   .isInt()
    //   .withMessage('El codigo debe de ser un numero entero')
    //   .custom(ganadoValidators.coPaGanado),
    // body('coMaGanado')
    //   .trim()
    //   .not()
    //   .isEmpty()
    //   .withMessage('Por favor ingrese el codigo de la madre del ganado')
    //   .isInt()
    //   .withMessage('El id debe de ser un numero entero')
    //   .custom(ganadoValidators.coMaGanado),
    // body('coPaPajuela')
    //   .trim()
    //   .not()
    //   .isEmpty()
    //   .withMessage('Por favor ingrese el codigo de la pajuela')
    //   .isInt()
    //   .withMessage('El codigo debe de ser un numero entero')
    //   .custom(ganadoValidators.coPajuela),
    body('coGanado')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el codigo del ganado')
      .isInt()
      .withMessage('El codigo debe de ser un numero entero')
      .custom(ganadoValidators.coGanadoExist),
    body('newCoGanado')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el nuevo codigo del ganado')
      .isInt()
      .withMessage('El codigo debe de ser un numero entero')
      .custom(ganadoValidators.newCoGanado)
  ],
  ganadoControllers.updateGanado
);

router.post(
  '',
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
      .isFloat()
      .withMessage('El peso debe de ser numerico'),
    body('feGanado')
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese la fecha de nacimiento del ganado')
      .custom(sharedValidator.dateValidator),
    // body('coPaGanado')
    //   .trim()
    //   .not()
    //   .isEmpty()
    //   .withMessage('Por favor ingrese el codigo del padre del ganado')
    //   .isInt()
    //   .withMessage('El codigo debe de ser un numero entero')
    //   .custom(ganadoValidators.coPaGanado),
    // body('coMaGanado')
    //   .trim()
    //   .not()
    //   .isEmpty()
    //   .withMessage('Por favor ingrese el codigo de la madre del ganado')
    //   .isInt()
    //   .withMessage('El codigo debe de ser un numero entero')
    //   .custom(ganadoValidators.coMaGanado),
    // body('coPaPajuela')
    //   .trim()
    //   .not()
    //   .isEmpty()
    //   .withMessage('Por favor ingrese el codigo de la pajuela')
    //   .isInt()
    //   .withMessage('El codigo debe de ser un numero entero')
    //   .custom(ganadoValidators.coPajuela),
    body('coGanado')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el codigo del ganado')
      .isInt()
      .withMessage('El codigo debe de ser un numero entero')
      .custom(ganadoValidators.coGanadoAvailable)
  ],
  ganadoControllers.createGanado
);
module.exports = router;
