const db = require('../sql/db.js');
const produccionQueries = require('../sql/queries/produccion');
const PS = require('pg-promise').PreparedStatement;

const errorHandler = require('../util/error');
const validationHandler = require('../util/validationHandler');
const permissionHandler = require('../util/permissionHandler');

const ITEMS_PER_PAGE = 15;

exports.createProduccion = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.body.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      11,
      'No se tienen permisos para manipular el modulo de Produccion'
    );
    const ca_produccion = req.body.caProduccion;
    const id_tipo_produccion = req.body.idTipoProduccion;
    let id_unidad;
    if (+id_tipo_produccion === 1 || +id_tipo_produccion === 2) {
      id_unidad = 2;
    } else {
      id_unidad = 1;
    }
    const fe_produccion = req.body.feProduccion;
    const produccion = await db.one(produccionQueries.createProduccion, [
      id_tipo_produccion,
      id_unidad,
      id_empresa,
      fe_produccion,
      ca_produccion
    ]);
    res.status(201).json({ produccion, msg: 'Produccion creada' });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.updateProduccion = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.body.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      11,
      'No se tienen permisos para manipular el modulo de Produccion'
    );
    const ca_produccion = req.body.caProduccion;
    const id_tipo_produccion = req.body.idTipoProduccion;
    let id_unidad;
    if (+id_tipo_produccion === 1 || +id_tipo_produccion === 2) {
      id_unidad = 2;
    } else {
      id_unidad = 1;
    }
    const fe_produccion = req.body.feProduccion;
    const id_produccion = req.body.idProduccion;
    const updatedProduccion = await db.one(produccionQueries.updateProduccion, [
      id_tipo_produccion,
      id_unidad,
      id_empresa,
      fe_produccion,
      ca_produccion,
      id_produccion,
      id_empresa
    ]);
    res.status(200).json({ updatedProduccion, msg: 'Produccion actualizada' });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.createPesaje = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.body.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      11,
      'No se tienen permisos para manipular el modulo de Produccion'
    );
    const ca_produccion = req.body.caProduccion;
    const id_tipo_produccion = req.body.idTipoProduccion;
    const id_unidad = 1;
    const fe_produccion = req.body.feProduccion;
    const co_ganado = req.body.coGanado;
    db.task(async con => {
      try {
        const produccion = await db.one(produccionQueries.createProduccion, [
          id_tipo_produccion,
          id_unidad,
          id_empresa,
          fe_produccion,
          ca_produccion
        ]);
        await db.none(produccionQueries.addGanadoToPesaje, [
          produccion.id_produccion,
          req.id_ganado
        ]);
        res.status(201).json({ produccion, codigoGanado: co_ganado, msg: 'Pesaje creado' });
      } catch (err) {
        errorHandler(err, next);
      }
    });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.updatePesaje = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.body.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      11,
      'No se tienen permisos para manipular el modulo de Produccion'
    );
    const co_ganado = req.body.coGanado;
    const ca_produccion = req.body.caProduccion;
    const id_tipo_produccion = req.body.idTipoProduccion;
    const id_unidad = 1;
    const fe_produccion = req.body.feProduccion;
    const id_produccion = req.body.idProduccion;
    const oldIdGanado = req.pesaje.id_ganado;
    const newIdGanado = req.id_ganado;
    db.task(async con => {
      try {
        const updatedProduccion = await con.one(produccionQueries.updateProduccion, [
          id_tipo_produccion,
          id_unidad,
          fe_produccion,
          ca_produccion,
          id_produccion,
          id_empresa
        ]);
        if (oldIdGanado !== newIdGanado) {
          await db.none(produccionQueries.removeGanadoFromPesaje, [id_produccion, oldIdGanado]);
          await db.none(produccionQueries.addGanadoToPesaje, [id_produccion, newIdGanado]);
        }
        res
          .status(200)
          .json({ updatedProduccion, codigoGanado: co_ganado, msg: 'Pesaje actualizado' });
      } catch (err) {
        errorHandler(err, next);
      }
    });
  } catch (err) {
    errorHandler(err, next);
  }
};
