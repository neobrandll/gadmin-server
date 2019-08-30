const PS = require('pg-promise').PreparedStatement;

module.exports = {
  getProfiles: new PS(
    'getProfiles',
    'SELECT id_perfil, de_perfil, empresa.id_empresa, no_empresa,de_permiso, id_permiso ' +
      'FROM perfil_usuario INNER JOIN perfil ' +
      'USING(id_perfil) INNER JOIN permiso_perfil USING(id_perfil) INNER JOIN permiso USING(id_permiso)' +
      ' INNER JOIN empresa USING(id_empresa) WHERE perfil_usuario.id_usuario = $1 AND empresa.id_empresa = $2'
  ),
  getDistincProfiles: new PS('getDistincProfiles', 'SELECT perfil.id_perfil, perfil.de_perfil'
  + ' FROM perfil_usuario INNER JOIN perfil  USING(id_perfil) INNER JOIN permiso_perfil USING(id_perfil)'
  +' INNER JOIN permiso USING(id_permiso) INNER JOIN empresa USING(id_empresa)'  
  + ' WHERE perfil_usuario.id_usuario = $1 AND empresa.id_empresa = $2 GROUP BY perfil.id_perfil'),
  
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
  ),
  findEmpresaById: new PS('findEmpresaById', 'SELECT * FROM empresa WHERE id_empresa = $1')
};
