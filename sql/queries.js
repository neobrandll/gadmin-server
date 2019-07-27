const PS = require('pg-promise').PreparedStatement;

module.exports = {
  auth: {
    findUser: new PS('findUser', 'SELECT * FROM usuario WHERE us_usuario = $1'),
    findEmail: new PS('findEmail', 'SELECT em_persona FROM persona WHERE em_persona = $1'),
    findCi: new PS('findCi', 'SELECT ci_persona FROM persona WHERE ci_persona = $1'),
    insertDireccion: new PS(
      'insertDireccion',
      'INSERT INTO direccion (pa_direccion, es_direccion, ci_direccion, ca_direccion) VALUES ($1,$2,$3,$4) RETURNING id_direccion'
    ),
    insertPersona: new PS(
      'insertPersona',
      'INSERT INTO ' +
        'persona (id_direccion,no_persona,ap_persona, em_persona, te_persona, ci_persona) ' +
        'VALUES ($1,$2,$3,$4,$5, $6) RETURNING id_persona'
    ),
    insertUsuario: new PS(
      'insertUsuario',
      'INSERT INTO usuario (id_persona, us_usuario, pw_usuario) VALUES ($1,$2,$3) RETURNING id_usuario'
    ),
    findUserWithEmail: new PS(
      'findUserWithEmail',
      'SELECT id_usuario, us_usuario, pw_usuario, em_persona ' +
        'FROM usuario INNER JOIN persona USING (id_persona) ' +
        'WHERE em_persona = $1'
    ),
    getProfiles: new PS('getProfiles', 'SELECT * FROM perfil_usuario WHERE id_usuario = $1')
  }
};
