const PS = require('pg-promise').PreparedStatement;

module.exports = {
  getPersona: new PS('getPersona', 'SELECT * FROM persona WHERE ci_persona = $1'),
  haveAUser: new PS('haveAUser', 'SELECT * FROM usuario WHERE id_persona = $1'),
  createUser: new PS(
    'createUser',
    'INSERT INTO usuario (us_usuario, pw_usuario, id_persona) VALUES ($1, $2, $3)'
  ),
  deCargoExist: new PS(
    'deCargoExist',
    'SELECT * FROM cargo WHERE de_cargo ILIKE $1 AND id_empresa = $2'
  ),
  createCargo: new PS('createCargo', 'INSERT INTO cargo (id_empresa, de_cargo) VALUES ($1, $2)'),
  cargoExist: new PS('cargoExist', 'SELECT * FROM cargo WHERE id_cargo = $1 AND id_empresa = $2')
};
