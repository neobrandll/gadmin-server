const db = require('../sql/db.js');
const adminQueries = require('../sql/queries/admin');

const permissionHandler = async (id_empresa, id_usuario, id_permiso, errMsg) => {
  const permission = await db.manyOrNone(adminQueries.searchPermission, [
    id_usuario,
    id_permiso,
    id_empresa
  ]);
  if (!permission.length > 0) {
    const err = new Error(errMsg);
    err.statusCode = 401;
    throw err;
  }
};

module.exports = permissionHandler;
