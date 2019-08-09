const express = require('express');
const { body, param } = require('express-validator');

const empresaValidators = require('./custom_validators/empresa');
const authValidators = require('./custom_validators/auth');
const employeeValidators = require('./custom_validators/employee');
const employeeControllers = require('../controllers/employee');
const isAuth = require('../middlewares/is-auth');

const router = express.Router();

router.post(
  '/createUser',
  [
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
      .withMessage('La cedula debe de ser un numero entero')
      .custom(employeeValidators.createUser),
    body('user')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Debe de ingresar un usuario')
      .custom(authValidators.user)
  ],
  employeeControllers.createUser
);

router.post(
  '/createCargo',
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
    body('deCargo')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese la descripcion perfil')
      .custom(employeeValidators.deCargoExist)
  ],
  employeeControllers.createCargo
);

router.post(
  '/createEmployee',
  isAuth,
  [
    body('email', 'Porfavor ingrese un correo valido..')
      .trim()
      .not()
      .isEmpty()
      .isEmail()
      .normalizeEmail()
      .custom(authValidators.email),
    body('ci')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Debe de ingresar una cedula')
      .isInt()
      .withMessage('La cedula debe de ser un numero entero')
      .custom(authValidators.ci),
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
      .withMessage('Por favor ingrese una calle'),
    body('idCargo')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id del cargo')
      .custom(employeeValidators.cargoExist),
    body('idEmpresa')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la empresa')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(empresaValidators.empresaExist)
  ],
  employeeControllers.createEmployee
);

router.post(
  '/addCargoToPersona',
  isAuth,
  [
    body('idCargo')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id del cargo')
      .custom(employeeValidators.cargoExist),
    body('idEmpresa')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la empresa')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(empresaValidators.empresaExist),
    body('ci')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Debe de ingresar una cedula')
      .isInt()
      .withMessage('La cedula debe de ser un numero entero')
      .custom(employeeValidators.personaExist)
  ],
  employeeControllers.addCargoToPersona
);

router.delete(
  '/deleteCargo/:idEmpresa/:idCargo',
  isAuth,
  [
    param('idCargo')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id del cargo')
      .custom(employeeValidators.cargoExist),
    param('idEmpresa')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la empresa')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(empresaValidators.empresaExist)
  ],
  employeeControllers.deleteCargo
);

router.delete(
  '/removeCargoFromPersona/:idEmpresa/:idCargo/:ci',
  isAuth,
  [
    param('idCargo')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id del cargo')
      .custom(employeeValidators.cargoExist),
    param('idEmpresa')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la empresa')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(empresaValidators.empresaExist),
    param('ci')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Debe de ingresar una cedula')
      .isInt()
      .withMessage('La cedula debe de ser un numero entero')
      .custom(employeeValidators.isEmployee)
  ],
  employeeControllers.removeCargoFromPersona
);

router.get(
  '/getCargosEmpresa/:idEmpresa',
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
  employeeControllers.getCargosEmpresa
);

router.put(
  '/updateCargo',
  isAuth,
  [
    body('idCargo')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id del cargo')
      .custom(employeeValidators.cargoExist),
    body('idEmpresa')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese el id de la empresa')
      .isInt()
      .withMessage('El id debe de ser un numero entero')
      .custom(empresaValidators.empresaExist),
    body('deCargo')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Por favor ingrese la descripcion perfil')
      .custom(employeeValidators.deCargoExist)
  ],
  employeeControllers.updateCargo
);

router.put(
  '/updateEmployeeAddress',
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
    body('ci')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Debe de ingresar una cedula')
      .isInt()
      .withMessage('La cedula debe de ser un numero entero')
      .custom(employeeValidators.isEmployee),
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
  employeeControllers.updateEmployeeAddress
);

router.get(
  '/getEmployee/:idEmpresa/:ci',
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
    param('ci')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Debe de ingresar una cedula')
      .isInt()
      .withMessage('La cedula debe de ser un numero entero')
      .custom(employeeValidators.isEmployee)
  ],
  employeeControllers.getEmployee
);

router.get(
  '/getEmployees/:idEmpresa',
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
  employeeControllers.getEmployees
);

router.put(
  '/updateEmployeeProfile',
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
    body('oldCi')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Debe de ingresar una cedula')
      .isInt()
      .withMessage('La cedula debe de ser un numero entero')
      .custom(employeeValidators.isEmployee),
    body('email', 'Porfavor ingrese un correo valido..')
      .trim()
      .not()
      .isEmpty()
      .isEmail()
      .normalizeEmail()
      .custom(employeeValidators.updateEmail),
    body('newCi')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Debe de ingresar una cedula')
      .isInt()
      .withMessage('La cedula debe de ser un numero entero')
      .custom(employeeValidators.updateCi),
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
      .withMessage('El numero de telefono no puede estar vacio')
  ],
  employeeControllers.updateEmployeeProfile
);
module.exports = router;
