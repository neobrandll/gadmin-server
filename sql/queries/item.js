const PS = require('pg-promise').PreparedStatement;

module.exports = {
  itemExist: new PS('itemExist', 'SELECT * FROM item WHERE id_item = $1 AND id_empresa = $2'),
  deItemAvailable: new PS(
    'deItemAvailable',
    'SELECT * FROM item WHERE de_item ILIKE $1 AND id_empresa = $2'
  ),
  createItem: new PS(
    'createItem',
    'INSERT INTO item (de_item, ca_item, id_tipo_item, id_empresa) VALUES ($1, $2, $3, $4) RETURNING *'
  ),
  updateItem: new PS(
    'updateItem',
    'UPDATE item SET de_item =$1, ca_item =$2, id_tipo_item =$3 WHERE id_item = $4 AND id_empresa =$5 RETURNING *'
  ),
  deleteItem: new PS('deleteItem', 'DELETE FROM item WHERE id_item = $1 AND id_empresa = $2')
};
