const db = require('../../sql/db');

const potreroQueries = require('../../sql/queries/potrero');

exports.dePastoAvailable = async (dePasto, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const dePastoFound = await db.oneOrNone(potreroQueries.dePastoAvailable, [dePasto, id_empresa]);
  if (dePastoFound) {
    if (req.body.idPasto && +req.body.idPasto === dePastoFound.id_pasto) {
      return true;
    }
    throw new Error('Ya existe un tipo de pasto con la descripcion ingresada');
  }
  return true;
};

exports.dePotreroAvailable = async (dePotrero, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const dePotreroFound = await db.oneOrNone(potreroQueries.dePotreroAvailable, [
    dePotrero,
    id_empresa
  ]);
  if (dePotreroFound) {
    if (req.body.idPotrero && +req.body.idPotrero === dePotreroFound.id_potrero) {
      return true;
    }
    throw new Error('Ya existe un potrero en la empresa con la descripcion ingresada');
  }
  return true;
};

exports.pastoExist = async (idPasto, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const pastoFound = await db.oneOrNone(potreroQueries.pastoExist, [idPasto, id_empresa]);
  if (!pastoFound) {
    throw new Error('No existe un tipo de pasto con el id ingresado en la empresa seleccionada');
  }
  return true;
};

exports.potreroExist = async (idPotrero, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const potreroFound = await db.oneOrNone(potreroQueries.potreroExist, [idPotrero, id_empresa]);
  if (!potreroFound) {
    throw new Error('No existe un tipo de pasto con el id ingresado en la empresa seleccionada');
  }
  return true;
};
