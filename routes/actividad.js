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

router.post(
  '/otros',
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
    body('feActividad')
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese la fecha de nacimiento del ganado')
      .custom(sharedValidators.dateValidator),
    body('idTipoActividad')
      .optional()
      .trim()
      .not()
      .isEmpty()
      .withMessage('El id del tipo de la actividad esta vacio')
      .isIn(['3', '5'])
      .withMessage('El id de la actividad ingresado es incorrecto'),
    body('deActividad')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese una descripcion para la actividad'),
    body('ganado').custom(actividadValidators.ganadoArr)
  ],
  actividadControllers.postOtros
);

router.put(
  '/otros',
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
    body('feActividad')
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese la fecha de nacimiento del ganado')
      .custom(sharedValidators.dateValidator),
    body('deActividad')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese una descripcion para la actividad')
  ],
  actividadControllers.updateOtros
);

router.get(
  '/abortos/:idEmpresa',
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
    query('coGanado')
      .optional()
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el codigo de la vaca')
      .isInt()
      .withMessage('El codigo debe de ser un numero entero')
      .custom(actividadValidators.vacaExists),
    query('dateFrom')
      .optional()
      .custom(sharedValidators.dateValidator),
    query('dateTo')
      .optional()
      .custom(sharedValidators.dateValidator)
  ],
  actividadControllers.getAbortos
);
router.get(
  '/tratamiento/:idEmpresa/:idActividad',
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
    param('idActividad')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id del tratamiento')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(actividadValidators.tratamientoExists)
  ],
  actividadControllers.getTratamiento
);

router.get(
  '/tratamientos/:idEmpresa',
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
    query('coGanado')
      .optional()
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el codigo del ganado')
      .isInt()
      .withMessage('El codigo debe de ser un numero entero')
      .custom(ganadoValidators.coGanadoExist),
    query('dateFrom')
      .optional()
      .custom(sharedValidators.dateValidator),
    query('dateTo')
      .optional()
      .custom(sharedValidators.dateValidator)
  ],
  actividadControllers.getTratamientos
);

router.post(
  '/servicio',
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
    body('coVaca')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el codigo de la vaca')
      .isInt()
      .withMessage('El codigo debe de ser un numero entero')
      .custom(actividadValidators.validateCoVacaServicio),
    body('coToro')
      .optional()
      .trim()
      .not()
      .isEmpty()
      .withMessage('El codigo del toro esta vacio')
      .isInt()
      .withMessage('El codigo debe de ser un numero entero')
      .custom(actividadValidators.validateCoToroServicio),
    body('coPajuela')
      .optional()
      .trim()
      .not()
      .isEmpty()
      .withMessage('El codigo de la pajuela esta vacio')
      .isInt()
      .withMessage('El codigo debe de ser un numero entero')
      .custom(actividadValidators.validateCoPajuelaServicio),
    body('feActividad')
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese la fecha del servicio')
      .custom(sharedValidators.dateValidator),
    body('deActividad')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese una descripcion para la actividad'),
    body('idTipoActividad')
      .optional()
      .trim()
      .not()
      .isEmpty()
      .withMessage('El id del tipo de la actividad esta vacio')
      .isIn(['6', '7'])
      .withMessage('El id de la actividad ingresado es incorrecto')
      .custom(actividadValidators.tipoActividadServicio)
  ],
  actividadControllers.createServicio
);

router.put(
  '/servicio',
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
    body('coVaca')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el codigo de la vaca')
      .isInt()
      .withMessage('El codigo debe de ser un numero entero')
      .custom(actividadValidators.validateCoVacaServicio),
    body('coToro')
      .optional()
      .trim()
      .not()
      .isEmpty()
      .withMessage('El codigo del toro esta vacio')
      .isInt()
      .withMessage('El codigo debe de ser un numero entero')
      .custom(actividadValidators.validateCoToroServicio),
    body('coPajuela')
      .optional()
      .trim()
      .not()
      .isEmpty()
      .withMessage('El codigo de la pajuela esta vacio')
      .isInt()
      .withMessage('El codigo debe de ser un numero entero')
      .custom(actividadValidators.validateCoPajuelaServicio),
    body('feActividad')
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese la fecha del servicio')
      .custom(sharedValidators.dateValidator),
    body('deActividad')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese una descripcion para la actividad'),
    body('idActividad')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id del tratamiento')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(actividadValidators.validateIdServicioUpdate)
  ],
  actividadControllers.updateServicio
);

router.get(
  '/servicio/:idEmpresa/:idActividad',
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
    param('idActividad')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id del servicio')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(actividadValidators.servicioExists)
  ],
  actividadControllers.getServicio
);

module.exports = router;
