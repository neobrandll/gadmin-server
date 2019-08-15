const express = require('express');
const { body, param, query } = require('express-validator');

const empresaValidators = require('./custom_validators/empresa');
const pajuelaValidators = require('./custom_validators/pajuela');
const pajuelaControllers = require('../controllers/pajuela');
const ganadoValidators = require('./custom_validators/ganado');
const sharedValidators = require('./custom_validators/shared');
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
    body('idRaza')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la raza')
      .custom(ganadoValidators.razaExistOrMestizo),
    body('coPajuela')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el codigo de la pajuela')
      .isInt()
      .withMessage('El codigo debe de ser un numero entero')
      .custom(pajuelaValidators.coPajuelaAvailable),
    body('fePajuela')
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese la fecha de creacion de la pajuela')
      .custom(sharedValidators.dateValidator),
    body('dePajuela')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese una descripcion para la pajuela')
  ],
  pajuelaControllers.createPajuela
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
    body('idRaza')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la raza')
      .custom(ganadoValidators.razaExistOrMestizo),
    body('coPajuela')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el codigo de la pajuela')
      .isInt()
      .withMessage('El codigo debe de ser un numero entero')
      .custom(pajuelaValidators.coPajuelaExist),
    body('newCoPajuela')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el codigo de la pajuela')
      .isInt()
      .withMessage('El codigo debe de ser un numero entero')
      .custom(pajuelaValidators.coPajuelaAvailable),
    body('fePajuela')
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese la fecha de creacion de la pajuela')
      .custom(sharedValidators.dateValidator),
    body('dePajuela')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese una descripcion para la pajuela')
  ],
  pajuelaControllers.updatePajuela
);

router.get(
  '/:idEmpresa',
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
    query('dateFrom')
      .optional()
      .custom(sharedValidators.dateValidator),
    query('dateTo')
      .optional()
      .custom(sharedValidators.dateValidator),
    query('idRaza')
      .optional()
      .trim()
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(ganadoValidators.razaExist)
  ],
  pajuelaControllers.getPajuelas
);

module.exports = router;
