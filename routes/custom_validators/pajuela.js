const db = require('../../sql/db');

const pajuelaQueries = require('../../sql/queries/pajuela');

exports.coPajuelaAvailable = async (coPajuela, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const pajuelaFound = await db.oneOrNone(pajuelaQueries.findCoPajuela, [coPajuela, id_empresa]);
  if (pajuelaFound) {
    if (req.body.coPajuela && pajuelaFound.co_pajuela === +req.body.coPajuela) {
      return true;
    }
    throw new Error('El codigo de pajuela ingresado ya existe en la empresa');
  }
  return true;
};

exports.coPajuelaExist = async (coPajuela, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const pajuelaFound = await db.oneOrNone(pajuelaQueries.findCoPajuela, [coPajuela, id_empresa]);
  if (!pajuelaFound) {
    throw new Error('No existe una pajuela con el codigo ingresado en la empresa');
  }
  return true;
};
