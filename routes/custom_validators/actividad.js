const actividadQueries = require('../../sql/queries/actividad.js');
const db = require('../../sql/db');
const ganadoQueries = require('../../sql/queries/ganado');
const validator = require('validator');

exports.coMaGanado = async (codigo, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const ganadoFound = await db.oneOrNone(ganadoQueries.codigoExist, [codigo, id_empresa]);
  if (!ganadoFound) {
    throw new Error('no existe ningun ganado con el codigo ingresado en la empresa');
  }
  if (ganadoFound.id_tipo_ganado !== 2) {
    throw new Error('La madre debe de ser hembra');
  }
  req.ma_ganado = ganadoFound;
  return true;
};

exports.coPaGanado = async (codigo, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const ganadoFound = await db.oneOrNone(ganadoQueries.codigoExist, [codigo, id_empresa]);
  if (!ganadoFound) {
    throw new Error('no existe ningun ganado con el codigo ingresado en la empresa');
  }
  if (ganadoFound.id_tipo_ganado !== 1) {
    throw new Error('el padre debe de ser macho');
  }
  req.pa_ganado = ganadoFound;
  return true;
};

exports.coPajuela = async (codigo, { req }) => {
  if (req.body.coPaGanado || req.query.coPaGanado) {
    throw new Error('el ganado solo puede tener un padre, toro o pajuela');
  }
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const pajuelaFound = await db.oneOrNone(ganadoQueries.pajuelaExist, [codigo, id_empresa]);
  if (!pajuelaFound) {
    throw new Error('no existe ninguna pajuela con el codigo ingresado en la empresa');
  }
  req.pa_pajuela = pajuelaFound;
  return true;
};

exports.crias = async (criasArr, { req }) => {
  const id_empresa = req.body.idEmpresa;
  if (!Array.isArray(criasArr)) {
    throw new Error('El valor ingresado no es un Array');
  }
  if (!criasArr.length > 0) {
    throw new Error('Se necesita al menos una cria para registrar el parto');
  }
  let paramQuery = 'SELECT id_ganado FROM ganado WHERE id_empresa = $1 AND co_ganado IN(';
  let pCount = 2;
  const paramsArr = [id_empresa];
  const coArr = [];
  for (const cria of criasArr) {
    if (coArr.includes(cria.coGanado)) {
      throw new Error(
        'El codigo de ganado debe de ser unico y una cria repite el mismo codigo de otra'
      );
    }
    if (!cria.tipoGanado || !validator.isIn(cria.tipoGanado.toString(), ['1', '2'])) {
      throw new Error('una de las crias ingresadas tiene el tipo de ganado incorrecto o nulo');
    }
    if (!cria.peGanado || !validator.isFloat(cria.peGanado.toString())) {
      throw new Error('el peso de las crias debe ser un numero');
    }
    if (!cria.coGanado || !validator.isInt(cria.coGanado.toString())) {
      throw new Error('una de los codigos de las crias no es entero');
    }
    paramQuery += `$${pCount},`;
    paramsArr.push(cria.coGanado);
    coArr.push(cria.coGanado);
    pCount++;
  }
  paramQuery = paramQuery.substring(0, paramQuery.length - 1);
  paramQuery += ')';
  const rs = await db.any(paramQuery, paramsArr);
  if (rs.length > 0) {
    throw new Error('una de los codigos de las crias ya esta en uso');
  }
  return true;
};

exports.idTipoParto = async (id, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  let coPaPajuela = req.body.coPaPajuela;
  if (!coPaPajuela) {
    coPaPajuela = req.query.coPaPajuela;
  }
  let coPaGanado = req.body.coPaGanado;
  if (!coPaGanado) {
    coPaGanado = req.query.coPaGanado;
  }
  if (id === '1' && coPaPajuela) {
    throw new Error('el tipo de id es parto natural y se ingreso una pajuela');
  }
  if (id === '2' && coPaGanado) {
    throw new Error('el tipo de id es parto pajuela y se ingreso el codigo de un toro');
  }
  return true;
};

