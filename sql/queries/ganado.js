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
    'SELECT id_pajuela FROM pajuela WHERE co_pajuela = $1 AND id_empresa = $2'
  ),
  codigoExist: new PS(
    'codigoExist',
    'SELECT id_ganado, fo_ganado, id_tipo_ganado FROM ganado WHERE co_ganado = $1 AND id_empresa = $2'
  ),
  createGanado: new PS(
    'createGanado',
    'INSERT into ganado ' +
      '(id_empresa ,id_raza, id_estado_ganado ,id_tipo_ganado , ' +
      'pe_ganado ,fe_ganado ,co_pa_ganado ,co_ma_ganado ,co_pa_pajuela , co_ganado ,fo_ganado)' +
      ' VALUES ($1, $2, $3, $4, $5, $6, $7,$8 ,$9 ,$10 , $11) RETURNING *'
  ),
  updateGanado: new PS(
    'updateGanado',
    'UPDATE ganado SET id_raza = $1, id_estado_ganado = $2 ,id_tipo_ganado = $3 , ' +
      'pe_ganado = $4 ,fe_ganado = $5 ,co_pa_ganado = $6 ,co_ma_ganado = $7, co_pa_pajuela = $8  ' +
      ',fo_ganado = $9, co_ganado = $10 WHERE co_ganado = $11 AND id_empresa = $12 RETURNING *'
  ),
  getByRaza: new PS(
    'getByRaza',
    'SELECT id_ganado, co_ganado, fo_ganado FROM ganado WHERE id_raza = $1 AND id_empresa = $2 OFFSET $3 LIMIT $4'
  ),
  countGetByRaza: new PS(
    'countGetByRaza',
    'SELECT COUNT(id_ganado) FROM ganado WHERE id_raza = $1 AND id_empresa = $2'
  ),
  getByEstado: new PS(
    'getByEstado',
    'SELECT id_ganado, co_ganado, fo_ganado FROM ganado WHERE id_estado_ganado = $1 AND id_empresa = $2 OFFSET $3 LIMIT $4'
  ),
  countGetByEstado: new PS(
    'countGetByEstado',
    'SELECT COUNT(id_ganado) FROM ganado WHERE id_estado_ganado = $1 AND id_empresa = $2 '
  ),
  getByTipo: new PS(
    'getByTipo',
    'SELECT id_ganado, co_ganado, fo_ganado FROM ganado WHERE id_tipo_ganado = $1 AND id_empresa = $2 OFFSET $3 LIMIT $4'
  ),
  countGetByTipo: new PS(
    'countGetByTipo',
    'SELECT COUNT(id_ganado) FROM ganado WHERE id_tipo_ganado = $1 AND id_empresa = $2'
  ),
  getByLote: new PS(
    'getByLote',
    'SELECT id_ganado, co_ganado, fo_ganado FROM lote ' +
      'INNER JOIN lote_ganado USING(id_lote) ' +
      'INNER JOIN ganado USING(id_ganado) WHERE lote.id_lote = $1 AND lote.id_empresa = $2 OFFSET $3 LIMIT $4'
  ),
  countGetByLote: new PS(
    'countGetByLote',
    'SELECT COUNT(id_ganado) FROM lote ' +
      'INNER JOIN lote_ganado USING(id_lote) ' +
      'INNER JOIN ganado USING(id_ganado) WHERE lote.id_lote = $1 AND lote.id_empresa = $2'
  ),
  getGanado: new PS(
    'getGanado',
    'SELECT ganado.*, de_raza FROM ganado ' +
      'INNER JOIN raza USING(id_raza) WHERE co_ganado = $1 ' +
      'AND ganado.id_empresa = $2'
  ),
  getLotesOfGanado: new PS(
    'getLotesOfGanado',
    'SELECT lote.* FROM lote INNER JOIN lote_ganado USING(id_lote) WHERE id_ganado = $1'
  )
};
