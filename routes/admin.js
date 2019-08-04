const express = require('express');
const { body, param } = require('express-validator');

const isAuth = require('../middlewares/is-auth');
const adminControllers = require('../controllers/admin');
const adminValidators = require('./custom_validators/admin');
const empresaValidators = require('./custom_validators/empresa');

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
      .withMessage('El id debe de ser un numero entero')
      .custom(empresaValidators.empresaExist),
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
      .withMessage('El id debe de ser un numero entero')
      .custom(empresaValidators.empresaExist),
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
      .custom(empresaValidators.empresaExist)
  ],
  adminControllers.addPermissionToProfile
);

router.put(
  '/updateProfile',
  isAuth,
  [
    body('idPerfil')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id del perfil')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(adminValidators.perfilExist),
    body('dePerfil')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese la descripcion perfil')
      .custom(adminValidators.dePerfilExist),
    body('idEmpresa')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la empresa')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(empresaValidators.empresaExist)
  ],
  adminControllers.updateProfile
);

router.delete(
  '/deleteProfile/:idEmpresa/:idPerfil',
  isAuth,
  [
    param('idPerfil')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id del perfil')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(adminValidators.perfilExist),
    param('idEmpresa')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la empresa')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(empresaValidators.empresaExist)
  ],
  adminControllers.deleteProfile
);

router.delete(
  '/removeProfileFromUser/:idEmpresa/:idPerfil/:user',
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
    param('user')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese un usuario')
      .custom(adminValidators.userExist),
    param('idPerfil')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id del perfil')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
  ],
  adminControllers.removeProfileFromUser
);

router.get(
  '/getProfilesEmpresa/:idEmpresa',
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
  adminControllers.getProfilesEmpresa
);

router.put(
  '/updatePermissionProfile',
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
      .custom(empresaValidators.empresaExist)
  ],
  adminControllers.updatePermissionProfile
);

module.exports = router;
