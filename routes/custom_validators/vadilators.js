const queries = require('../../sql/queries');
const db = require('../../sql/db');

exports.user = async (value, { req }) => {
  const user = await db.oneOrNone(queries.auth.findUser, [value]);
  if (user) {
    throw new Error('El usuario ingresado ya esta en uso.');
  }
  return true;
};

exports.email = async (value, { req }) => {
  const email = await db.oneOrNone(queries.auth.findEmail, [value]);
  if (email) {
    throw new Error('El correo ingresado ya esta en uso.');
  }
  return true;
};

exports.ci = async (value, { req }) => {
  const ci = await db.oneOrNone(queries.auth.findCi, [value]);
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
