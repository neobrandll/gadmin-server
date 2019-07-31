const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');
const customValidators = require('./custom_validators/vadilators');
const isAuth = require('../middlewares/is-auth');

const router = express.Router();

router.post(
  '/registro',
  [
    body('email', 'Porfavor ingrese un correo valido..')
      .trim()
      .not()
      .isEmpty()
      .isEmail()
      .normalizeEmail()
      .custom(customValidators.email),
    body('password')
      .trim()
      .isLength({ min: 5 })
      .withMessage('La contraseña no cumple con el minimo de caracteres (5)')
      .isAlphanumeric()
      .withMessage('La contraseña tiene que ser alfanumerica'),
    body('confirmPassword')
      .trim()
      .custom(customValidators.confirmPassword),
    body('ci')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Debe de ingresar una cedula')
      .custom(customValidators.ci),
    body('user')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Debe de ingresar un usuario')
      .custom(customValidators.user),
    body('nombre')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Debe de ingresar un nombre'),
    body('apellido')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Debe de ingresar un apellido'),
    body('telf')
      .trim()
      .not()
      .isEmpty()
      .withMessage('El numero de telefono no puede estar vacio'),
    body('pais')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese un pais'),
    body('estado')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese un estado'),
    body('ciudad')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese una ciudad'),
    body('calle')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese una calle')
  ],
  authController.registro
);
router.post(
  '/login',
  [
    body('password', 'Introduzca una contraseña correcta.')
      .trim()
      .isLength({ min: 5 })
  ],
  authController.login
);

router.put(
  '/updateAddress',
  isAuth,
  [
    body('pais')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese un pais'),
    body('estado')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese un estado'),
    body('ciudad')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese una ciudad'),
    body('calle')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese una calle')
  ],
  authController.updateAddress
);

router.put(
  '/updateProfile',
  isAuth,
  [
    body('nombre')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Debe de ingresar un nombre'),
    body('user')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Debe de ingresar un usuario')
      .custom(customValidators.updateUser),
    body('ci')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Debe de ingresar una cedula')
      .custom(customValidators.updateCi),
    body('apellido')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Debe de ingresar un apellido'),
    body('telf')
      .trim()
      .not()
      .isEmpty()
      .withMessage('El numero de telefono no puede estar vacio')
  ],
  authController.updateProfile
);

router.put(
  '/updateEmail',
  isAuth,
  [
    body('email', 'Por favor ingrese un correo valido.')
      .trim()
      .isEmail()
      .normalizeEmail()
      .not()
      .isEmpty()
      .custom(customValidators.updateEmail),
    body('password')
      .trim()
      .isLength({ min: 5 })
      .withMessage('La contraseña no cumple con el minimo de caracteres (5)')
      .isAlphanumeric()
      .withMessage('La contraseña tiene que ser alfanumerica')
  ],
  authController.updateEmail
);

router.post(
  '/sendTokenPassword',
  [
    body('email', 'Por favor ingrese un correo valido.')
      .trim()
      .isEmail()
      .normalizeEmail()
      .not()
      .isEmpty()
  ],
  authController.sendTokenPassword
);

router.post(
  '/updatePassword',
  [
    body('email', 'Por favor ingrese un correo valido.')
      .trim()
      .isEmail()
      .normalizeEmail()
      .not()
      .isEmpty(),
    body('password')
      .trim()
      .isLength({ min: 5 })
      .withMessage('La contraseña no cumple con el minimo de caracteres (5)')
      .isAlphanumeric()
      .withMessage('La contraseña tiene que ser alfanumerica'),
    body('confirmPassword')
      .trim()
      .custom(customValidators.confirmPassword)
  ],
  authController.updatePassword
);

module.exports = router;
