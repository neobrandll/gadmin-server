const db = require('../../sql/db.js');
const itemQueries = require('../../sql/queries/item');

exports.deItemAvailable = async (deItem, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const deItemFound = await db.oneOrNone(itemQueries.deItemAvailable, [deItem, id_empresa]);
  if (deItemFound) {
    if (req.body.idItem && +req.body.idItem === deItemFound.id_item) {
      return true;
    }
    throw new Error('Ya existe un item con la descripcion ingresada en la empresa');
  }
  return true;
};

exports.itemExist = async (idItem, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const itemFound = await db.oneOrNone(itemQueries.itemExist, [idItem, id_empresa]);
  if (!itemFound) {
    throw new Error('No existe un item con el id ingresado en la empresa');
  }
  return true;
};
