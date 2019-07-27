const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../sql/db.js');
const queries = require('../sql/queries');

exports.signup = async (req, res, next) => {
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
  const user = req.body.user;
  const password = req.body.password;

  try {
  } catch (err) {}
};
