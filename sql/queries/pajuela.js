const PS = require('pg-promise').PreparedStatement;

module.exports = {
  findCoPajuela: new PS(
    'findCoPajuela',
    'SELECT * FROM pajuela WHERE co_pajuela = $1 AND id_empresa = $2'
  ),
  getPajuela: new PS(
    'getPajuela',
    'SELECT pajuela.*, de_raza FROM pajuela ' +
      'INNER JOIN raza USING(id_raza) WHERE co_pajuela = $1 AND pajuela.id_empresa = $2'
  ),
  createPajuela: new PS(
    'createPajuela',
    'INSERT INTO pajuela (id_raza, id_empresa, fe_pajuela, de_pajuela, co_pajuela) VALUES ($1, $2, $3, $4, $5) RETURNING *'
  ),
  updatePajuela: new PS(
    'updatePajuela',
    'UPDATE pajuela SET id_raza = $1, id_empresa = $2, fe_pajuela= $3, de_pajuela= $4, co_pajuela = $5 ' +
      'WHERE co_pajuela =$6 AND id_empresa = $7 ' +
      'RETURNING *'
  )
};
