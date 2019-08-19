const adminQueries = require('../../sql/queries/admin');
const authQueries = require('../../sql/queries/auth');
const db = require('../../sql/db');
const validator = require('validator');

exports.userExist = async (user, { req }) => {
  const userFound = await db.oneOrNone(authQueries.findUser, [user]);
  if (!userFound) {
    throw new Error('No existe ningun usuario con el username ingresado');
  }
  return true;
};

exports.dePerfilExist = async (dePerfil, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const dePerfilFound = await db.oneOrNone(adminQueries.dePerfilExist, [dePerfil, id_empresa]);
  if (dePerfilFound) {
    throw new Error('Ya existe un perfil con la descripcion ingresada');
  }
  return true;
};

exports.perfilExist = async (id_perfil, { req }) => {
  const perfilFound = await db.oneOrNone(adminQueries.perfilExist, [id_perfil]);
  if (!perfilFound) {
    throw new Error('No existe el perfil ingresado');
  }
  return true;
};

exports.checkPermissionsIds = async (arr, { req }) => {
  let idFound;
  const idArr = [];
  for (const id of arr) {
    if (idArr.includes(id)) {
      throw new Error('esta repitiendo un id de un permiso');
    }
    if (!Number.isInteger(id)) {
      throw new Error('los ids deben de ser numeros enteros');
    }
    idFound = await db.oneOrNone(adminQueries.permissionExist, [id]);
    if (!idFound) {
      throw new Error('Uno o mas de los ids ingresados son invalidos');
    }
    idArr.push(id);
  }
  return true;
};
