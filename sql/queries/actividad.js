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
  ),
  vacaExists: new PS(
    'vacaExists',
    'SELECT id_ganado FROM ganado WHERE co_ganado = $1 AND id_empresa = $2 AND id_tipo_ganado = 2'
  ),
  toroExists: new PS(
    'toroExists',
    'SELECT id_ganado FROM ganado WHERE co_ganado = $1 AND id_empresa = $2 AND id_tipo_ganado = 1'
  ),
  abortoActividadGanado: new PS(
    'abortoActividadGanado',
    'INSERT INTO actividad_ganado (id_actividad, id_ganado) VALUES ($1,$2)'
  ),
  idActividadOtrosExists: new PS(
    'idActividadOtrosExists',
    'SELECT actividad.*, ganado.id_ganado FROM actividad ' +
      'INNER JOIN actividad_ganado USING(id_actividad) ' +
      'INNER JOIN ganado USING(id_ganado) ' +
      'WHERE id_tipo_actividad IN(3,5) ' +
      'AND actividad.id_actividad = $1 ' +
      'AND ganado.id_empresa = $2 ' +
      'LIMIT 1'
  ),
  updateActividadOtros: new PS(
    'updateActividadOtros',
    'UPDATE actividad SET de_actividad = $1, fe_actividad = $2 WHERE id_actividad = $3 RETURNING *'
  ),
  updateAbortoActividadGanado: new PS(
    'updateAbortoActividadGanado',
    'UPDATE actividad_ganado SET id_ganado = $1 ' +
      'WHERE id_actividad_ganado = (SELECT id_actividad_ganado FROM actividad_ganado WHERE id_actividad = $2 LIMIT 1)'
  ),
  deleteOldAGTratamiento: new PS(
    'deleteOldAGTratamiento',
    'DELETE FROM actividad_ganado WHERE id_actividad = $1'
  ),
  tratamientoExists: new PS(
    'tratamientoExists',
    'SELECT id_actividad FROM actividad ' +
      'INNER JOIN actividad_ganado USING(id_actividad)' +
      'INNER JOIN ganado USING(id_ganado)' +
      'WHERE ganado.id_empresa =$1 AND id_actividad =$2 AND id_tipo_actividad = 5 ' +
      'GROUP BY id_actividad'
  ),
  getTratamiento: new PS(
    'getTratamiento',
    'SELECT actividad.*, ganado.co_ganado, ' +
      'ganado.id_ganado, ganado.id_tipo_ganado , ganado.pe_ganado FROM actividad' +
      ' INNER JOIN actividad_ganado USING(id_actividad) ' +
      'INNER JOIN ganado USING(id_ganado) WHERE id_actividad = $1 AND ganado.id_empresa =$2 AND id_tipo_actividad =5'
  ),
  servicioActividadGanado: new PS(
    'servicioActividadGanado',
    'INSERT INTO actividad_ganado (id_actividad, id_ganado) VALUES ($1,$2), ($1, $3)'
  ),
  servicioActividadPajuela: new PS(
    'servicioActividadPajuela',
    'INSERT INTO actividad_pajuela (id_actividad, id_pajuela, id_ganado) VALUES($1, $2, $3)'
  ),
  servicioExists: new PS(
    'servicioExists',
    'SELECT id_actividad, id_tipo_actividad FROM actividad ' +
      'LEFT JOIN actividad_ganado USING(id_actividad) ' +
      'LEFT JOIN ganado USING(id_ganado)  ' +
      'LEFT JOIN actividad_pajuela USING(id_actividad) ' +
      'LEFT JOIN pajuela USING(id_pajuela) ' +
      'WHERE (actividad.id_tipo_actividad IN (6,7)  AND id_actividad = $1 AND ganado.id_empresa =$2 ) ' +
      'OR (pajuela.id_empresa = $2  AND actividad.id_tipo_actividad IN (6,7) AND id_actividad = $1) ' +
      'GROUP BY id_actividad'
  ),
  deleteServicioAP: new PS(
    'deleteServicioAP',
    'DELETE FROM actividad_pajuela WHERE id_actividad = $1'
  ),
  getServicioGanado: new PS(
    'getServicioGanado',
    'SELECT actividad.*, ganado.co_ganado, ganado.id_ganado FROM actividad' +
      ' INNER JOIN actividad_ganado USING(id_actividad)' +
      ' INNER JOIN ganado USING(id_ganado) WHERE actividad.id_actividad = $1 AND id_empresa = $2'
  ),
  getServicioPajuela: new PS(
    'getServicioPajuela',
    'SELECT actividad.*, ganado.co_ganado, ganado.id_ganado, pajuela.co_pajuela, pajuela.id_pajuela ' +
      'FROM actividad INNER JOIN actividad_pajuela USING(id_actividad)' +
      ' INNER JOIN pajuela USING(id_pajuela) ' +
      'INNER JOIN ganado USING(id_ganado) ' +
      'WHERE actividad.id_actividad = $1 AND pajuela.id_empresa = $2'
  ),
  deleteServicio: new PS(
    'deleteServicio',
    'DELETE FROM actividad WHERE id_tipo_actividad IN (6,7) AND id_actividad = $1'
  ),
  deleteOtros: new PS(
    'deleteOtros',
    'DELETE FROM actividad WHERE id_tipo_actividad IN (3,5) AND id_actividad = $1'
  )
};
