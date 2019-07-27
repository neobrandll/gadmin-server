const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const eValidator = require('email-validator');

const db = require('../sql/db.js');
const queries = require('../sql/queries');
const { secret } = require('../config.js');

exports.registro = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error('Fallo de validacion');
    err.statusCode = 422;
    err.data = errors.array();
    return next(err);
  }
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
    if (!err.statusCode) {
      err.statuscode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error('Fallo de validacion');
    err.statusCode = 422;
    err.data = errors.array();
    return next(err);
  }
  try {
    const user = req.body.user;
    const isEmail = eValidator.validate(user);
    const password = req.body.password;
    let usuario;
    if (isEmail) {
      usuario = await db.oneOrNone(queries.auth.findUserWithEmail, [user]);
      if (!usuario) {
        const err = new Error('No existe una cuenta asociada al correo ingresado.');
        err.statusCode = 422;
        throw err;
      }
    } else {
      usuario = await db.oneOrNone(queries.auth.findUser, [user]);
      if (!usuario) {
        const err = new Error('No existe una cuenta asociada al usuario ingresado.');
        err.statusCode = 422;
        throw err;
      }
    }
    const isEqual = await bcrypt.compare(password, usuario.pw_usuario);
    if (!isEqual) {
      const err = new Error('Contraseña incorrecta');
      err.errorCode = 401;
      return next(err);
    }
    const profiles = await db.any(queries.auth.getProfiles, [usuario.id_usuario]);
    const payload = {
      id_usuario: usuario.id_usuario,
      em_usuario: usuario.em_usuario,
      profiles
    };
    const token = jwt.sign(payload, secret, { expiresIn: '12h' });
    res.status(200).json({ token, payload });
  } catch (err) {
    if (!err.statusCode) {
      err.statuscode = 500;
    }
    next(err);
  }
};
