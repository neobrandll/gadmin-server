const db = require('../sql/db.js');

const empresaQueries = require('../sql/queries/empresa');
const authQueries = require('../sql/queries/auth');
const adminQueries = require('../sql/queries/admin');
const errorHandler = require('../util/error');
const validationHandler = require('../util/validationHandler');
const sendEmail = require('../util/email');

exports.addProfileToUser = async (req, res, next) => {
  try {
    validationHandler(req);
    const id_usuario = req.id_usuario;
    const receiverUser = req.body.user;
    const id_profile = req.body.idProfile;
    const id_empresa = req.body.idEmpresa;
    const permission = await db.oneOrNone(adminQueries.searchPermission, [
      id_usuario,
      3,
      id_empresa
    ]);
    if (!permission) {
      const err = new Error(
        'No se tienen permisos para manejar permisologia y perfiles de la empresa'
      );
      err.statusCode = 401;
      throw err;
    }
    const profileUser = await db.manyOrNone(adminQueries.getPerfilUsuario, [receiverUser]);
    if (profileUser.length > 0) {
      profileUser.forEach(row => {
        if (row.id_perfil === +id_profile) {
          const err = new Error('El usuario ya posee el perfil ingresado');
          err.statusCode = 422;
          throw err;
        }
      });
    }
    await db.none(adminQueries.addProfileToUser, [id_profile, receiverUser]);
    res.status(201).json({ msg: 'perfil anadido!' });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.createProfile = async (req, res, next) => {
  const id_usuario = req.id_usuario;
  const id_empresa = req.body.idEmpresa;
  const de_perfil = req.body.dePerfil.toLowerCase();
  try {
    validationHandler(req);
    const permission = await db.oneOrNone(adminQueries.searchPermission, [
      id_usuario,
      3,
      id_empresa
    ]);
    if (!permission) {
      const err = new Error(
        'No se tienen permisos para manejar permisologia y perfiles de la empresa'
      );
      err.statusCode = 401;
      throw err;
    }
    await db.none(adminQueries.createProfile, [de_perfil, id_empresa]);
    res.status(201).json({ msg: 'perfil creado!' });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.addPermissionToProfile = async (req, res, next) => {
  try {
    validationHandler(req);
    const id_permissionsArr = req.body.idPermissionsArr;
    const id_profile = req.body.idPerfil;
    const id_usuario = req.id_usuario;
    const id_empresa = req.body.idEmpresa;
    const permission = await db.oneOrNone(adminQueries.searchPermission, [
      id_usuario,
      3,
      id_empresa
    ]);
    if (!permission) {
      const err = new Error(
        'No se tienen permisos para manejar permisologia y perfiles de la empresa'
      );
      err.statusCode = 401;
      throw err;
    }
    let idFound;
    for (const id_permission of id_permissionsArr) {
      idFound = await db.oneOrNone(adminQueries.permissionProfileExist, [
        id_permission,
        id_profile
      ]);
      if (idFound) {
        const err = new Error(`El perfil ya contiene el permiso con el id: ${id_permission} `);
        err.statusCode = 422;
        throw err;
      }
      await db.one(adminQueries.addPermissionToProfile, [id_permission, id_profile]);
    }
    res.status(201).json({ msg: 'permisos agregados!' });
  } catch (err) {
    errorHandler(err, next);
  }
};

//CRUD DE TODA ESTA GENTE
