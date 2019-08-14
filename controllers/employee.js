const bcrypt = require('bcryptjs');

const db = require('../sql/db.js');
const empresaQueries = require('../sql/queries/empresa');
const authQueries = require('../sql/queries/auth');
const adminQueries = require('../sql/queries/admin');
const employeeQueries = require('../sql/queries/employee');
const errorHandler = require('../util/error');
const validationHandler = require('../util/validationHandler');
const permissionHandler = require('../util/permissionHandler');

//METODO PARA CREAR USUARIO SI LA PERSONA YA EXISTE EN LA EMPRESA
exports.createUser = async (req, res, next) => {
  try {
    await validationHandler(req);
    const ci_persona = req.body.ci;
    const persona = await db.one(employeeQueries.getPersona, [ci_persona]);
    const pw = req.body.password;
    const username = req.body.user;
    const hashedPw = await bcrypt.hash(pw, 12);
    await db.none(employeeQueries.createUser, [username, hashedPw, persona.id_persona]);
    res.status(201).json({ msg: 'usuario creado!', username });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.createEmployee = async (req, res, next) => {
  try {
    await validationHandler(req);
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const email = req.body.email;
    const telf = req.body.telf;
    const ci = req.body.ci;
    const pais = req.body.pais;
    const estado = req.body.estado;
    const ciudad = req.body.ciudad;
    const calle = req.body.calle;
    const id_cargo = req.body.idCargo;
    const id_empresa = req.body.idEmpresa;
    const id_usuario = req.id_usuario;
    await permissionHandler(
      id_empresa,
      id_usuario,
      5,
      'No se tienen permisos para manejar empleados o cargos'
    );
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
        await con.none(employeeQueries.addCargoToPersona, [persona.ci_persona, id_cargo]);
        res.status(201).json({ msg: 'empleado creado!' });
      } catch (err) {
        errorHandler(err, next);
      }
    });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.updateEmployeeProfile = async (req, res, next) => {
  try {
    await validationHandler(req);
    const no_persona = req.body.nombre;
    const ap_persona = req.body.apellido;
    const te_persona = req.body.telf;
    const newCi = req.body.newCi;
    const oldCi = req.body.oldCi;
    const email = req.body.email;
    const id_usuario = req.id_usuario;
    const id_empresa = req.body.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      5,
      'No se tienen permisos para manejar empleados o cargos'
    );
    const updatedProfile = await db.one(employeeQueries.updateEmployeeProfile, [
      no_persona,
      ap_persona,
      te_persona,
      newCi,
      email,
      oldCi
    ]);
    res.status(200).json({ updatedProfile });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.getEmployees = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.params.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      5,
      'No se tienen permisos para manejar empleados o cargos'
    );
    let filter = '%%';
    if (req.query.filter) {
      filter = `%${req.query.filter}%`;
    }
    const employees = await db.any(employeeQueries.getEmployees, [filter, id_empresa]);
    res.status(200).json({ employees });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.getEmployee = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.params.idEmpresa;
    const ci_persona = req.params.ci;
    await permissionHandler(
      id_empresa,
      id_usuario,
      5,
      'No se tienen permisos para manejar empleados o cargos'
    );
    db.task(async con => {
      try {
        const employee = await con.one(employeeQueries.getEmployee, [id_empresa, ci_persona]);
        const cargos = await con.many(employeeQueries.getCargosEmployee, [id_empresa, ci_persona]);
        res.status(200).json({ employee, cargos });
      } catch (err) {
        errorHandler(err, next);
      }
    });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.updateEmployeeAddress = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.body.idEmpresa;
    const pais = req.body.pais;
    const estado = req.body.estado;
    const ciudad = req.body.ciudad;
    const calle = req.body.calle;
    const ci_persona = req.body.ci;
    await permissionHandler(
      id_empresa,
      id_usuario,
      5,
      'No se tienen permisos para manejar empleados o cargos'
    );
    const updatedAddress = await db.one(employeeQueries.updateEmployeeAddress, [
      pais,
      estado,
      ciudad,
      calle,
      ci_persona
    ]);
    res.status(200).json({ updatedAddress });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.createCargo = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.body.idEmpresa;
    const de_cargo = req.body.deCargo;
    await permissionHandler(
      id_empresa,
      id_usuario,
      5,
      'No se tienen permisos para manejar empleados o cargos'
    );
    const cargo = await db.one(employeeQueries.createCargo, [id_empresa, de_cargo]);
    res.status(201).json({ msg: 'cargo creado!', cargo });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.updateCargo = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.body.idEmpresa;
    const id_cargo = req.body.idCargo;
    const de_cargo = req.body.deCargo;
    await permissionHandler(
      id_empresa,
      id_usuario,
      5,
      'No se tienen permisos para manejar empleados'
    );
    const updatedCargo = await db.one(employeeQueries.updateCargo, [de_cargo, id_cargo]);
    res.status(200).json({ updatedCargo, msg: 'cargo actualizado!' });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.getCargosEmpresa = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.params.idEmpresa;
    await permissionHandler(
      id_empresa,
      id_usuario,
      5,
      'No se tienen permisos para manejar empleados'
    );
    let filter = '%%';
    if (req.query.filter) {
      filter = `%${req.query.filter}%`;
    }
    const cargos = await db.manyOrNone(employeeQueries.getCargosEmpresa, [filter, id_empresa]);
    res.status(200).json({ cargos });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.addCargoToPersona = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.body.idEmpresa;
    const id_cargo = req.body.idCargo;
    const ci_persona = req.body.ci;
    await permissionHandler(
      id_empresa,
      id_usuario,
      5,
      'No se tienen permisos para manejar empleados'
    );
    const cargos = await db.manyOrNone(employeeQueries.getCargosPersona, [ci_persona]);
    for (const cargo of cargos) {
      if (cargo.id_cargo === +id_cargo) {
        const err = new Error('La persona ingresada ya posee el cargo ingresado');
        err.statusCode = 422;
        throw err;
      }
    }
    await db.none(employeeQueries.addCargoToPersona, [ci_persona, id_cargo]);
    res.status(200).json({ msg: 'cargo anadido!' });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.removeCargoFromPersona = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.params.idEmpresa;
    const id_cargo = req.params.idCargo;
    const ci_persona = req.params.ci;
    await permissionHandler(
      id_empresa,
      id_usuario,
      5,
      'No se tienen permisos para manejar empleados'
    );
    const cargoFound = await db.oneOrNone(employeeQueries.personaHaveCargo, [id_cargo, ci_persona]);
    if (!cargoFound) {
      const err = new Error('la persona ingresada no posee el cargo a eliminar');
      err.statusCode = 422;
      throw err;
    }
    await db.none(employeeQueries.removeCargoFromPersona, [id_cargo, ci_persona]);
    res.status(200).json({ msg: 'cargo removido' });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.deleteCargo = async (req, res, next) => {
  try {
    await validationHandler(req);
    const id_usuario = req.id_usuario;
    const id_empresa = req.params.idEmpresa;
    const id_cargo = req.params.idCargo;
    await permissionHandler(
      id_empresa,
      id_usuario,
      5,
      'No se tienen permisos para manejar empleados o cargos'
    );
    await db.none(employeeQueries.deleteCargo, [id_cargo]);
    res.status(200).json({ msg: 'cargo eliminado' });
  } catch (err) {
    errorHandler(err, next);
  }
};
