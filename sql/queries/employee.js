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
  createCargo: new PS(
    'createCargo',
    'INSERT INTO cargo (id_empresa, de_cargo) VALUES ($1, $2) RETURNING *'
  ),
  cargoExist: new PS('cargoExist', 'SELECT * FROM cargo WHERE id_cargo = $1 AND id_empresa = $2'),
  addCargoToPersona: new PS(
    'addCargoToPersona',
    'INSERT INTO cargo_persona (id_persona, id_cargo) VALUES((SELECT id_persona FROM persona WHERE ci_persona = $1), $2)'
  ),
  getCargosPersona: new PS(
    'getCargosPersona',
    'SELECT id_cargo FROM cargo_persona ' +
      'WHERE id_persona = (SELECT id_persona FROM persona WHERE ci_persona = $1)'
  ),
  deleteCargo: new PS('removeCargo', 'DELETE FROM cargo WHERE id_cargo = $1'),
  personaHaveCargo: new PS(
    'personaHaveCargo',
    'SELECT * FROM cargo_persona ' +
      'WHERE id_cargo = $1 ' +
      'AND id_persona = (SELECT id_persona FROM persona WHERE ci_persona = $2)'
  ),
  removeCargoFromPersona: new PS(
    'removeCargoFromPersona',
    'DELETE FROM cargo_persona ' +
      'WHERE id_cargo = $1 ' +
      'AND id_persona = (SELECT id_persona FROM persona WHERE ci_persona = $2)'
  ),
  getCargosEmpresa: new PS('getCargosEmpresa', 'SELECT * FROM cargo WHERE id_empresa = $1'),
  updateCargo: new PS(
    'updateCargo',
    'UPDATE cargo SET de_cargo = $1 WHERE id_cargo = $2 RETURNING *'
  )
};
