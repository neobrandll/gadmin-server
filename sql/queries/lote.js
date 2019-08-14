const PS = require('pg-promise').PreparedStatement;

module.exports = {
  loteExist: new PS('loteExist', 'SELECT id_lote FROM lote WHERE id_lote = $1 AND id_empresa = $2'),
  deLoteAvailable: new PS(
    'deLoteAvailable',
    'SELECT * FROM lote WHERE de_lote ILIKE $1 AND id_empresa = $2'
  ),
  createLote: new PS(
    'createLote',
    'INSERT INTO lote (de_lote, id_empresa) VALUES($1, $2) RETURNING *'
  ),
  updateLote: new PS(
    'updateLote',
    'UPDATE lote SET de_lote = $1 WHERE id_empresa = $2 AND id_lote = $3 RETURNING *'
  ),
  deleteLote: new PS('deleteLote', 'DELETE FROM lote WHERE id_lote = $1 AND id_empresa = $2'),
  getLotes: new PS('getLotes', 'SELECT * FROM lote WHERE de_lote ILIKE $1 AND id_empresa = $2'),
  addGanadoToLote: new PS(
    'addGanadoToLote',
    'INSERT INTO lote_ganado (id_lote, id_ganado) ' +
      'VALUES ($1, (SELECT id_ganado FROM ganado WHERE co_ganado = $2 AND id_empresa = $3))'
  ),
  removeGanadoFromLote: new PS(
    'removeGanadoFromLote',
    'DELETE FROM lote_ganado WHERE id_lote = $1 ' +
      'AND id_ganado = (SELECT id_ganado FROM ganado WHERE co_ganado = $2 AND id_empresa = $3)'
  )
};