exports.partoExist = async (idActividad, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const PartoFound = await db.oneOrNone(actividadQueries.partoExist, [idActividad, id_empresa]);
  if (!PartoFound) {
    throw new Error('no existe un parto con el id ingresado en la empresa');
  }
  return true;
};

exports.ganadoArr = async (ganadoArr, { req }) => {
  const id_empresa = req.body.idEmpresa;
  if (!Array.isArray(ganadoArr)) {
    throw new Error('El valor ingresado no es un Array');
  }
  if (!ganadoArr.length > 0) {
    throw new Error('No se introdujo ningun codigo de ganado');
  }
  if (ganadoArr.length > 1 && +req.body.idTipoActividad === 3) {
    throw new Error('El tipo de actividad requiere de un solo codigo de ganado');
  }
  if (+req.body.idTipoActividad === 3) {
    const ganadoFound = await db.oneOrNone(actividadQueries.vacaExists, [ganadoArr[0], id_empresa]);
    if (!ganadoFound) {
      throw new Error('No existe ninguna vaca con el codigo ingresado en la empresa');
    }
    req.id_ganado = ganadoFound.id_ganado;
    return true;
  }
  if (+req.body.idTipoActividad === 5) {
    req.idGanadoArr = [];
    let ganadoFound = null;
    await db.task(async con => {
      for (const coGanado of ganadoArr) {
        ganadoFound = await con.oneOrNone(ganadoQueries.codigoExist, [coGanado, id_empresa]);
        if (!ganadoFound) {
          throw new Error('Uno o mas de los codigos de ganado ingresado no existen en la empresa');
        }
        req.idGanadoArr.push(ganadoFound.id_ganado);
      }
    });
    return true;
  } else {
    throw new Error('por favor revisar el tipo de actividad');
  }
};

exports.updateOtrosIdGanadoArr = async (ganadoArr, { req }) => {
  const id_empresa = req.body.idEmpresa;
  if (!Array.isArray(ganadoArr)) {
    throw new Error('El valor ingresado no es un Array');
  }
  if (!ganadoArr.length > 0) {
    throw new Error('No se introdujo ningun codigo de ganado');
  }
  if (ganadoArr.length > 1 && req.actividad.id_tipo_actividad === 3) {
    throw new Error('El tipo de actividad requiere de un solo codigo de ganado');
  }
  if (req.actividad.id_tipo_actividad === 3) {
    const ganadoFound = await db.oneOrNone(actividadQueries.vacaExists, [ganadoArr[0], id_empresa]);
    if (!ganadoFound) {
      throw new Error('No existe ninguna vaca con el codigo ingresado en la empresa');
    }
    req.id_ganado = ganadoFound.id_ganado;
    return true;
  }
  if (req.actividad.id_tipo_actividad === 5) {
    req.idGanadoArr = [];
    let ganadoFound = null;
    await db.task(async con => {
      for (const coGanado of ganadoArr) {
        ganadoFound = await con.oneOrNone(ganadoQueries.codigoExist, [coGanado, id_empresa]);
        if (!ganadoFound) {
          throw new Error('Uno o mas de los codigos de ganado ingresado no existen en la empresa');
        }
        req.idGanadoArr.push(ganadoFound.id_ganado);
      }
    });
    return true;
  } else {
    throw new Error('por favor revisar el tipo de actividad');
  }
};

exports.updateOtrosIdActividad = async (idActividad, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const actividadFound = await db.oneOrNone(actividadQueries.idActividadOtrosExists, [
    idActividad,
    id_empresa
  ]);
  if (!actividadFound) {
    throw new Error('no existe ningun aborto o tratamiento con el id ingresado en la empresa');
  }
  req.actividad = actividadFound;
  return true;
};

exports.vacaExists = async (coGanado, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const ganadoFound = await db.oneOrNone(actividadQueries.vacaExists, [coGanado, id_empresa]);
  if (!ganadoFound) {
    throw new Error('No existe ninguna vaca con el codigo ingresado en la empresa');
  }
  req.id_ganado = ganadoFound.id_ganado;
  return true;
};

