const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const eValidator = require('email-validator');

const db = require('../sql/db.js');
const queries = require('../sql/queries');
const { secret } = require('../config.js');
const errorHandler = require('../util/error');
const validationHandler = require('../util/validationHandler');

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
      const direccion = await con.one(queries.auth.insertDireccion, [pais, estado, ciudad, calle]);
      const persona = await con.one(queries.auth.insertPersona, [
        direccion.id_direccion,
        nombre,
        apellido,
        email,
        telf,
        ci
      ]);
      const id_usuario = await con.one(queries.auth.insertUsuario, [
        persona.id_persona,
        user,
        hashedPassword
      ]);
      res.status(201).json({ msg: 'usuario creado!', id_usuario });
    });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.login = async (req, res, next) => {
  try {
    await validationHandler(req);
    const user = req.body.user;
    const isEmail = eValidator.validate(user);
    const password = req.body.password;
    let usuario;
    if (isEmail) {
      usuario = await db.oneOrNone(queries.auth.getUserWithEmail, [user]);
      if (!usuario) {
        const err = new Error('No existe una cuenta asociada al correo ingresado.');
        err.statusCode = 422;
        throw err;
      }
    } else {
      usuario = await db.oneOrNone(queries.auth.getUser, [user]);
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
    const empresas = await db.any(queries.auth.getEmpresas, [usuario.id_usuario]);
    const payload = {
      id_usuario: usuario.id_usuario,
      profile: {
        no_persona: usuario.no_persona,
        ap_persona: usuario.ap_persona,
        em_persona: usuario.em_persona,
        te_persona: usuario.te_persona,
        ci_persona: usuario.ci_persona,
        us_usuario: usuario.us_usuario
      },
      empresas
    };
    const token = jwt.sign(payload, secret, { expiresIn: '12h' });
    res.status(200).json({ token, payload });
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
    const updatedAddress = await db.one(queries.auth.updateAddress, [
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
    const email = req.body.email,
      user = req.body.user,
      ci = req.body.ci,
      telf = req.body.telf,
      nombre = req.body.nombre,
      apellido = req.body.apellido,
      id_usuario = req.id_usuario;

    const updatedProfile = await db.one(queries.auth.updateProfile, [
      nombre,
      apellido,
      email,
      telf,
      ci,
      id_usuario
    ]);
    updatedProfile.user = await db.one(queries.auth.updateUser, [user, id_usuario]);
    res.status(200).json({ updatedProfile, msg: 'Perfil actualizado!' });
  } catch (err) {
    errorHandler(err, next);
  }
};
