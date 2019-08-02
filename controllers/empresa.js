const db = require('../sql/db.js');
const empresaQueries = require('../sql/queries/empresa');
const authQueries = require('../sql/queries/auth');
const adminQueries = require('../sql/queries/admin');
const errorHandler = require('../util/error');
const validationHandler = require('../util/validationHandler');
const sendEmail = require('../util/email');

exports.getProfiles = async (req, res, next) => {
  try {
    validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.params.id_empresa;
    const profiles = await db.manyOrNone(empresaQueries.getProfiles, [id_usuario, id_empresa]);
    if (!profiles) {
      const err = new Error('El usuario no posee perfiles en la empresa seleccionada');
      err.statusCode = 401;
      throw err;
    }
    res.status(200).json({ profiles });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.createEmpresa = async (req, res, next) => {
  try {
    validationHandler(req);
    const pais = req.body.pais;
    const estado = req.body.estado;
    const ciudad = req.body.ciudad;
    const calle = req.body.calle;
    const id_usuario = req.id_usuario;
    const no_empresa = req.body.nombreEmpresa;
    const ri_empresa = req.body.rifEmpresa;
    db.task(async con => {
      try {
        const direccion = await con.one(authQueries.insertDireccion, [pais, estado, ciudad, calle]);
        const empresa = await con.one(empresaQueries.createEmpresa, [
          id_usuario,
          direccion.id_direccion,
          no_empresa,
          ri_empresa
        ]);
        res.status(201).json({ msg: 'empresa creada!', empresa });
      } catch (err) {
        errorHandler(err, next);
      }
    });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.updateAddress = async (req, res, next) => {
  try {
    //SOLAMENTE SI TIENE PERMISOS
    validationHandler(req);
    const id_empresa = req.body.empresaId;
    const pais = req.body.pais;
    const estado = req.body.estado;
    const ciudad = req.body.ciudad;
    const calle = req.body.calle;
    const updatedAddress = await db.one(empresaQueries.updateAddress, [
      pais,
      estado,
      ciudad,
      calle,
      id_empresa
    ]);
    res.status(200).json({ msg: 'se actualizo la direccion!', updatedAddress });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.getEmpresa = async (req, res, next) => {
  try {
    validationHandler(req);
    const id_empresa = req.params.id_empresa;
    const empresa = await db.one(empresaQueries.getEmpresa, [id_empresa]);
    res.status(200).json({ empresa });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    validationHandler(req);
    const ri_empresa = req.body.rifEmpresa;
    const no_empresa = req.body.nombreEmpresa;
    const id_empresa = req.body.idEmpresa;
    const id_usuario = req.id_usuario;
    const permission = await db.oneOrNone(adminQueries.searchPermission, [
      id_usuario,
      2,
      id_empresa
    ]);
    if (!permission) {
      const err = new Error('No se tienen permisos para modificar el perfil de la empresa');
      err.statusCode = 401;
      throw err;
    }
    const updatedProfile = await db.one(empresaQueries.updateEmpresaProfile, [
      no_empresa,
      ri_empresa,
      id_empresa
    ]);
    res.status(200).json({ msg: 'perfil de la empresa actualizado!', updatedProfile });
  } catch (err) {
    errorHandler(err, next);
  }
};
