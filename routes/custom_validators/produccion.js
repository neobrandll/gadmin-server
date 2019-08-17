const db = require('../../sql/db');
const produccionQueries = require('../../sql/queries/produccion.js');

exports.produccionDateAvailable = async (feProduccion, { req }) => {
  const id_empresa = req.body.idEmpresa;
  const id_tipo_produccion = req.body.idTipoProduccion;
  const produccionFound = await db.oneOrNone(produccionQueries.produccionDateAvailable, [
    feProduccion,
    id_tipo_produccion,
    id_empresa
  ]);
  if (produccionFound) {
    if (req.body.idProduccion && produccionFound.id_produccion === +req.body.idProduccion) {
      return true;
    }
    throw new Error('El tipo de produccion ingresado solo permite una produccion por dia');
  }
  return true;
};

exports.pesajeDateAvailable = async (feProduccion, { req }) => {
  const id_empresa = req.body.idEmpresa;
  const co_ganado = req.body.coGanado;
  const id_tipo_produccion = req.body.idTipoProduccion;
  const produccionFound = await db.oneOrNone(produccionQueries.pesajeDateAvailable, [
    feProduccion,
    id_tipo_produccion,
    id_empresa,
    co_ganado
  ]);
  console.log(feProduccion, id_tipo_produccion, id_empresa, co_ganado);
  if (produccionFound) {
    if (req.body.idProduccion && produccionFound.id_produccion === +req.body.idProduccion) {
      return true;
    }
    throw new Error('El tipo de produccion ingresado solo permite un pesaje por turno');
  }
  return true;
};

exports.produccionExist = async (idProduccion, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const produccionFound = await db.oneOrNone(produccionQueries.produccionExist, [
    idProduccion,
    id_empresa
  ]);
  if (!produccionFound) {
    throw new Error('No existe ninguna produccion con el id ingresado en la empresa');
  }
  if (produccionFound) {
    if (![1, 2, 3].includes(produccionFound.id_tipo_produccion)) {
      throw new Error('id ingresado es de un pesaje no de una produccion de leche o queso');
    }
  }
  return true;
};

exports.pesajeExist = async (idProduccion, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const produccionFound = await db.oneOrNone(produccionQueries.pesajeExist, [
    idProduccion,
    id_empresa
  ]);
  if (!produccionFound) {
    throw new Error('No existe ningun pesaje con el id ingresado en la empresa');
  }
  if (produccionFound) {
    if (![4, 5].includes(produccionFound.id_tipo_produccion)) {
      throw new Error('id ingresado es de un produccion de leche o queso, no el de un pesaje');
    }
    if (!produccionFound.id_ganado) {
      throw new Error('El pesaje seleccionado no posee ganado');
    }
  }
  req.pesaje = produccionFound;
  return true;
};

exports.exist = async (idProduccion, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const produccionFound = await db.oneOrNone(produccionQueries.produccionExist, [
    idProduccion,
    id_empresa
  ]);
  if (!produccionFound) {
    throw new Error('No existe ningun pesaje con el id ingresado en la empresa');
  }
  return true;
};
