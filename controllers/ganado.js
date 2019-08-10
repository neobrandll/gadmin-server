const fs = require('fs');

const db = require('../sql/db.js');
const ganadoQueries = require('../sql/queries/ganado');

const errorHandler = require('../util/error');
const validationHandler = require('../util/validationHandler');
const permissionHandler = require('../util/permissionHandler');

exports.PLANTILLA = async (req, res, next) => {
  try {
    await validationHandler(req);
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.getRazas = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.params.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      6,
      'No se tienen permisos para manejar ganado y/o razas'
    );
    const razas = await db.any(ganadoQueries.getRazas, [id_empresa]);
    res.status(200).json({ razas });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.createRaza = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.body.idEmpresa;
    let de_raza = req.body.deRaza.toLowerCase();
    de_raza = de_raza.replace(/^\w/, c => c.toUpperCase());
    await permissionHandler(
      id_empresa,
      id_usuario,
      6,
      'No se tienen permisos para manejar ganado y/o razas'
    );
    const raza = await db.one(ganadoQueries.createRaza, [id_empresa, de_raza]);
    res.status(201).json({ raza });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.updateRaza = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.body.idEmpresa;
    const id_raza = req.body.idRaza;
    let de_raza = req.body.deRaza.toLowerCase();
    de_raza = de_raza.replace(/^\w/, c => c.toUpperCase());
    await permissionHandler(
      id_empresa,
      id_usuario,
      6,
      'No se tienen permisos para manejar ganado y/o razas'
    );
    const updatedRaza = await db.one(ganadoQueries.updateRaza, [de_raza, id_raza, id_empresa]);
    res.status(200).json({ updatedRaza, msg: 'Raza actualizada' });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.createGanado = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.body.idEmpresa,
      id_raza = req.body.idRaza,
      id_estadoGanado = req.body.idEstadoGanado,
      id_tipoGanado = req.body.tipoGanado,
      peGanado = req.body.peGanado,
      feGanado = req.body.feGanado,
      id_paGanado = req.body.idPaGanado,
      id_maGanado = req.body.idMaGanado,
      id_paPajuela = req.body.idPaPajuela,
      co_ganado = req.body.coGanado;
    let fotoGanado = null;
    if (req.file) {
      fotoGanado = req.file.path;
    }
    await permissionHandler(
      id_empresa,
      id_usuario,
      6,
      'No se tienen permisos para manejar ganado y/o razas'
    );
    const ganado = await db.one(ganadoQueries.createGanado, [
      id_empresa,
      id_raza,
      id_estadoGanado,
      id_tipoGanado,
      peGanado,
      feGanado,
      id_paGanado,
      id_maGanado,
      id_paPajuela,
      co_ganado,
      fotoGanado
    ]);
    res.status(201).json({ ganado, msg: 'ganado creado' });
  } catch (err) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    errorHandler(err, next);
  }
};

//GET GANADO
//UPDATE GANADO
// //GET GANADOS BY RAZA
// BY ESTADO
// BY TIPO
