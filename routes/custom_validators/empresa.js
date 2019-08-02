const authQueries = require('../../sql/queries/auth');
const empresaQueries = require('../../sql/queries/empresa');
const db = require('../../sql/db');

exports.rifExist = async rif => {
  const foundRif = await db.oneOrNone(empresaQueries.rifExist, [rif]);
  if (foundRif) {
    throw new Error('El rif ingresado ya esta en uso.');
  }
  return true;
};

exports.updateRif = async (newRif, { req }) => {
  const empresa = await db.oneOrNone(empresaQueries.getEmpresa, [req.body.idEmpresa]);
  if (!empresa) {
    throw new Error('No existe una empresa con el id ingresado');
  }
  if (newRif === empresa.ri_empresa) {
    return true;
  }
  const foundRif = await db.oneOrNone(empresaQueries.rifExist, [newRif]);
  if (foundRif) {
    throw new Error('El rif ingresado ya esta en uso.');
  }
  return true;
};
