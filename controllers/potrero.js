const db = require('../sql/db.js');
const potreroQueries = require('../sql/queries/potrero');

const errorHandler = require('../util/error');
const validationHandler = require('../util/validationHandler');
const permissionHandler = require('../util/permissionHandler');

exports.PLANTILLA = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.body.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      8,
      'No se tienen permisos para manipular el modulo de potrero'
    );
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.createPasto = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.body.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      8,
      'No se tienen permisos para manipular el modulo de potrero'
    );
    const de_pasto = req.body.dePasto;
    const pasto = await db.one(potreroQueries.createPasto, [de_pasto, id_empresa]);
    res.status(201).json({ pasto, msg: 'tipo de pasto creado' });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.updatePasto = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.body.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      8,
      'No se tienen permisos para manipular el modulo de potrero'
    );
    const id_pasto = req.body.idPasto;
    const de_pasto = req.body.dePasto;
    const updatedPasto = await db.one(potreroQueries.updatePasto, [de_pasto, id_pasto, id_empresa]);
    res.status(200).json({ updatedPasto, msg: 'tipo de pasto actualizado!' });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.getPastos = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.params.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      8,
      'No se tienen permisos para manipular el modulo de potrero'
    );
    let filter = '%%';
    if (req.query.filter) {
      filter = `%${req.query.filter}%`;
    }
    const pastos = await db.any(potreroQueries.getPastos, [filter, id_empresa]);
    res.status(200).json({ pastos });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.createPotrero = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.body.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      8,
      'No se tienen permisos para manipular el modulo de potrero'
    );
    const de_potrero = req.body.dePotrero;
    const id_pasto = req.body.idPasto;
    const potrero = await db.one(potreroQueries.createPotrero, [de_potrero, id_pasto]);
    res.status(201).json({ potrero, msg: 'potrero creado' });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.updatePotrero = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.body.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      8,
      'No se tienen permisos para manipular el modulo de potrero'
    );
    const id_potrero = req.body.idPotrero;
    const de_potrero = req.body.dePotrero;
    const id_pasto = req.body.idPasto;
    const updatedPotrero = await db.one(potreroQueries.updatePotrero, [
      de_potrero,
      id_pasto,
      id_potrero
    ]);
    res.status(200).json({ updatedPotrero, msg: 'potrero actualizado' });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.getPotreros = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.params.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      8,
      'No se tienen permisos para manipular el modulo de potrero'
    );
    let filter = '%%';
    if (req.query.filter) {
      filter = `%${req.query.filter}%`;
    }
    let potreros;
    if (req.query.idPasto) {
      potreros = await db.any(potreroQueries.getPotrerosWithPasto, [
        filter,
        req.query.idPasto,
        id_empresa
      ]);
    } else {
      potreros = await db.any(potreroQueries.getPotreros, [filter, id_empresa]);
    }
    res.status(200).json({ potreros });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.deletePotrero = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.params.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      8,
      'No se tienen permisos para manipular el modulo de potrero'
    );
    const id_potrero = req.params.idPotrero;
    await db.none(potreroQueries.deletePotrero, [id_potrero]);
    res.status(200).json({ msg: 'potrero eliminado' });
  } catch (err) {
    errorHandler(err, next);
  }
};

//crud potrero
