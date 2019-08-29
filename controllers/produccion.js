const db = require('../sql/db.js');
const produccionQueries = require('../sql/queries/produccion');

const errorHandler = require('../util/error');
const validationHandler = require('../util/validationHandler');
const permissionHandler = require('../util/permissionHandler');

const ITEMS_PER_PAGE = 1000;

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

exports.delete = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.params.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      11,
      'No se tienen permisos para manipular el modulo de Produccion'
    );
    const id_produccion = req.params.idProduccion;
    await db.none(produccionQueries.deleteProduccion, [id_produccion, id_empresa]);
    res.status(200).json({ msg: 'Produccion eliminada' });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.getProduccion = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.params.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      11,
      'No se tienen permisos para manipular el modulo de Produccion'
    );
    const page = +req.query.page || 1;
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const producto =
      req.params.producto === 'leche' ? 'id_tipo_produccion IN (1,2)' : 'id_tipo_produccion = 3';
    let countPS =
      'SELECT COUNT(id_produccion) FROM produccion WHERE id_empresa = $1 AND ' + producto;
    let searchPS =
      'SELECT produccion.*, de_tipo_produccion FROM produccion INNER JOIN tipo_produccion USING(id_tipo_produccion) WHERE id_empresa = $1 AND ' +
      producto;
    let pCount = 2;
    const paramsArr = [id_empresa];
    if (req.query.idTipoProduccion) {
      searchPS += ` AND id_tipo_produccion = $${pCount}`;
      countPS += ` AND id_tipo_produccion = $${pCount}`;
      paramsArr.push(req.query.idTipoProduccion);
      pCount++;
    }
    if (req.query.dateFrom) {
      searchPS += ` AND fe_produccion >= $${pCount}`;
      countPS += ` AND fe_produccion>= $${pCount}`;
      paramsArr.push(req.query.dateFrom);
      pCount++;
    }
    if (req.query.dateTo) {
      searchPS += ` AND fe_produccion <= $${pCount}`;
      countPS += ` AND fe_produccion <= $${pCount}`;
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

exports.getProduccionTotal = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.params.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      11,
      'No se tienen permisos para manipular el modulo de Produccion'
    );
    const producto =
      req.params.producto === 'leche' ? 'id_tipo_produccion IN (1,2)' : 'id_tipo_produccion = 3';
    let searchPS =
      'SELECT ROUND(SUM(ca_produccion)::numeric,2) AS sum, ROUND(AVG(ca_produccion)::numeric ,2) AS avg FROM produccion WHERE id_empresa = $1 AND ' +
      producto;
    let pCount = 2;
    const paramsArr = [id_empresa];
    if (req.query.idTipoProduccion) {
      searchPS += ` AND id_tipo_produccion = $${pCount}`;
      paramsArr.push(req.query.idTipoProduccion);
      pCount++;
    }
    if (req.query.dateFrom) {
      searchPS += ` AND fe_produccion >= $${pCount}`;
      paramsArr.push(req.query.dateFrom);
      pCount++;
    }
    if (req.query.dateTo) {
      searchPS += ` AND fe_produccion <= $${pCount}`;
      paramsArr.push(req.query.dateTo);
      pCount++;
    }
    const rs = await db.any(searchPS, paramsArr);
    res.status(200).json({
      rs
    });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.getPesaje = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.params.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      11,
      'No se tienen permisos para manipular el modulo de Produccion'
    );
    const page = +req.query.page || 1;
    const offset = (page - 1) * ITEMS_PER_PAGE;
    let countPS =
      'SELECT COUNT(id_produccion) FROM produccion INNER JOIN produccion_ganado USING(id_produccion) WHERE id_empresa = $1 AND id_tipo_produccion IN (4, 5)';
    let searchPS =
      'SELECT produccion.*, de_tipo_produccion, ganado.co_ganado FROM produccion INNER JOIN tipo_produccion USING(id_tipo_produccion)' +
      ' INNER JOIN produccion_ganado USING(id_produccion) INNER JOIN ganado USING(id_ganado) WHERE produccion.id_empresa = $1 AND id_tipo_produccion IN (4, 5)';
    let pCount = 2;
    const paramsArr = [id_empresa];
    if (req.query.idTipoProduccion) {
      searchPS += ` AND id_tipo_produccion = $${pCount}`;
      countPS += ` AND id_tipo_produccion = $${pCount}`;
      paramsArr.push(req.query.idTipoProduccion);
      pCount++;
    }
    if (req.query.coGanado) {
      searchPS += ` AND id_ganado = $${pCount}`;
      countPS += ` AND id_ganado = $${pCount}`;
      paramsArr.push(req.id_ganado);
      pCount++;
    }
    if (req.query.dateFrom) {
      searchPS += ` AND fe_produccion >= $${pCount}`;
      countPS += ` AND fe_produccion >= $${pCount}`;
      paramsArr.push(req.query.dateFrom);
      pCount++;
    }
    if (req.query.dateTo) {
      searchPS += ` AND fe_produccion <= $${pCount}`;
      countPS += ` AND fe_produccion <= $${pCount}`;
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

exports.getPesajeCount = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.params.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      11,
      'No se tienen permisos para manipular el modulo de Produccion'
    );

    let searchPS =
      'SELECT ROUND(AVG(ca_produccion)::numeric, 2) FROM produccion ' +
      ' INNER JOIN produccion_ganado USING(id_produccion) WHERE produccion.id_empresa = $1 AND id_tipo_produccion IN (4, 5)';
    let pCount = 2;
    const paramsArr = [id_empresa];
    if (req.query.idTipoProduccion) {
      searchPS += ` AND id_tipo_produccion = $${pCount}`;
      paramsArr.push(req.query.idTipoProduccion);
      pCount++;
    }
    if (req.query.coGanado) {
      searchPS += ` AND id_ganado = $${pCount}`;
      paramsArr.push(req.id_ganado);
      pCount++;
    }
    if (req.query.dateFrom) {
      searchPS += ` AND fe_produccion >= $${pCount}`;
      paramsArr.push(req.query.dateFrom);
      pCount++;
    }
    if (req.query.dateTo) {
      searchPS += ` AND fe_produccion <= $${pCount}`;
      paramsArr.push(req.query.dateTo);
      pCount++;
    }
    const rs = await db.any(searchPS, paramsArr);
    res.status(200).json({
      rs
    });
  } catch (err) {
    errorHandler(err, next);
  }
};
