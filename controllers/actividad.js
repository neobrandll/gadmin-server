const db = require('../sql/db.js');
const actividadQueries = require('../sql/queries/actividad');
const ganadoQueries = require('../sql/queries/ganado');

const errorHandler = require('../util/error');
const validationHandler = require('../util/validationHandler');
const permissionHandler = require('../util/permissionHandler');

const ITEMS_PER_PAGE = 10;

exports.createParto = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.body.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      12,
      'No se tienen permisos para manipular partos'
    );
    const fe_actividad = req.body.feActividad;
    const de_actividad = req.body.deActividad;
    const id_tipo_actividad = req.body.idTipoActividad;
    const madre = req.ma_ganado;
    let padre;
    let id_toro = -1;
    let id_pajuela = -1;
    if (req.pa_ganado) {
      padre = req.pa_ganado;
      id_toro = req.pa_ganado.id_ganado;
    }
    if (req.pa_pajuela) {
      padre = req.pa_pajuela;
      id_pajuela = req.pa_pajuela.id_pajuela;
    }
    db.task(async con => {
      try {
        let id_raza;
        if (padre && madre.id_raza !== padre.id_raza) {
          const mestizoFound = await con.oneOrNone(ganadoQueries.deRazaExist, [
            'mestizo',
            id_empresa
          ]);
          if (mestizoFound) {
            id_raza = mestizoFound.id_raza;
          } else {
            const newMestizo = await con.one(ganadoQueries.createRaza, [id_empresa, 'Mestizo']);
            id_raza = newMestizo.id_raza;
          }
        } else {
          id_raza = madre.id_raza;
        }
        const actividad = await con.one(actividadQueries.createActividad, [
          id_tipo_actividad,
          de_actividad,
          fe_actividad
        ]);
        const crias = req.body.crias;
        let paramQuery =
          'INSERT into ganado ' +
          '(id_empresa ,id_raza, id_estado_ganado, fe_ganado ,id_pa_ganado ,' +
          'id_ma_ganado ,id_pa_pajuela ,fo_ganado ,id_tipo_ganado , ' +
          'pe_ganado , co_ganado ) VALUES ';
        const paramsArr = [
          id_empresa,
          id_raza,
          3,
          fe_actividad,
          id_toro,
          madre.id_ganado,
          id_pajuela,
          null
        ];
        let pCount = 9;
        const coArr = [];
        for (const cria of crias) {
          paramQuery += `($1, $2, $3, $4, $5, $6, $7,$8 ,$${pCount} ,$${pCount + 1} , $${pCount +
            2}),`;
          pCount += 3;
          paramsArr.push(cria.tipoGanado, cria.peGanado, cria.coGanado);
          coArr.push(cria.coGanado);
        }
        paramQuery = paramQuery.substring(0, paramQuery.length - 1);
        paramQuery += `; SELECT id_ganado FROM ganado WHERE id_empresa = $1 AND co_ganado IN(`;
        for (const coCria of coArr) {
          paramQuery += `$${pCount},`;
          pCount++;
          paramsArr.push(coCria);
        }
        paramQuery = paramQuery.substring(0, paramQuery.length - 1);
        paramQuery += ')';
        const idCriasArr = await con.many(paramQuery, paramsArr);
        let ag_query = 'INSERT INTO actividad_ganado (id_actividad, id_ganado) VALUES ';
        let ag_pCount = 2;
        const ag_paramArr = [actividad.id_actividad];
        for (const idCria of idCriasArr) {
          ag_query += `($1, $${ag_pCount}),`;
          ag_paramArr.push(idCria.id_ganado);
          ag_pCount++;
        }
        ag_query = ag_query.substring(0, ag_query.length - 1);
        await con.none(ag_query, ag_paramArr);
        res.status(201).json({ actividad, codigoCrias: coArr, msg: 'parto creado!' });
      } catch (err) {
        errorHandler(err, next);
      }
    });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.updateParto = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.body.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      12,
      'No se tienen permisos para manipular partos'
    );
    const fe_actividad = req.body.feActividad;
    const de_actividad = req.body.deActividad;
    const id_tipo_actividad = req.body.idTipoActividad;
    const id_actividad = req.body.idActividad;
    const madre = req.ma_ganado;
    let padre;
    let id_toro = -1;
    let id_pajuela = -1;
    if (req.pa_ganado) {
      padre = req.pa_ganado;
      id_toro = req.pa_ganado.id_ganado;
    }
    if (req.pa_pajuela) {
      padre = req.pa_pajuela;
      id_pajuela = req.pa_pajuela.id_pajuela;
    }
    let respJson = {};
    db.task(async con => {
      try {
        let id_raza;
        if (padre && madre.id_raza !== padre.id_raza) {
          const mestizoFound = await con.oneOrNone(ganadoQueries.deRazaExist, [
            'mestizo',
            id_empresa
          ]);
          if (mestizoFound) {
            id_raza = mestizoFound.id_raza;
          } else {
            const newMestizo = await con.one(ganadoQueries.createRaza, [id_empresa, 'Mestizo']);
            id_raza = newMestizo.id_raza;
          }
        } else {
          id_raza = madre.id_raza;
        }
        const updatedActividad = await con.one(actividadQueries.updateActividad, [
          id_tipo_actividad,
          de_actividad,
          fe_actividad,
          id_actividad
        ]);
        const oldCrias = await con.any(actividadQueries.getOldCrias, [id_actividad]);
        if (oldCrias.length > 0) {
          let updateOldCriasQuery =
            'UPDATE ganado SET id_raza = $1, id_ma_ganado = $2, id_pa_ganado = $3, id_pa_pajuela = $4 ' +
            'WHERE id_ganado IN(';
          let oldCriaspCount = 5;
          const oldCriasParamArr = [id_raza, madre.id_ganado, id_toro, id_pajuela];
          for (let oldCriaObj of oldCrias) {
            updateOldCriasQuery += `$${oldCriaspCount},`;
            oldCriaspCount++;
            oldCriasParamArr.push(oldCriaObj.id_ganado);
          }
          updateOldCriasQuery = updateOldCriasQuery.substring(0, updateOldCriasQuery.length - 1);
          updateOldCriasQuery += `) RETURNING *`;
          respJson.oldCrias = await con.many(updateOldCriasQuery, oldCriasParamArr);
        }
        const crias = req.body.crias;
        if (crias) {
          let paramQuery =
            'INSERT into ganado ' +
            '(id_empresa ,id_raza, id_estado_ganado, fe_ganado ,id_pa_ganado ,' +
            'id_ma_ganado ,id_pa_pajuela ,fo_ganado ,id_tipo_ganado , ' +
            'pe_ganado , co_ganado ) VALUES ';
          const paramsArr = [
            id_empresa,
            id_raza,
            3,
            fe_actividad,
            id_toro,
            madre.id_ganado,
            id_pajuela,
            null
          ];
          let pCount = 9;
          const coArr = [];
          for (const cria of crias) {
            paramQuery += `($1, $2, $3, $4, $5, $6, $7,$8 ,$${pCount} ,$${pCount + 1} , $${pCount +
              2}),`;
            pCount += 3;
            paramsArr.push(cria.tipoGanado, cria.peGanado, cria.coGanado);
            coArr.push(cria.coGanado);
          }
          paramQuery = paramQuery.substring(0, paramQuery.length - 1);
          paramQuery += `; SELECT id_ganado FROM ganado WHERE id_empresa = $1 AND co_ganado IN(`;
          for (const coCria of coArr) {
            paramQuery += `$${pCount},`;
            pCount++;
            paramsArr.push(coCria);
          }
          paramQuery = paramQuery.substring(0, paramQuery.length - 1);
          paramQuery += ')';
          const idCriasArr = await con.many(paramQuery, paramsArr);
          let ag_query = 'INSERT INTO actividad_ganado (id_actividad, id_ganado) VALUES ';
          let ag_pCount = 2;
          const ag_paramArr = [updatedActividad.id_actividad];
          for (const idCria of idCriasArr) {
            ag_query += `($1, $${ag_pCount}),`;
            ag_paramArr.push(idCria.id_ganado);
            ag_pCount++;
          }
          ag_query = ag_query.substring(0, ag_query.length - 1);
          await con.none(ag_query, ag_paramArr);
          respJson = {
            ...respJson,
            updatedActividad,
            codigoNewCrias: coArr,
            msg: 'parto actualizado!'
          };
        } else {
          respJson = { ...respJson, updatedActividad, msg: 'parto actualizado!' };
        }
        res.status(200).json(respJson);
      } catch (err) {
        errorHandler(err, next);
      }
    });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.getPartos = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.params.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      12,
      'No se tienen permisos para manipular partos'
    );
    const page = +req.query.page || 1;
    const offset = (page - 1) * ITEMS_PER_PAGE;
    let countPS =
      'SELECT COUNT(id_actividad) ' +
      'FROM(SELECT actividad.id_actividad FROM ganado cria ' +
      'LEFT JOIN ganado padre ON cria.id_pa_ganado = padre.id_ganado  ' +
      'LEFT JOIN ganado madre ON cria.id_ma_ganado = madre.id_ganado ' +
      'LEFT JOIN pajuela ON cria.id_pa_pajuela = pajuela.id_pajuela ' +
      'INNER JOIN actividad_ganado ON cria.id_ganado = actividad_ganado.id_ganado ' +
      'INNER JOIN actividad USING(id_actividad) ' +
      'WHERE cria.id_empresa = $1 AND id_tipo_actividad IN (1,2)';

    let searchPS =
      'SELECT COUNT(cria.id_ganado) nu_crias, actividad.id_actividad, actividad.fe_actividad, actividad.de_actividad, ' +
      'madre.co_ganado co_ma_ganado, pajuela.co_pajuela co_pa_pajuela, padre.co_ganado co_pa_ganado, actividad.id_tipo_actividad ' +
      ',actividad.de_actividad FROM ganado cria ' +
      'LEFT JOIN ganado padre ON cria.id_pa_ganado = padre.id_ganado ' +
      'LEFT JOIN ganado madre ON cria.id_ma_ganado = madre.id_ganado ' +
      'LEFT JOIN pajuela ON cria.id_pa_pajuela = pajuela.id_pajuela ' +
      'INNER JOIN actividad_ganado ON cria.id_ganado = actividad_ganado.id_ganado ' +
      'INNER JOIN actividad USING(id_actividad) ' +
      'WHERE cria.id_empresa = $1 AND id_tipo_actividad IN (1,2)';
    let pCount = 2;
    const paramsArr = [id_empresa];
    if (req.query.filter) {
      const filter = `%${req.query.filter}%`;
      searchPS += ` AND actividad.de_actividad ILIKE $${pCount}`;
      countPS += ` AND actividad.de_actividad ILIKE $${pCount}`;
      paramsArr.push(filter);
      pCount++;
    }
    if (req.query.coMaGanado) {
      searchPS += ` AND madre.co_ganado = $${pCount}`;
      countPS += ` AND madre.co_ganado = $${pCount}`;
      paramsArr.push(req.query.coMaGanado);
      pCount++;
    }
    if (req.query.coPaPajuela) {
      searchPS += ` AND pajuela.co_pajuela = $${pCount}`;
      countPS += ` AND pajuela.co_pajuela = $${pCount}`;
      paramsArr.push(req.query.coPaPajuela);
      pCount++;
    }
    if (req.query.idTipoActividad) {
      searchPS += ` AND actividad.id_tipo_actividad = $${pCount}`;
      countPS += ` AND actividad.id_tipo_actividad = $${pCount}`;
      paramsArr.push(req.query.idTipoActividad);
      pCount++;
    }
    if (req.query.coPaGanado) {
      searchPS += ` AND padre.co_ganado = $${pCount}`;
      countPS += ` AND padre.co_ganado = $${pCount}`;
      paramsArr.push(req.query.coPaGanado);
      pCount++;
    }
    if (req.query.dateFrom) {
      searchPS += ` AND actividad.fe_actividad >= $${pCount}`;
      countPS += ` AND actividad.fe_actividad >= $${pCount}`;
      paramsArr.push(req.query.dateFrom);
      pCount++;
    }
    if (req.query.dateTo) {
      searchPS += ` AND actividad.fe_actividad <= $${pCount}`;
      countPS += ` AND actividad.fe_actividad <= $${pCount}`;
      paramsArr.push(req.query.dateTo);
      pCount++;
    }
    searchPS +=
      'GROUP BY actividad.id_actividad, co_ma_ganado, co_pa_pajuela, co_pa_ganado, id_tipo_actividad';
    countPS += ' GROUP BY actividad.id_actividad) rs';
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

exports.getParto = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.params.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      12,
      'No se tienen permisos para manipular partos'
    );
    const id_actividad = req.params.idActividad;
    const parto = await db.many(actividadQueries.getParto, [id_empresa, id_actividad]);
    res.status(200).json({ parto });
  } catch (err) {
    errorHandler(err, next);
  }
};