exports.tratamientoExists = async (idActividad, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const actividadFound = await db.oneOrNone(actividadQueries.tratamientoExists, [
    id_empresa,
    idActividad
  ]);
  if (!actividadFound) {
    throw new Error('No existe ningun tratamiento con el id ingresado en la empresa');
  }
  return true;
};

exports.tipoActividadServicio = async (idTipoActividad, { req }) => {
  if (+idTipoActividad === 6) {
    if (!req.body.coToro) {
      throw new Error(
        'El tipo de actividad es servicio natural y no se introdujo el codigo del toro'
      );
    }
    if (req.body.coPajuela) {
      throw new Error(
        'El tipo de actividad es servicio natural y se introdujo el codigo de una pajuela'
      );
    }
  }
  if (+idTipoActividad === 7) {
    if (!req.body.coPajuela) {
      throw new Error(
        'El tipo de actividad es servicio con pajuela y no se introdujo el codigo de la pajuela'
      );
    }
    if (req.body.coToro) {
      throw new Error(
        'El tipo de actividad es servicio con pajuela y se introdujo el codigo de un toro'
      );
    }
  }
  if (+idTipoActividad !== 6 && +idTipoActividad !== 7) {
    throw new Error('el id del tipo de actividad es incorrecto');
  }
  return true;
};

exports.validateCoPajuelaServicio = async (codigo, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const pajuelaFound = await db.oneOrNone(ganadoQueries.pajuelaExist, [codigo, id_empresa]);
  if (!pajuelaFound) {
    throw new Error('no existe ninguna pajuela con el codigo ingresado en la empresa');
  }
  req.id_pajuela = pajuelaFound.id_pajuela;
  return true;
};

exports.validateCoVacaServicio = async (coGanado, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const ganadoFound = await db.oneOrNone(actividadQueries.vacaExists, [coGanado, id_empresa]);
  if (!ganadoFound) {
    throw new Error('No existe ninguna vaca con el codigo ingresado en la empresa');
  }
  req.id_vaca = ganadoFound.id_ganado;
  return true;
};

exports.validateCoToroServicio = async (coGanado, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const ganadoFound = await db.oneOrNone(actividadQueries.toroExists, [coGanado, id_empresa]);
  if (!ganadoFound) {
    throw new Error('No existe ningun toro con el codigo ingresado en la empresa');
  }
  req.id_toro = ganadoFound.id_ganado;
  return true;
};

exports.validateIdServicioUpdate = async (idActividad, { req }) => {
  const id_empresa = req.body.idEmpresa;
  const servicioFound = await db.oneOrNone(actividadQueries.servicioExists, [
    idActividad,
    id_empresa
  ]);
  if (!servicioFound) {
    throw new Error('No existe ningun servicio con el id ingresado en la empresa');
  }
  if (servicioFound.id_tipo_actividad === 6) {
    if (!req.body.coToro) {
      throw new Error(
        'El tipo de actividad es servicio natural y no se introdujo el codigo del toro'
      );
    }
    if (req.body.coPajuela) {
      throw new Error(
        'El tipo de actividad es servicio natural y se introdujo el codigo de una pajuela'
      );
    }
  } else {
    if (!req.body.coPajuela) {
      throw new Error(
        'El tipo de actividad es servicio con pajuela y no se introdujo el codigo de la pajuela'
      );
    }
    if (req.body.coToro) {
      throw new Error(
        'El tipo de actividad es servicio con pajuela y se introdujo el codigo de un toro'
      );
    }
  }
  return true;
};

exports.servicioExists = async (idActividad, { req }) => {
  const id_empresa = req.params.idEmpresa;
  const servicioFound = await db.oneOrNone(actividadQueries.servicioExists, [
    idActividad,
    id_empresa
  ]);
  if (!servicioFound) {
    throw new Error('No existe ningun servicio con el id ingresado en la empresa');
  }
  req.actividad = servicioFound;
  return true;
};
