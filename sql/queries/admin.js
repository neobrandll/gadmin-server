const PS = require('pg-promise').PreparedStatement;

module.exports = {
  searchPermission: new PS(
    'searchPermission',
    'SELECT permiso.id_permiso ' +
      'FROM permiso INNER JOIN permiso_perfil ' +
      'USING(id_permiso) ' +
      'INNER JOIN perfil ' +
      'USING(id_perfil) ' +
      'INNER JOIN perfil_usuario USING(id_perfil) ' +
      'WHERE id_usuario = $1 And permiso.id_permiso = $2 and perfil.id_empresa = $3'
  )
};
