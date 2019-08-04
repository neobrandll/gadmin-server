const db = require('../../sql/db');

const employeeQueries = require('../../sql/queries/employee');

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
  const id_empresa = req.body.idEmpresa;
  const deCargoFound = await db.oneOrNone(employeeQueries.deCargoExist, [deCargo, id_empresa]);
  if (deCargoFound) {
    throw new Error('Ya existe un cargo con la descripcion ingresada');
  }
  return true;
};

exports.cargoExist = async (idCargo, { req }) => {
  const id_empresa = req.body.idEmpresa;
  const cargoFound = await db.oneOrNone(employeeQueries.cargoExist, [idCargo, id_empresa]);
  if (!cargoFound) {
    throw new Error('no existe un cargo con el id ingresado');
  }
  return true;
};
