const PS = require('pg-promise').PreparedStatement;

module.exports = {
  dePastoAvailable: new PS(
    'dePastoAvailable',
    'SELECT * FROM pasto WHERE de_pasto ILIKE $1 AND id_empresa = $2'
  ),
  dePotreroAvailable: new PS(
    'dePotreroAvailable',
    'SELECT * FROM potrero INNER JOIN pasto USING(id_pasto) ' +
      'WHERE de_potrero ILIKE $1 AND pasto.id_empresa = $2'
  ),
  createPasto: new PS(
    'createPasto',
    'INSERT INTO pasto (de_pasto, id_empresa) VALUES($1, $2) RETURNING *'
  ),
  updatePasto: new PS(
    'updatePasto',
    'UPDATE pasto SET de_pasto = $1 WHERE id_pasto = $2 AND id_empresa = $3 RETURNING *'
  ),
  pastoExist: new PS('pastoExist', 'SELECT * FROM pasto WHERE id_pasto = $1 and id_empresa = $2'),
  potreroExist: new PS(
    'potreroExist',
    'SELECT * FROM potrero INNER JOIN pasto USING(id_pasto) ' +
      'WHERE id_potrero = $1 AND pasto.id_empresa = $2'
  ),
  getPastos: new PS('getPastos', 'SELECT * FROM pasto WHERE de_pasto ILIKE $1 AND id_empresa = $2'),
  createPotrero: new PS(
    'createPotrero',
    'INSERT INTO potrero (de_potrero, id_pasto) VALUES ($1, $2) RETURNING *'
  ),
  updatePotrero: new PS(
    'updatePotrero',
    'UPDATE potrero SET de_potrero = $1, id_pasto = $2 WHERE id_potrero = $3 RETURNING *'
  ),
  getPotrerosWithPasto: new PS(
    'getPotrerosWithPasto',
    'SELECT potrero.* FROM potrero INNER JOIN pasto USING(id_pasto) ' +
      'WHERE de_potrero ILIKE $1 AND id_pasto = $2 AND id_empresa = $3'
  ),
  getPotreros: new PS(
    'getPotreros',
    'SELECT potrero.* FROM potrero INNER JOIN pasto USING(id_pasto) ' +
      'WHERE de_potrero ILIKE $1 AND id_empresa = $2'
  ),
  deletePotrero: new PS('deletePotrero', 'DELETE FROM potrero WHERE id_potrero = $1')
};
