const db = require('../sql/db.js');
const itemQueries = require('../sql/queries/item');

const errorHandler = require('../util/error');
const validationHandler = require('../util/validationHandler');
const permissionHandler = require('../util/permissionHandler');

const ITEMS_PER_PAGE = 10;

exports.createItem = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.body.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      10,
      'No se tienen permisos para manipular el modulo de Item'
    );
    const ca_item = req.body.caItem;
    const de_item = req.body.deItem;
    const id_tipo_item = req.body.idTipoItem;
    const item = await db.one(itemQueries.createItem, [de_item, ca_item, id_tipo_item, id_empresa]);
    res.status(201).json({ item, msg: 'item creado' });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.body.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      10,
      'No se tienen permisos para manipular el modulo de Item'
    );
    const ca_item = req.body.caItem;
    const de_item = req.body.deItem;
    const id_tipo_item = req.body.idTipoItem;
    const id_item = req.body.idItem;
    const updatedItem = await db.one(itemQueries.updateItem, [
      de_item,
      ca_item,
      id_tipo_item,
      id_item,
      id_empresa
    ]);
    res.status(200).json({ updatedItem, msg: 'item actualizado!' });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.params.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      10,
      'No se tienen permisos para manipular el modulo de Item'
    );
    const id_item = req.params.idItem;
    await db.none(itemQueries.deleteItem, [id_item, id_empresa]);
    res.status(200).json({ msg: 'item eliminado!' });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.getItems = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.params.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      10,
      'No se tienen permisos para manipular el modulo de Item'
    );
    const page = +req.query.page || 1;
    const offset = (page - 1) * ITEMS_PER_PAGE;
    let countPS = 'SELECT COUNT(id_item) FROM item WHERE id_empresa = $1';
    let searchPS =
      'SELECT item.*, de_tipo_item FROM item INNER JOIN tipo_item USING(id_tipo_item) WHERE id_empresa = $1';
    let pCount = 2;
    const paramsArr = [id_empresa];
    if (req.query.idTipoItem) {
      searchPS += ` AND id_tipo_item = $${pCount}`;
      countPS += ` AND id_tipo_item = $${pCount}`;
      paramsArr.push(req.query.idTipoItem);
      pCount++;
    }

    if (req.query.filter) {
      const filter = `%${req.query.filter}%`;
      searchPS += ` AND de_item ILIKE $${pCount}`;
      countPS += ` AND de_item ILIKE $${pCount}`;
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
