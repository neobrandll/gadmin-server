const PS = require('pg-promise').PreparedStatement;

module.exports = {
  getProfiles: new PS(
    'getProfiles',
    'SELECT id_perfil, de_perfil, id_empresa ' +
      'FROM perfil_usuario INNER JOIN perfil ' +
      'USING(id_perfil) ' +
      'WHERE id_usuario = $1 AND id_empresa = $2'
  ),
  createEmpresa: new PS(
    'createEmpresa',
    'INSERT INTO empresa (id_usuario, id_direccion, no_empresa, ri_empresa) ' +
      'VALUES ($1, $2, $3, $4) RETURNING *'
  ),
  rifExist: new PS('rifExist', 'SELECT ri_empresa FROM empresa WHERE ri_empresa = $1'),
  updateAddress: new PS(
    'updateAddress',
    'UPDATE direccion ' +
      'SET pa_direccion = $1, es_direccion = $2, ci_direccion = $3, ca_direccion = $4 ' +
      'WHERE id_direccion = (SELECT id_direccion FROM empresa WHERE id_empresa = $5) RETURNING *'
  ),
  getEmpresa: new PS(
    'getEmpresa',
    'SELECT * FROM empresa ' + 'INNER JOIN direccion using(id_direccion) WHERE id_empresa = $1'
  ),
  updateEmpresaProfile: new PS(
    'updateEmpresaProfile',
    'UPDATE empresa SET no_empresa = $1, ri_empresa = $2 WHERE id_empresa = $3 RETURNING *'
  )
};
