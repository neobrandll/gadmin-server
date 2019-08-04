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
      'WHERE id_usuario = $1 And permiso.id_permiso IN ($2, 4) ' +
      'AND perfil.id_empresa = $3'
  ),
  getPerfilUsuario: new PS(
    'getPerfilUsuario',
    'SELECT * FROM perfil_usuario WHERE id_usuario = ' +
      '(SELECT id_usuario FROM usuario WHERE us_usuario = $1)'
  ),
  addProfileToUser: new PS(
    'addProfileToUser',
    'INSERT INTO perfil_usuario (id_perfil, id_usuario) ' +
      'VALUES ($1, (SELECT id_usuario FROM usuario WHERE us_usuario = $2))'
  ),
  dePerfilExist: new PS(
    'dePerfilExist',
    'SELECT * FROM perfil WHERE de_perfil ILIKE $1 AND id_empresa = $2'
  ),
  createProfile: new PS(
    'createProfile',
    'INSERT INTO perfil (de_perfil, id_empresa) VALUES ($1, $2) RETURNING id_perfil'
  ),
  perfilExist: new PS('perfilExist', 'SELECT * FROM perfil WHERE id_perfil = $1'),
  permissionProfileExist: new PS(
    'permissionProfileExist',
    'SELECT * FROM permiso_perfil WHERE id_permiso = $1 AND id_perfil = $2'
  ),
  addPermissionToProfile: new PS(
    'addPermissionToProfile',
    'INSERT INTO permiso_perfil (id_permiso, id_perfil) VALUES ($1, $2)'
  ),
  permissionExist: new PS('permissionExist', 'SELECT * FROM permiso WHERE id_permiso = $1'),
  addProfileToUserWithId: new PS(
    'addProfileToUserWithId',
    'INSERT INTO perfil_usuario (id_perfil, id_usuario) ' + 'VALUES ($1, $2)'
  ),
  updateProfile: new PS('updateProfile', 'UPDATE perfil SET de_perfil = $1 WHERE id_perfil = $2'),
  deleteProfile: new PS(
    'deleteProfile',
    'DELETE FROM perfil WHERE id_perfil = $1 AND id_empresa = $2'
  ),
  removeProfileFromUser: new PS(
    'removeProfileFromUser',
    'DELETE FROM perfil_usuario ' +
      'WHERE id_usuario = (SELECT id_usuario FROM usuario WHERE us_usuario = $1) ' +
      'AND id_perfil = $2'
  ),
  getProfilesEmpresa: new PS('getProfilesEmpresa', 'SELECT * FROM perfil WHERE id_empresa = $1'),
  removePermissionsFromProfile: new PS(
    'removePermissionsFromProfile',
    'DELETE FROM permiso_perfil WHERE id_perfil = $1'
  )
};
