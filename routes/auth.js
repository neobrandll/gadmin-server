const express = require('express');
const { body } = require('express-validator');

const authControllers = require('../controllers/auth');
const authValidators = require('./custom_validators/auth');
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
      .custom(authValidators.email),
    body('password')
      .trim()
      .isLength({ min: 5 })
      .withMessage('La contraseña no cumple con el minimo de caracteres (5)')
      .isAlphanumeric()
      .withMessage('La contraseña tiene que ser alfanumerica'),
    body('confirmPassword')
      .trim()
      .custom(authValidators.confirmPassword),
    body('ci')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Debe de ingresar una cedula')
      .isInt()
      .withMessage('El rif debe de ser un numero entero')
      .custom(authValidators.ci),
    body('user')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Debe de ingresar un usuario')
      .custom(authValidators.user),
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
  authControllers.registro
);
router.post(
  '/login',
  [
    body('password', 'Introduzca una contraseña correcta.')
      .trim()
      .isLength({ min: 5 })
  ],
  authControllers.login
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
  authControllers.updateAddress
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
      .custom(authValidators.updateUser),
    body('ci')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Debe de ingresar una cedula')
      .isInt()
      .withMessage('El rif debe de ser un numero entero')
      .custom(authValidators.updateCi),
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
  authControllers.updateProfile
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
      .custom(authValidators.updateEmail),
    body('password')
      .trim()
      .isLength({ min: 5 })
      .withMessage('La contraseña no cumple con el minimo de caracteres (5)')
      .isAlphanumeric()
      .withMessage('La contraseña tiene que ser alfanumerica')
  ],
  authControllers.updateEmail
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
  authControllers.sendTokenPassword
);

router.put(
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
      .custom(authValidators.confirmPassword)
  ],
  authControllers.updatePassword
);

router.get('/getUser', isAuth, authControllers.getUserData);

module.exports = router;
