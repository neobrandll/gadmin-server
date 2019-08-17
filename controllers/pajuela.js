const db = require('../sql/db.js');
const pajuelaQueries = require('../sql/queries/pajuela');

const errorHandler = require('../util/error');
const validationHandler = require('../util/validationHandler');
const permissionHandler = require('../util/permissionHandler');

const ITEMS_PER_PAGE = 20;

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

exports.createPajuela = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.body.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      9,
      'No se tienen permisos para manipular el modulo de pajuela'
    );
    const co_pajuela = req.body.coPajuela;
    const de_pajuela = req.body.dePajuela;
    const fe_pajuela = req.body.fePajuela;
    let id_raza;
    if (req.id_mestizo) {
      id_raza = req.id_mestizo;
    } else {
      id_raza = req.body.idRaza;
    }
    const pajuela = await db.one(pajuelaQueries.createPajuela, [
      id_raza,
      id_empresa,
      fe_pajuela,
      de_pajuela,
      co_pajuela
    ]);
    res.status(201).json({ pajuela, msg: 'pajuela creada' });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.updatePajuela = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.body.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      9,
      'No se tienen permisos para manipular el modulo de pajuela'
    );
    const co_pajuela = req.body.coPajuela;
    const newCopajuela = req.body.newCoPajuela;
    const de_pajuela = req.body.dePajuela.toLowerCase();
    const fe_pajuela = req.body.fePajuela;
    let id_raza;
    if (req.id_mestizo) {
      id_raza = req.id_mestizo;
    } else {
      id_raza = req.body.idRaza;
    }
    const updatedPajuela = await db.one(pajuelaQueries.updatePajuela, [
      id_raza,
      id_empresa,
      fe_pajuela,
      de_pajuela,
      newCopajuela,
      co_pajuela,
      id_empresa
    ]);
    res.status(200).json({ updatedPajuela, msg: 'pajuela actualizada' });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.getPajuelas = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.params.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      9,
      'No se tienen permisos para manipular el modulo de pajuela'
    );
    const page = +req.query.page || 1;
    const offset = (page - 1) * ITEMS_PER_PAGE;
    let countPS = 'SELECT COUNT(id_pajuela) FROM pajuela WHERE id_empresa = $1';
    let searchPS =
      'SELECT pajuela.*, de_raza FROM pajuela INNER JOIN raza USING(id_raza) WHERE pajuela.id_empresa = $1';
    let pCount = 2;
    const paramsArr = [id_empresa];
    if (req.query.idRaza) {
      searchPS += ` AND id_raza = $${pCount}`;
      countPS += ` AND id_raza = $${pCount}`;
      paramsArr.push(req.query.idRaza);
      pCount++;
    }

    if (req.query.dateFrom) {
      searchPS += ` AND fe_pajuela >= $${pCount}`;
      countPS += ` AND fe_pajuela >= $${pCount}`;
      paramsArr.push(req.query.dateFrom);
      pCount++;
    }
    if (req.query.dateTo) {
      searchPS += ` AND fe_pajuela <= $${pCount}`;
      countPS += ` AND fe_pajuela <= $${pCount}`;
      paramsArr.push(req.query.dateTo);
      pCount++;
    }
    if (req.query.filter) {
      const filter = `%${req.query.filter}%`;
      searchPS += ` AND de_pajuela ILIKE $${pCount}`;
      countPS += ` AND de_pajuela ILIKE $${pCount}`;
      paramsArr.push(filter);
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
