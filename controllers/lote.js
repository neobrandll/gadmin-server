const db = require('../sql/db.js');
const loteQueries = require('../sql/queries/lote');

const errorHandler = require('../util/error');
const validationHandler = require('../util/validationHandler');
const permissionHandler = require('../util/permissionHandler');

exports.createLote = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.body.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      7,
      'No se tienen permisos para manipular el modulo lote'
    );
    const de_lote = req.body.deLote.toLowerCase();
    const lote = await db.one(loteQueries.createLote, [de_lote, id_empresa]);
    res.status(201).json({ lote, msg: 'Lote creado' });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.updateLote = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.body.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      7,
      'No se tienen permisos para manipular el modulo lote'
    );
    const id_lote = req.body.idLote;
    const de_lote = req.body.deLote.toLowerCase();
    const updatedlote = await db.one(loteQueries.updateLote, [de_lote, id_empresa, id_lote]);
    res.status(201).json({ updatedlote, msg: 'Lote actualizado' });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.deleteLote = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.params.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      7,
      'No se tienen permisos para manipular el modulo lote'
    );
    const id_lote = req.params.idLote;
    await db.none(loteQueries.deleteLote, [id_lote, id_empresa]);
    res.status(200).json({ msg: 'lote eliminado!' });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.getLotes = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.params.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      7,
      'No se tienen permisos para manipular el modulo lote'
    );
    let filter = '%%';
    if (req.query.filter) {
      filter = `%${req.query.filter}%`;
    }
    const lotes = await db.any(loteQueries.getLotes, [filter, id_empresa]);
    res.status(200).json({ lotes });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.addGanadoToLote = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.body.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      7,
      'No se tienen permisos para manipular el modulo lote'
    );
    const co_ganado = req.body.coGanado;
    const id_lote = req.body.idLote;
    await db.none(loteQueries.addGanadoToLote, [id_lote, co_ganado, id_empresa]);
    res.status(201).json({ msg: 'Ganado agregado al lote' });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.removeGanadoFromLote = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.params.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      7,
      'No se tienen permisos para manipular el modulo lote'
    );
    const co_ganado = req.params.coGanado;
    const id_lote = req.params.idLote;
    await db.none(loteQueries.removeGanadoFromLote, [id_lote, co_ganado, id_empresa]);
    res.status(200).json({ msg: 'Ganado removido del lote' });
  } catch (err) {
    errorHandler(err, next);
  }
};

//remove y add ganado
//
