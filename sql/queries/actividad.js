const PS = require('pg-promise').PreparedStatement;

module.exports = {
  createActividad: new PS(
    'createActividad',
    'INSERT INTO actividad (id_tipo_actividad, de_actividad, fe_actividad) VALUES ($1, $2, $3) RETURNING *'
  )
};
