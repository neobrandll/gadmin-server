const fs = require('fs');

const db = require('../sql/db.js');
const ganadoQueries = require('../sql/queries/ganado');

const errorHandler = require('../util/error');
const validationHandler = require('../util/validationHandler');
const permissionHandler = require('../util/permissionHandler');

//PARA LOS GET DEL GANADO
const ITEMS_PER_PAGE = 1;

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
    const id_empresa = req.body.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      6,
      'No se tienen permisos para manejar ganado y/o razas'
    );
    const id_estadoGanado = req.body.idEstadoGanado,
      id_tipoGanado = req.body.tipoGanado,
      peGanado = req.body.peGanado,
      feGanado = req.body.feGanado,
      co_paGanado = req.body.coPaGanado,
      co_maGanado = req.body.coMaGanado,
      co_paPajuela = req.body.coPaPajuela,
      co_ganado = req.body.coGanado;
    let id_raza;
    if (req.id_mestizo) {
      id_raza = req.id_mestizo;
    } else {
      id_raza = req.body.idRaza;
    }
    let fotoGanado = null;
    if (req.file) {
      fotoGanado = req.file.path;
    }
    const ganado = await db.one(ganadoQueries.createGanado, [
      id_empresa,
      id_raza,
      id_estadoGanado,
      id_tipoGanado,
      peGanado,
      feGanado,
      co_paGanado,
      co_maGanado,
      co_paPajuela,
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

exports.updateGanado = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.body.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      6,
      'No se tienen permisos para manejar ganado y/o razas'
    );
    const id_estadoGanado = req.body.idEstadoGanado,
      id_tipoGanado = req.body.tipoGanado,
      peGanado = req.body.peGanado,
      feGanado = req.body.feGanado,
      co_paGanado = req.body.coPaGanado,
      co_maGanado = req.body.coMaGanado,
      co_paPajuela = req.body.coPaPajuela,
      co_ganado = req.body.coGanado;
    newCoGanado = req.body.newCoGanado;

    let id_raza;
    if (req.id_mestizo) {
      id_raza = req.id_mestizo;
    } else {
      id_raza = req.body.idRaza;
    }
    let fotoGanado = req.fo_ganado;
    if (req.file) {
      fotoGanado = req.file.path;
    }
    const updatedGanado = await db.one(ganadoQueries.updateGanado, [
      id_raza,
      id_estadoGanado,
      id_tipoGanado,
      peGanado,
      feGanado,
      co_paGanado,
      co_maGanado,
      co_paPajuela,
      fotoGanado,
      newCoGanado,
      co_ganado,
      id_empresa
    ]);
    if (req.file) {
      //aqui elimino la foto anterior del ganado, esto solamente si se actualizo
      fs.unlinkSync(req.fo_ganado);
    }
    res.status(200).json({ updatedGanado, msg: 'ganado actualizado' });
  } catch (err) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    errorHandler(err, next);
  }
};

exports.getByRaza = async (req, res, next) => {
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
    const page = +req.query.page || 1;
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const id_raza = req.params.idRaza;
    db.task(async con => {
      try {
        let totalItems = await con.one(ganadoQueries.countGetByRaza, [id_raza, id_empresa]);
        totalItems = totalItems.count;
        const rs = await con.any(ganadoQueries.getByRaza, [
          id_raza,
          id_empresa,
          offset,
          ITEMS_PER_PAGE
        ]);
        res.status(200).json({
          rs,
          currentPage: page,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
          totalItems
        });
      } catch (err) {
        errorHandler(err, next);
      }
    });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.getByEstado = async (req, res, next) => {
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
    const id_estado = req.params.idEstadoGanado;
    const page = +req.query.page || 1;
    const offset = (page - 1) * ITEMS_PER_PAGE;
    db.task(async con => {
      try {
        let totalItems = await con.one(ganadoQueries.countGetByEstado, [id_estado, id_empresa]);
        totalItems = totalItems.count;
        const rs = await con.any(ganadoQueries.getByEstado, [
          id_estado,
          id_empresa,
          offset,
          ITEMS_PER_PAGE
        ]);
        res.status(200).json({
          rs,
          currentPage: page,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
          totalItems
        });
      } catch (err) {
        errorHandler(err, next);
      }
    });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.getByTipo = async (req, res, next) => {
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
    const id_tipo = req.params.tipoGanado;
    const page = +req.query.page || 1;
    const offset = (page - 1) * ITEMS_PER_PAGE;
    db.task(async con => {
      try {
        let totalItems = await con.one(ganadoQueries.countGetByTipo, [id_tipo, id_empresa]);
        totalItems = totalItems.count;
        const rs = await con.any(ganadoQueries.getByTipo, [
          id_tipo,
          id_empresa,
          offset,
          ITEMS_PER_PAGE
        ]);
        res.status(200).json({
          rs,
          currentPage: page,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
          totalItems
        });
      } catch (err) {
        errorHandler(err, next);
      }
    });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.getGanado = async (req, res, next) => {
  try {
    validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.params.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      6,
      'No se tienen permisos para manejar ganado y/o razas'
    );
    const co_ganado = req.params.coGanado;
    db.task(async con => {
      try {
        const ganado = await db.one(ganadoQueries.getGanado, [co_ganado, id_empresa]);
        ganado.lotes = await db.any(ganadoQueries.getLotesOfGanado, [ganado.id_ganado]);
        res.status(200).json({ ganado });
      } catch (err) {
        errorHandler(err, next);
      }
    });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.getByLote = async (req, res, next) => {
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
    const id_lote = req.params.idLote;
    const page = +req.query.page || 1;
    const offset = (page - 1) * ITEMS_PER_PAGE;
    db.task(async con => {
      try {
        let totalItems = await con.one(ganadoQueries.countGetByLote, [id_lote, id_empresa]);
        totalItems = totalItems.count;
        const rs = await con.any(ganadoQueries.getByLote, [
          id_lote,
          id_empresa,
          offset,
          ITEMS_PER_PAGE
        ]);
        res.status(200).json({
          rs,
          currentPage: page,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
          totalItems
        });
      } catch (err) {
        errorHandler(err, next);
      }
    });
  } catch (err) {
    errorHandler(err, next);
  }
};
