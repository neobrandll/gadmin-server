const db = require('../../sql/db');

const ganadoQueries = require('../../sql/queries/ganado');

exports.deRazaExist = async (deRaza, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const deRazaFound = await db.oneOrNone(ganadoQueries.deRazaExist, [deRaza, id_empresa]);
  if (deRazaFound) {
    throw new Error('Ya existe una raza con la descripcion ingresada');
  }
  return true;
};

exports.razaExist = async (id_raza, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const razaFound = await db.oneOrNone(ganadoQueries.razaExist, [id_raza, id_empresa]);
  if (!razaFound) {
    throw new Error('no existe ninguna raza con el id ingresado en la empresa seleccionada');
  }
  return true;
};

exports.updateDeRaza = async (deRaza, { req }) => {
  let id_empresa = req.body.idEmpresa;
  const id_raza = +req.body.idRaza;
  const razaFound = await db.oneOrNone(ganadoQueries.deRazaExist, [deRaza, id_empresa]);
  if (razaFound) {
    if (razaFound.id_raza !== id_raza) {
      throw new Error('Ya existe una raza con la descripcion ingresada');
    }
  }
  return true;
};

// exports.estadoGanado = (esGanado, { req }) => {
//   if (esGanado !== '1' && esGanado !== '2' && esGanado !== '3' && esGanado !== '4') {
//     throw new Error('El id del estado ingresado es incorrecto');
//   }
//   return true;
// };

exports.tipoGanado = (tipoGanado, { req }) => {
  const esGanado = req.body.idEstadoGanado;
  if (tipoGanado !== '1' && tipoGanado !== '2') {
    throw new Error('El id del tipo ingresado es incorrecto');
  }
  if (tipoGanado === '1' && esGanado === '4') {
    throw new Error('estado incorrecto, los machos no pueden estar prenados.');
  }
  return true;
};

exports.razaExistOrMestizo = async (id_raza, { req }) => {
  const raza = '' + id_raza;
  if (raza.toLowerCase() === 'mestizo') {
    return true;
  }
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const razaFound = await db.oneOrNone(ganadoQueries.razaExist, [id_raza, id_empresa]);
  if (!razaFound) {
    throw new Error('no existe ninguna raza con el id ingresado en la empresa seleccionada');
  }
  return true;
};

//validador de que existe el padre o madre del ganado
exports.idPaMaGanado = async (id, { req }) => {
  if (id === '-1') {
    return true;
  }
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const ganadoFound = await db.oneOrNone(ganadoQueries.ganadoExist, [id, id_empresa]);
  if (!ganadoFound) {
    throw new Error('no existe ningun ganado con el id ingresado en la empresa');
  }
  return true;
};

exports.idPajuela = async (id, { req }) => {
  if (id === '-1') {
    return true;
  }
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const pajuelaFound = await db.oneOrNone(ganadoQueries.pajuelaExist, [id, id_empresa]);
  if (!pajuelaFound) {
    throw new Error('no existe ninguna pajuela con el id ingresado en la empresa');
  }
  return true;
};

exports.codigoExist = async (codigo, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const codigoFound = await db.oneOrNone(ganadoQueries.codigoExist, [codigo, id_empresa]);
  if (codigoFound) {
    throw new Error('ya existe un ganado con el mismo codigo en la empresa');
  }
  return true;
};
