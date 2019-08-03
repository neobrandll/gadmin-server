const express = require('express');
const { body } = require('express-validator');

const isAuth = require('../middlewares/is-auth');
const adminControllers = require('../controllers/admin');
const adminValidators = require('./custom_validators/admin');

const router = express.Router();

router.post(
  '/addProfileToUser',
  isAuth,
  [
    body('idEmpresa')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la empresa')
      .isInt()
      .withMessage('El id debe de ser un numero entero'),
    body('user')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese un usuario')
      .custom(adminValidators.userExist),
    body('idProfile')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id del perfil')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
  ],
  adminControllers.addProfileToUser
);

router.post(
  '/createProfile',
  isAuth,
  [
    body('idEmpresa')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la empresa')
      .isInt()
      .withMessage('El id debe de ser un numero entero'),
    body('dePerfil')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese una descripcion para el perfil')
      .custom(adminValidators.dePerfilExist)
  ],
  adminControllers.createProfile
);

router.post(
  '/addPermissionToProfile',
  isAuth,
  [
    body('idPerfil')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id del perfil')
      .isInt()
      .withMessage('Por favor ingrese un id valido')
      .custom(adminValidators.perfilExist),
    body('idPermissionsArr').custom(adminValidators.checkPermissionsIds),
    body('idEmpresa')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la empresa')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
  ],
  adminControllers.addPermissionToProfile
);

module.exports = router;
