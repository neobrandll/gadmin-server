const authQueries = require('../../sql/queries/auth');
const db = require('../../sql/db');

exports.user = async (value, { req }) => {
  const user = await db.oneOrNone(authQueries.findUser, [value]);
  if (user) {
    throw new Error('El usuario ingresado ya esta en uso.');
  }
  return true;
};

exports.email = async (value, { req }) => {
  const email = await db.oneOrNone(authQueries.findEmail, [value]);
  if (email) {
    throw new Error('El correo ingresado ya esta en uso.');
  }
  return true;
};

exports.ci = async (value, { req }) => {
  const ci = await db.oneOrNone(authQueries.findCi, [value]);
  if (ci) {
    throw new Error('La cedula ingresada ya esta en uso.');
  }
  return true;
};

exports.confirmPassword = (value, { req }) => {
  if (value !== req.body.password) {
    throw new Error('Las contraseñas tienen que coincidir.');
  }
  return true;
};

exports.updateEmail = async (value, { req }) => {
  const id_usuario = req.id_usuario;
  if (value !== req.profile.em_persona && value) {
    const emailFound = await db.oneOrNone(authQueries.emailExist, [value]);
    if (emailFound) {
      throw new Error('El correo ingresado ya esta en uso.');
    }
  }
  return true;
};

exports.updateUser = async (user, { req }) => {
  if (user !== req.profile.us_usuario && user) {
    const usuarioFound = await db.oneOrNone(authQueries.findUser, [user]);
    if (usuarioFound) {
      throw new Error('El usuario ingresado ya esta en uso.');
    }
  }
  return true;
};

exports.updateCi = async (ci, { req }) => {
  if (ci !== req.profile.ci_persona && ci) {
    const ciFound = await db.oneOrNone(authQueries.findCi, [ci]);
    if (ciFound) {
      throw new Error('La cedula ingresada ya esta en uso.');
    }
  }
  return true;
};
