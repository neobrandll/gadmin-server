const PS = require('pg-promise').PreparedStatement;

module.exports = {
  deRazaExist: new PS(
    'deRazaExist',
    'SELECT * FROM raza WHERE de_raza ILIKE $1 AND id_empresa = $2'
  ),
  createRaza: new PS(
    'createRaza',
    'INSERT INTO raza (id_empresa, de_raza) VALUES ($1, $2) RETURNING *'
  ),
  getRazas: new PS('getRazas', 'SELECT * FROM raza WHERE id_empresa = $1'),
  updateRaza: new PS(
    'updateRaza',
    'UPDATE raza SET de_raza = $1 WHERE id_raza = $2 AND id_empresa = $3 RETURNING *'
  ),
  razaExist: new PS('razaExist', 'SELECT * FROM raza WHERE id_raza = $1 AND id_empresa = $2'),
  ganadoExist: new PS(
    'ganadoExist',
    'SELECT id_ganado FROM ganado WHERE id_ganado = $1 AND id_empresa = $2'
  ),
  pajuelaExist: new PS(
    'pajuelaExist',
    'SELECT id_pajuela FROM pajuela WHERE id_pajuela = $1 AND id_empresa = $2'
  ),
  codigoExist: new PS(
    'codigoExist',
    'SELECT id_ganado FROM ganado WHERE co_ganado = $1 AND id_empresa = $2'
  ),
  createGanado: new PS(
    'createGanado',
    'INSERT into ganado ' +
      '(id_empresa ,id_raza, id_estado_ganado ,id_tipo_ganado , ' +
      'pe_ganado ,fe_ganado ,id_pa_ganado ,id_ma_ganado ,id_pa_pajuela , co_ganado ,fo_ganado)' +
      ' VALUES ($1, $2, $3, $4, $5, $6, $7,$8 ,$9 ,$10 , $11) RETURNING *'
  )
};
