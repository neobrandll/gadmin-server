const PS = require('pg-promise').PreparedStatement;

module.exports = {
  auth: {
    findUser: new PS('findUser', 'SELECT * FROM usuario WHERE us_usuario = $1'),
    getUser: new PS(
      'getUser',
      'SELECT ' +
        'no_persona, ap_persona, em_persona, te_persona, ci_persona, id_usuario, us_usuario, pw_usuario' +
        ' FROM persona INNER JOIN usuario USING (id_persona) ' +
        'WHERE us_usuario = $1'
    ),
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
    getUserWithEmail: new PS(
      'getUserWithEmail',
      'SELECT no_persona, ap_persona, em_persona, te_persona, ci_persona, id_usuario, us_usuario, pw_usuario ' +
        'FROM persona ' +
        'INNER JOIN usuario ' +
        'USING (id_persona) ' +
        'WHERE em_persona= $1'
    ),
    getEmpresas: new PS(
      'getEmpresas',
      'SELECT id_empresa, no_empresa, ri_empresa ' +
        'FROM empresa where id_empresa IN (SELECT DISTINCT (id_empresa) ' +
        'FROM perfil_usuario WHERE id_usuario = $1)'
    ),
    updateAddress: new PS(
      'updateAddress',
      'UPDATE direccion SET pa_direccion = $1, es_direccion = $2, ci_direccion = $3, ca_direccion = $4' +
        ' WHERE id_direccion = (SELECT id_direccion ' +
        'FROM persona INNER JOIN usuario USING (id_persona) ' +
        'WHERE id_usuario = $5 ) RETURNING pa_direccion, es_direccion , ci_direccion, ca_direccion'
    ),
    emailExist: new PS('emailExist', 'SELECT em_persona FROM persona WHERE em_persona = $1'),
    updateUser: new PS(
      'updateUser',
      'UPDATE usuario SET us_usuario = $1 WHERE id_usuario = $2 RETURNING us_usuario'
    ),
    updateProfile: new PS(
      'updateProfile',
      'UPDATE persona SET no_persona = $1, ap_persona =$2,' +
        ' em_persona = $3, te_persona = $4, ci_persona = $5' +
        'WHERE id_persona = (SELECT id_persona FROM usuario WHERE id_usuario = $6) ' +
        'RETURNING no_persona, ap_persona, em_persona, te_persona, ci_persona'
    )
  }
};
