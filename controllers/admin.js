const db = require('../sql/db.js');

const empresaQueries = require('../sql/queries/empresa');
const authQueries = require('../sql/queries/auth');
const adminQueries = require('../sql/queries/admin');
const errorHandler = require('../util/error');
const validationHandler = require('../util/validationHandler');
const permissionHandler = require('../util/permissionHandler');
const sendEmail = require('../util/email');

exports.addProfileToUser = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const receiverUser = req.body.user;
    const id_profile = req.body.idProfile;
    const id_empresa = req.body.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      3,
      'No se tienen permisos para manejar permisologia y perfiles de la empresa'
    );
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

exports.removeProfileFromUser = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const receiverUser = req.params.user;
    const id_perfil = req.params.idPerfil;
    const id_empresa = req.params.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      3,
      'No se tienen permisos para manejar permisologia y perfiles de la empresa'
    );
    const profilesUser = await db.manyOrNone(adminQueries.getPerfilUsuario, [receiverUser]);
    const foundProfile = profilesUser.find(profile => profile.id_perfil === +id_perfil);
    if (!foundProfile) {
      const err = new Error('El usuario no posee el perfil ingresado!');
      err.statusCode = 422;
      throw err;
    }
    await db.none(adminQueries.removeProfileFromUser, [receiverUser, id_perfil]);
    res.status(200).json({ msg: 'perfil removido correctamente!' });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.createProfile = async (req, res, next) => {
  try {
    const id_usuario = req.id_usuario;
    const id_empresa = req.body.idEmpresa;
    const de_perfil = req.body.dePerfil.toLowerCase();
    await validationHandler(req);
    await permissionHandler(
      id_empresa,
      id_usuario,
      3,
      'No se tienen permisos para manejar permisologia y perfiles de la empresa'
    );
    await db.one(adminQueries.createProfile, [de_perfil, id_empresa]);
    res.status(201).json({ msg: 'perfil creado!' });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_perfil = req.body.idPerfil;
    const de_perfil = req.body.dePerfil.toLowerCase();
    const id_empresa = req.body.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      3,
      'No se tienen permisos para manejar permisologia y perfiles de la empresa'
    );
    await db.none(adminQueries.updateProfile, [de_perfil, id_perfil]);
    res.status(200).json({ msg: 'perfil actualizado!' });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.deleteProfile = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_perfil = req.params.idPerfil;
    const id_empresa = req.params.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      3,
      'No se tienen permisos para manejar permisologia y perfiles de la empresa'
    );
    await db.none(adminQueries.deleteProfile, [id_perfil, id_empresa]);
    res.status(200).json({ msg: 'perfil eliminado!' });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.getProfilesEmpresa = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.params.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      3,
      'No se tienen permisos para manejar permisologia y perfiles de la empresa'
    );
    const perfiles = await db.manyOrNone(adminQueries.getProfilesEmpresa, [id_empresa]);
    res.status(200).json({ perfiles });
  } catch (err) {
    errorHandler(err, next);
  }
};
exports.addPermissionToProfile = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_permissionsArr = req.body.idPermissionsArr;
    const id_profile = req.body.idPerfil;
    const id_usuario = req.id_usuario;
    const id_empresa = req.body.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      3,
      'No se tienen permisos para manejar permisologia y perfiles de la empresa'
    );
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
    }
    for (const id of id_permissionsArr) {
      await db.none(adminQueries.addPermissionToProfile, [id, id_profile]);
    }
    res.status(201).json({ msg: 'permisos agregados!' });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.updatePermissionProfile = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_permissionsArr = req.body.idPermissionsArr;
    const id_perfil = req.body.idPerfil;
    const id_usuario = req.id_usuario;
    const id_empresa = req.body.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      3,
      'No se tienen permisos para manejar permisologia y perfiles de la empresa'
    );
    await db.none(adminQueries.removePermissionsFromProfile, [id_perfil]);
    for (const id of id_permissionsArr) {
      await db.none(adminQueries.addPermissionToProfile, [id, id_perfil]);
    }
    res.status(201).json({ msg: 'permisos actualizados!' });
  } catch (err) {
    errorHandler(err, next);
  }
};
