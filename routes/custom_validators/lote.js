const db = require('../../sql/db');

const loteQueries = require('../../sql/queries/lote');

exports.loteExist = async (id_lote, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const loteFound = await db.oneOrNone(loteQueries.loteExist, [id_lote, id_empresa]);
  if (!loteFound) {
    throw new Error('No existe un lote con el id ingresado en la empresa seleccionada');
  }
  return true;
};

exports.deLoteAvailable = async (deLote, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const deLoteFound = await db.oneOrNone(loteQueries.deLoteAvailable, [deLote, id_empresa]);
  if (deLoteFound) {
    throw new Error('Ya existe un lote con la descripcion ingresada');
  }
  return true;
};
