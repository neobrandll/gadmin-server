const fs = require('fs');

const db = require('../sql/db.js');
const ganadoQueries = require('../sql/queries/ganado');

const errorHandler = require('../util/error');
const validationHandler = require('../util/validationHandler');
const permissionHandler = require('../util/permissionHandler');

//PARA LOS GET DEL GANADO
const ITEMS_PER_PAGE = 5;

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
    let filter = '%%';
    if (req.query.filter) {
      filter = `%${req.query.filter}%`;
    }
    const razas = await db.any(ganadoQueries.getRazas, [filter, id_empresa]);
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
      id_paGanado = req.id_pa_ganado,
      id_maGanado = req.id_ma_ganado,
      id_paPajuela = req.id_pa_pajuela,
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
      id_paGanado = req.id_pa_ganado,
      id_maGanado = req.id_ma_ganado,
      id_paPajuela = req.id_pa_pajuela,
      co_ganado = req.body.coGanado,
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
      id_paGanado,
      id_maGanado,
      id_paPajuela,
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

exports.searchGanado = async (req, res, next) => {
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
    let countPS = 'SELECT COUNT(id_ganado) FROM ganado WHERE id_empresa = $1';
    let searchPS = 'SELECT id_ganado, co_ganado, fo_ganado FROM ganado WHERE id_empresa = $1';
    let pCount = 2;
    const paramsArr = [id_empresa];
    if (req.query.idRaza) {
      searchPS += ` AND id_raza = $${pCount}`;
      countPS += ` AND id_raza = $${pCount}`;
      paramsArr.push(req.query.idRaza);
      pCount++;
    }
    if (req.query.idLote) {
      searchPS += ` AND id_lote = $${pCount}`;
      countPS += ` AND id_lote = $${pCount}`;
      paramsArr.push(req.query.idLote);
      pCount++;
    }
    if (req.query.idEstadoGanado) {
      searchPS += ` AND id_estado_ganado = $${pCount}`;
      countPS += ` AND id_estado_ganado = $${pCount}`;
      paramsArr.push(req.query.idEstadoGanado);
      pCount++;
    }
    if (req.query.tipoGanado) {
      searchPS += ` AND id_tipo_ganado = $${pCount}`;
      countPS += ` AND id_tipo_ganado = $${pCount}`;
      paramsArr.push(req.query.tipoGanado);
      pCount++;
    }
    if (req.query.dateFrom) {
      searchPS += ` AND fe_ganado >= $${pCount}`;
      countPS += ` AND fe_ganado >= $${pCount}`;
      paramsArr.push(req.query.dateFrom);
      pCount++;
    }
    if (req.query.dateTo) {
      searchPS += ` AND fe_ganado <= $${pCount}`;
      countPS += ` AND fe_ganado <= $${pCount}`;
      paramsArr.push(req.query.dateTo);
      pCount++;
    }
    searchPS += ` OFFSET $${pCount} LIMIT $${pCount + 1}`;
    db.task(async con => {
      try {
        let totalItems = await con.one(countPS, paramsArr);
        totalItems = totalItems.count;
        const rs = await con.any(searchPS, [...paramsArr, offset, ITEMS_PER_PAGE]);
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
