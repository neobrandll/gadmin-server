const actividadQueries = require('../../sql/queries/actividad.js');
const db = require('../../sql/db');
const ganadoQueries = require('../../sql/queries/ganado');
const validator = require('validator');

exports.coMaGanado = async (codigo, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const ganadoFound = await db.oneOrNone(ganadoQueries.codigoExist, [codigo, id_empresa]);
  if (!ganadoFound) {
    throw new Error('no existe ningun ganado con el codigo ingresado en la empresa');
  }
  if (ganadoFound.id_tipo_ganado !== 2) {
    throw new Error('La madre debe de ser hembra');
  }
  req.ma_ganado = ganadoFound;
  return true;
};

exports.coPaGanado = async (codigo, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const ganadoFound = await db.oneOrNone(ganadoQueries.codigoExist, [codigo, id_empresa]);
  if (!ganadoFound) {
    throw new Error('no existe ningun ganado con el codigo ingresado en la empresa');
  }
  if (ganadoFound.id_tipo_ganado !== 1) {
    throw new Error('el padre debe de ser macho');
  }
  req.pa_ganado = ganadoFound;
  return true;
};

exports.coPajuela = async (codigo, { req }) => {
  if (req.body.coPaGanado) {
    throw new Error('el ganado solo puede tener un padre, toro o pajuela');
  }
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const pajuelaFound = await db.oneOrNone(ganadoQueries.pajuelaExist, [codigo, id_empresa]);
  if (!pajuelaFound) {
    throw new Error('no existe ninguna pajuela con el codigo ingresado en la empresa');
  }
  req.pa_pajuela = pajuelaFound;
  return true;
};

exports.crias = async (criasArr, { req }) => {
  const id_empresa = req.body.idEmpresa;
  if (!Array.isArray(criasArr)) {
    throw new Error('El valor ingresado no es un Array');
  }
  if (!criasArr.length > 0) {
    throw new Error('Se necesita al menos una cria para registrar el parto');
  }
  let paramQuery = 'SELECT id_ganado FROM ganado WHERE id_empresa = $1 AND co_ganado IN(';
  let pCount = 2;
  const paramsArr = [id_empresa];
  const coArr = [];
  for (const cria of criasArr) {
    if (coArr.includes(cria.coGanado)) {
      throw new Error(
        'El codigo de ganado debe de ser unico y una cria repite el mismo codigo de otra'
      );
    }
    if (!cria.tipoGanado || !validator.isIn(cria.tipoGanado.toString(), ['1', '2'])) {
      throw new Error('una de las crias ingresadas tiene el tipo de ganado incorrecto o nulo');
    }
    if (!cria.peGanado || !validator.isFloat(cria.peGanado.toString())) {
      throw new Error('el peso de las crias debe ser un numero');
    }
    if (!cria.coGanado || !validator.isInt(cria.coGanado.toString())) {
      throw new Error('una de los codigos de las crias no es entero');
    }
    paramQuery += `$${pCount},`;
    paramsArr.push(cria.coGanado);
    coArr.push(cria.coGanado);
    pCount++;
  }
  paramQuery = paramQuery.substring(0, paramQuery.length - 1);
  paramQuery += ')';
  const rs = await db.any(paramQuery, paramsArr);
  if (rs.length > 0) {
    throw new Error('una de los codigos de las crias ya esta en uso');
  }
  return true;
};

exports.idTipoParto = async (id, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  if (id === '1' && req.body.coPaPajuela) {
    throw new Error('el tipo de id es parto natural y se ingreso una pajuela');
  }
  if (id === '2' && req.body.coPaGanado) {
    throw new Error('el tipo de id es parto pajuela y se ingreso el codigo de un toro');
  }
  return true;
};
