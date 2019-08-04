const bcrypt = require('bcryptjs');

const db = require('../sql/db.js');
const empresaQueries = require('../sql/queries/empresa');
const authQueries = require('../sql/queries/auth');
const adminQueries = require('../sql/queries/admin');
const employeeQueries = require('../sql/queries/employee');
const errorHandler = require('../util/error');
const validationHandler = require('../util/validationHandler');

exports.createUser = async (req, res, next) => {
  try {
    validationHandler(req);
    const ci_persona = req.body.ci;
    const persona = await db.one(employeeQueries.getPersona, [ci_persona]);
    const pw = req.body.password;
    const username = req.body.user;
    const hashedPw = await bcrypt.hash(pw, 12);
    await db.none(employeeQueries.createUser, [username, hashedPw, persona.id_persona]);
    res.status(201).json({ msg: 'usuario creado!', username });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.PLANTILLA = async (req, res, next) => {
  try {
    validationHandler(req);
  } catch (err) {
    errorHandler(err, next);
  }
};

// exports.createEmployee;
exports.createEmployee = async (req, res, next) => {
  try {
    validationHandler(req);
  } catch (err) {
    errorHandler(err, next);
  }
};
// exports.updateEmployee;
//exports.getEmployees

// exports.updateEmployeeAddress
//

exports.createCargo = async (req, res, next) => {
  try {
    validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.body.idEmpresa;
    const de_cargo = req.body.deCargo;
    const permission = await db.manyOrNone(adminQueries.searchPermission, [
      id_usuario,
      5,
      id_empresa
    ]);
    if (!permission) {
      const err = new Error('No se tienen permisos para manejar empleados');
      err.statusCode = 401;
      throw err;
    }
    await db.none(employeeQueries.createCargo, [id_empresa, de_cargo]);
    res.status(201).json({ msg: 'cargo creado!', descripcionCargo: de_cargo });
  } catch (err) {
    errorHandler(err, next);
  }
};
// exports.updateCargo
//exports.getCargos

// exports.addCargoToPersona;

//exports.removeCargoFromPersona
