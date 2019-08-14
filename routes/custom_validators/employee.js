const db = require('../../sql/db');

const employeeQueries = require('../../sql/queries/employee');
const authQueries = require('../../sql/queries/auth');

exports.createUser = async (ci, { req }) => {
  const persona = await db.oneOrNone(employeeQueries.getPersona, [ci]);
  if (!persona) {
    throw new Error('No existe ninguna persona con esa cedula en el sistema');
  }
  const usuario = await db.oneOrNone(employeeQueries.haveAUser, [persona.id_persona]);
  if (usuario) {
    throw new Error('Ya existe un usuario con la cedula ingresada');
  }
  return true;
};

exports.deCargoExist = async (deCargo, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const deCargoFound = await db.oneOrNone(employeeQueries.deCargoExist, [deCargo, id_empresa]);
  if (deCargoFound) {
    if (req.body.idCargo && +req.body.idCargo === deCargoFound.id_cargo) {
      return true;
    }
    throw new Error('Ya existe un cargo con la descripcion ingresada');
  }
  return true;
};

exports.cargoExist = async (idCargo, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const cargoFound = await db.oneOrNone(employeeQueries.cargoExist, [idCargo, id_empresa]);
  if (!cargoFound) {
    throw new Error('no existe un cargo con el id ingresado en la empresa seleccionada');
  }
  return true;
};

exports.personaExist = async (ci, { req }) => {
  const persona = await db.oneOrNone(employeeQueries.getPersona, [ci]);
  if (!persona) {
    throw new Error('No existe ninguna persona con esa cedula en el sistema');
  }
  return true;
};

//funcion para verificar que la ci ingresada es de un empleado de esa empresa
exports.isEmployee = async (ci, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const personaFound = await db.oneOrNone(employeeQueries.isEmployee, [id_empresa, ci]);
  if (!personaFound) {
    throw new Error(
      'La cedula ingresada no corresponde a ningun trabajador de la empresa seleccionada'
    );
  }
  return true;
};

exports.updateEmail = async (email, { req }) => {
  const oldCi = req.body.oldCi;
  const persona = await db.oneOrNone(employeeQueries.getPersonaWithEmail, [email]);
  if (persona && persona.ci_persona !== oldCi) {
    throw new Error('El correo ingresado ya esta en uso.');
  }
  return true;
};

exports.updateCi = async (newCi, { req }) => {
  const oldCi = req.body.oldCi;
  if (oldCi !== newCi) {
    const ciFound = await db.oneOrNone(authQueries.findCi, [newCi]);
    if (ciFound) {
      throw new Error('La cedula ingresada ya esta en uso.');
    }
  }
  return true;
};
