const express = require('express');
const { body, param, query } = require('express-validator');

const isAuth = require('../middlewares/is-auth');
const actividadControllers = require('../controllers/actividad');
const actividadValidators = require('./custom_validators/actividad');
const empresaValidators = require('./custom_validators/empresa');
const ganadoValidators = require('./custom_validators/ganado');
const pajuelaValidators = require('./custom_validators/pajuela');
const sharedValidators = require('./custom_validators/shared');

const router = express.Router();

router.post(
  '/parto',
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
    body('idTipoActividad')
      .trim()
      .not()
      .isEmpty()
      .withMessage('El id del tipo de la actividad no puede ser omitido')
      .isIn(['1', '2'])
      .withMessage('El id de la actividad ingresado es incorrecto')
      .custom(actividadValidators.idTipoParto),
    body('feActividad')
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese la fecha de nacimiento del ganado')
      .custom(sharedValidators.dateValidator),
    body('deActividad')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese una descripcion para la actividad'),
    body('crias').custom(actividadValidators.crias),
    body('coPaGanado')
      .optional()
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el codigo del padre del ganado')
      .isInt()
      .withMessage('El codigo debe de ser un numero entero')
      .custom(actividadValidators.coPaGanado),
    body('coMaGanado')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el codigo de la madre del ganado')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(actividadValidators.coMaGanado),
    body('coPaPajuela')
      .optional()
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el codigo de la pajuela')
      .isInt()
      .withMessage('El codigo debe de ser un numero entero')
      .custom(actividadValidators.coPajuela)
  ],
  actividadControllers.createParto
);

router.put(
  '/parto',
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
    body('idTipoActividad')
      .trim()
      .not()
      .isEmpty()
      .withMessage('El id del tipo de la actividad no puede ser omitido')
      .isIn(['1', '2'])
      .withMessage('El id de la actividad ingresado es incorrecto')
      .custom(actividadValidators.idTipoParto),
    body('feActividad')
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese la fecha de nacimiento del ganado')
      .custom(sharedValidators.dateValidator),
    body('deActividad')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese una descripcion para la actividad'),
    body('crias')
      .optional()
      .custom(actividadValidators.crias),
    body('coPaGanado')
      .optional()
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el codigo del padre del ganado')
      .isInt()
      .withMessage('El codigo debe de ser un numero entero')
      .custom(actividadValidators.coPaGanado),
    body('coMaGanado')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el codigo de la madre del ganado')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(actividadValidators.coMaGanado),
    body('coPaPajuela')
      .optional()
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el codigo de la pajuela')
      .isInt()
      .withMessage('El codigo debe de ser un numero entero')
      .custom(actividadValidators.coPajuela),
    body('idActividad')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de el parto')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(actividadValidators.partoExist)
  ],
  actividadControllers.updateParto
);

router.get(
  '/partos/:idEmpresa',
  isAuth,
  [
    query('coMaGanado')
      .optional()
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el codigo de la madre del ganado')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(actividadValidators.coMaGanado),
    query('coPaPajuela')
      .optional()
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el codigo de la pajuela')
      .isInt()
      .withMessage('El codigo debe de ser un numero entero')
      .custom(actividadValidators.coPajuela),
    param('idEmpresa')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la empresa')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(empresaValidators.empresaExist),
    query('idTipoActividad')
      .optional()
      .trim()
      .not()
      .isEmpty()
      .withMessage('El id del tipo de la actividad esta vacio')
      .isIn(['1', '2'])
      .withMessage('El id de la actividad ingresado es incorrecto')
      .custom(actividadValidators.idTipoParto),
    query('coPaGanado')
      .optional()
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el codigo del padre del ganado')
      .isInt()
      .withMessage('El codigo debe de ser un numero entero')
      .custom(actividadValidators.coPaGanado),
    query('dateFrom')
      .optional()
      .custom(sharedValidators.dateValidator),
    query('dateTo')
      .optional()
      .custom(sharedValidators.dateValidator)
  ],
  actividadControllers.getPartos
);

router.get(
  '/parto/:idEmpresa/:idActividad',
  isAuth,
  [
    param('idActividad')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de el parto')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(actividadValidators.partoExist),
    param('idEmpresa')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la empresa')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(empresaValidators.empresaExist)
  ],
  actividadControllers.getParto
);
module.exports = router;
