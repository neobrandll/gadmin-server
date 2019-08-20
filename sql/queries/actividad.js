const PS = require('pg-promise').PreparedStatement;

module.exports = {
  createActividad: new PS(
    'createActividad',
    'INSERT INTO actividad (id_tipo_actividad, de_actividad, fe_actividad) VALUES ($1, $2, $3) RETURNING *'
  ),
  updateActividad: new PS(
    'updateActividad',
    'UPDATE actividad SET id_tipo_actividad = $1, de_actividad = $2, fe_actividad = $3 WHERE id_actividad = $4 RETURNING *'
  ),
  partoExist: new PS(
    'partoExist',
    'SELECT * FROM actividad WHERE id_actividad = (SELECT actividad.id_actividad FROM actividad ' +
      'INNER JOIN actividad_ganado USING(id_actividad) ' +
      'INNER JOIN ganado USING(id_ganado) ' +
      'WHERE actividad.id_actividad = $1 ' +
      'AND id_tipo_actividad IN(1,2) AND ganado.id_empresa = $2 ' +
      'GROUP BY actividad.id_actividad)'
  ),
  getOldCrias: new PS(
    'getOldCrias',
    'SELECT ganado.id_ganado FROM actividad ' +
      'INNER JOIN actividad_ganado USING (id_actividad) ' +
      'INNER JOIN ganado USING(id_ganado) ' +
      'WHERE id_actividad = $1'
  ),
  getParto: new PS(
    'getParto',
    'SELECT cria.co_ganado, cria.id_tipo_ganado , cria.pe_ganado,' +
      ' padre.co_ganado co_pa_ganado, cria.id_pa_ganado, madre.co_ganado co_ma_ganado, cria.id_ma_ganado,' +
      ' pajuela.co_pajuela co_pa_pajuela, cria.id_pa_pajuela, actividad.id_actividad FROM ganado cria  ' +
      'LEFT JOIN ganado padre ON cria.id_pa_ganado = padre.id_ganado  ' +
      'LEFT JOIN ganado madre ON cria.id_ma_ganado = madre.id_ganado ' +
      'LEFT JOIN pajuela ON cria.id_pa_pajuela = pajuela.id_pajuela ' +
      'INNER JOIN actividad_ganado ON cria.id_ganado = actividad_ganado.id_ganado ' +
      'INNER JOIN actividad USING(id_actividad) ' +
      'WHERE cria.id_empresa = $1 AND id_actividad = $2'
  )
};
