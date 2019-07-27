const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');
const customValidators = require('./custom_validators/vadilators');

const router = express.Router();

router.post(
  '/registro',
  [
    body('email')
      .isEmail()
      .withMessage('Porfavor ingrese un correo valido..')
      .custom(customValidators.email)
      .normalizeEmail(),
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
      .custom(customValidators.ci),
    body('user')
      .trim()
      .custom(customValidators.user)
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

module.exports = router;
