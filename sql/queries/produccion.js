const PS = require('pg-promise').PreparedStatement;

module.exports = {
  produccionDateAvailable: new PS(
    'produccionDateAvailable',
    'SELECT * FROM produccion WHERE fe_produccion = $1 AND id_tipo_produccion =$2 AND id_empresa =$3'
  ),
  pesajeDateAvailable: new PS(
    'pesajeDateAvailable',
    'SELECT * FROM produccion INNER JOIN produccion_ganado USING(id_produccion) WHERE fe_produccion = $1 AND id_tipo_produccion =$2 AND id_empresa =$3 ' +
      'AND id_ganado = (SELECT id_ganado FROM ganado WHERE co_ganado = $4 AND id_empresa = $3)'
  ),
  produccionExist: new PS(
    'produccionExist',
    'SELECT produccion.*, de_tipo_produccion FROM produccion ' +
      'INNER JOIN tipo_produccion USING(id_tipo_produccion) WHERE produccion.id_produccion = $1 AND id_empresa = $2'
  ),
  pesajeExist: new PS(
    'pesajeExist',
    'SELECT * FROM produccion LEFT JOIN produccion_ganado USING(id_produccion) WHERE id_produccion = $1 AND id_empresa = $2'
  ),
  createProduccion: new PS(
    'createProduccion',
    'INSERT INTO produccion (id_tipo_produccion, id_unidad, id_empresa, fe_produccion, ca_produccion) VALUES ($1,$2,$3,$4,$5) RETURNING *'
  ),
  updateProduccion: new PS(
    'updateProduccion',
    'UPDATE produccion SET id_tipo_produccion =$1, id_unidad =$2, fe_produccion = $3, ca_produccion =$4 ' +
      'WHERE id_produccion =$5 AND id_empresa =$6 RETURNING *'
  ),
  addGanadoToPesaje: new PS(
    'addGanadoToPesaje',
    'INSERT INTO produccion_ganado (id_produccion, id_ganado) VALUES($1,$2)'
  ),
  removeGanadoFromPesaje: new PS(
    'removeGanadoFromPesaje',
    'DELETE FROM produccion_ganado WHERE id_produccion = $1 AND id_ganado = $2'
  ),
  deleteProduccion: new PS(
    'deleteProduccion',
    'DELETE FROM produccion WHERE id_produccion =$1 AND id_empresa = $2'
  )
};
