const crypto = require('crypto');

const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const db = require('../sql/db.js');
const authQueries = require('../sql/queries/auth');
const { secret } = require('../config.js');
const errorHandler = require('../util/error');
const validationHandler = require('../util/validationHandler');
const sendEmail = require('../util/email');

exports.registro = async (req, res, next) => {
  const nombre = req.body.nombre;
  const apellido = req.body.apellido;
  const email = req.body.email;
  const telf = req.body.telf;
  const ci = req.body.ci;
  const password = req.body.password;
  const user = req.body.user;
  const pais = req.body.pais;
  const estado = req.body.estado;
  const ciudad = req.body.ciudad;
  const calle = req.body.calle;
  try {
    await validationHandler(req);
    const hashedPassword = await bcrypt.hash(password, 12);
    db.task(async con => {
      try {
        const direccion = await con.one(authQueries.insertDireccion, [pais, estado, ciudad, calle]);
        const persona = await con.one(authQueries.insertPersona, [
          direccion.id_direccion,
          nombre,
          apellido,
          email,
          telf,
          ci
        ]);
        const id_usuario = await con.one(authQueries.insertUsuario, [
          persona.id_persona,
          user,
          hashedPassword
        ]);
        sendEmail(
          email,
          'Bienvenido a Gadmin',
          `Bienvenido a Gadmin ${nombre} ${apellido}, tu usuario es ${user}`,
          next
        );
        res.status(201).json({ msg: 'usuario creado!', id_usuario });
      } catch (err) {
        errorHandler(err, next);
      }
    });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.login = async (req, res, next) => {
  try {
    await validationHandler(req);
    let user = req.body.user;
    const isEmail = validator.isEmail(user);
    const password = req.body.password;
    let usuario;
    if (isEmail) {
      user = validator.normalizeEmail(user);
      usuario = await db.oneOrNone(authQueries.getUserWithEmail, [user]);
      if (!usuario) {
        const err = new Error('No existe una cuenta asociada al correo ingresado.');
        err.statusCode = 422;
        throw err;
      }
    } else {
      usuario = await db.oneOrNone(authQueries.getUser, [user]);
      if (!usuario) {
        const err = new Error('No existe una cuenta asociada al usuario ingresado.');
        err.statusCode = 422;
        throw err;
      }
    }
    const isEqual = await bcrypt.compare(password, usuario.pw_usuario);
    if (!isEqual) {
      const err = new Error('Contraseña incorrecta');
      err.statusCode = 401;
      throw err;
    }
    const empresas = await db.any(authQueries.getEmpresas, [usuario.id_usuario]);
    const payload = {
      id_usuario: usuario.id_usuario,
      profile: {
        no_persona: usuario.no_persona,
        ap_persona: usuario.ap_persona,
        em_persona: usuario.em_persona,
        te_persona: usuario.te_persona,
        ci_persona: usuario.ci_persona,
        us_usuario: usuario.us_usuario,
        empresas
      }
    };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    res.status(200).json({ token, payload, msg: 'inicio de sesion satisfactorio!' });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.updateAddress = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario,
      pais = req.body.pais,
      estado = req.body.estado,
      ciudad = req.body.ciudad,
      calle = req.body.calle;
    const updatedAddress = await db.one(authQueries.updateAddress, [
      pais,
      estado,
      ciudad,
      calle,
      id_usuario
    ]);
    res.status(200).json({ msg: 'direccion actualizada!', updatedAddress });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    await validationHandler(req);
    const user = req.body.user,
      ci = req.body.ci,
      telf = req.body.telf,
      nombre = req.body.nombre,
      apellido = req.body.apellido,
      id_usuario = req.id_usuario;
    const updatedProfile = await db.one(authQueries.updateProfile, [
      nombre,
      apellido,
      telf,
      ci,
      id_usuario
    ]);
    const payload = {
      id_usuario: req.id_usuario,
      profile: {
        ...updatedProfile,
        empresas: req.profile.empresas
      }
    };
    const updatedUser = await db.one(authQueries.updateUser, [user, id_usuario]);
    payload.profile.us_usuario = updatedUser.us_usuario;
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    res.status(200).json({ token, profile: payload.profile, msg: 'Perfil actualizado!' });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.updateEmail = async (req, res, next) => {
  try {
    validationHandler(req);
    const email = req.body.email;
    const password = req.body.password;
    const id_usuario = req.id_usuario;
    const usuario = await db.oneOrNone(authQueries.findUserbyId, [id_usuario]);
    if (!usuario) {
      const err = new Error('no existe un usuario con el id ingresado');
      err.statusCode = 410;
      throw err;
    }
    const isEqual = await bcrypt.compare(password, usuario.pw_usuario);
    if (!isEqual) {
      const err = new Error('Contraseña incorrecta');
      err.statusCode = 401;
      throw err;
    }
    const updatedEmail = await db.one(authQueries.updateEmail, [email, id_usuario]);
    const payload = {
      id_usuario: req.id_usuario,
      profile: { ...req.profile, em_persona: updatedEmail.em_persona }
    };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    res.status(200).json({ token, msg: 'correo Actualizado!', profile: payload.profile });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.sendTokenPassword = async (req, res, next) => {
  try {
    validationHandler(req);
    let resetTokenExpiration;
    let newToken;
    const email = validator.normalizeEmail(req.body.email);
    const usuario = await db.oneOrNone(authQueries.getUserWithEmail, [email]);
    if (!usuario) {
      const err = new Error('No existe una cuenta asociada al correo ingresado.');
      err.statusCode = 422;
      throw err;
    }
    const foundToken = await db.oneOrNone(authQueries.findPwToken, [usuario.id_usuario]);
    crypto.randomBytes(32, async (err, buffer) => {
      try {
        if (err) {
          throw err;
        }
        const pwToken = buffer.toString('hex');
        if (!foundToken) {
          resetTokenExpiration = Date.now() + 3600000;
          newToken = await db.one(authQueries.createPwToken, [
            usuario.id_usuario,
            new Date(resetTokenExpiration),
            pwToken
          ]);
        } else {
          if (foundToken.fe_pw_reset_token.getTime() - 3600000 + 300000 > Date.now()) {
            const err = new Error(
              'Solo se puede generar un token cada 5 minutos, por favor espere'
            );
            err.statusCode = 403;
            throw err;
          } else {
            resetTokenExpiration = Date.now() + 3600000;
            newToken = await db.one(authQueries.resetPwToken, [
              new Date(resetTokenExpiration),
              pwToken,
              usuario.id_usuario
            ]);
          }
        }
        sendEmail(
          email,
          'Restablecer su contraseña',
          `El codigo para reestablecer su contraseña es: ${pwToken}`
        );
        res.status(201).json({ msg: 'codigo para reestablecer contrasena creado!' });
      } catch (err) {
        errorHandler(err, next);
      }
    });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    validationHandler(req);
    const password = req.body.password;
    const email = validator.normalizeEmail(req.body.email);
    const pwToken = req.body.pwToken;
    const usuario = await db.oneOrNone(authQueries.getUserWithEmail, [email]);
    if (!usuario) {
      const err = new Error('No existe una cuenta asociada al correo ingresado.');
      err.statusCode = 422;
      throw err;
    }
    const foundToken = await db.oneOrNone(authQueries.findAndValidPwToken, [
      usuario.id_usuario,
      pwToken
    ]);
    if (!foundToken) {
      const err = new Error('codigo incorrecto.');
      err.statusCode = 401;
      throw err;
    }
    if (foundToken.fe_pw_reset_token.getTime() < Date.now()) {
      const err = new Error(
        'el codigo de reinicio de contrasena ingresado expiro, por favor genere uno nuevo.'
      );
      err.statusCode = 401;
      throw err;
    }
    const newPassword = await bcrypt.hash(password, 12);
    await db.none(authQueries.updatePassword, [newPassword, usuario.id_usuario]);
    res.status(200).json({ msg: 'Contrasena actualizada!' });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.getUserData = async (req, res, next) => {
  try {
    validationHandler(req);
    const id_usuario = req.id_usuario;
    const userData = await db.one(authQueries.getUserData, [id_usuario]);
    res.status(200).json({ userData });
  } catch (err) {
    errorHandler(err, next);
  }
};
