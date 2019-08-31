const db = require('../../sql/db');

const ganadoQueries = require('../../sql/queries/ganado');

exports.deRazaExist = async (deRaza, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const deRazaFound = await db.oneOrNone(ganadoQueries.deRazaExist, [deRaza, id_empresa]);
  if (deRazaFound) {
    throw new Error('Ya existe una raza con la descripcion ingresada');
  }
  return true;
};

exports.razaExist = async (id_raza, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const razaFound = await db.oneOrNone(ganadoQueries.razaExist, [id_raza, id_empresa]);
  if (!razaFound) {
    throw new Error('no existe ninguna raza con el id ingresado en la empresa seleccionada');
  }else{
    req.raza = razaFound
  }
  return true;
};

exports.updateDeRaza = async (deRaza, { req }) => {
  let id_empresa = req.body.idEmpresa;
  const id_raza = +req.body.idRaza;
  const razaFound = await db.oneOrNone(ganadoQueries.deRazaExist, [deRaza, id_empresa]);
  if (razaFound) {
    if (razaFound.id_raza !== id_raza) {
      throw new Error('Ya existe una raza con la descripcion ingresada');
    }
  }
  return true;
};

exports.tipoGanado = (tipoGanado, { req }) => {
  const esGanado = req.body.idEstadoGanado;
  if (tipoGanado !== '1' && tipoGanado !== '2') {
    throw new Error('El id del tipo ingresado es incorrecto');
  }
  if (tipoGanado === '1' && esGanado === '4') {
    throw new Error('estado incorrecto, los machos no pueden estar prenados.');
  }
  return true;
};

exports.razaExistOrMestizo = async (id_raza, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const raza = '' + id_raza;
  if (raza.toLowerCase() === 'mestizo') {
    const mestizoFound = await db.oneOrNone(ganadoQueries.deRazaExist, ['mestizo', id_empresa]);
    if (mestizoFound) {
      req.id_mestizo = mestizoFound.id_raza;
      return true;
    }
    const newMestizo = await db.one(ganadoQueries.createRaza, [id_empresa, 'Mestizo']);
    req.id_mestizo = newMestizo.id_raza;
    return true;
  }
  const razaFound = await db.oneOrNone(ganadoQueries.razaExist, [id_raza, id_empresa]);
  if (!razaFound) {
    throw new Error('no existe ninguna raza con el id ingresado en la empresa seleccionada');
  }
  return true;
};

exports.coPaGanado = async (codigo, { req }) => {
  if (codigo === '-1') {
    req.id_pa_ganado = -1;
    return true;
  } else {
    if (req.body.coPaPajuela && req.body.coPaPajuela !== '-1') {
      throw new Error('el ganado solo puede tener un padre, ganado o pajuela');
    }
  }
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const codigoGanado = req.body.coGanado;
  if (codigoGanado === codigo) {
    throw new Error('El codigo del padre no puede ser el mismo que el del ganado');
  }
  const ganadoFound = await db.oneOrNone(ganadoQueries.codigoExist, [codigo, id_empresa]);
  if (!ganadoFound) {
    throw new Error('no existe ningun ganado con el codigo ingresado en la empresa');
  }
  if (ganadoFound.id_tipo_ganado !== 1) {
    throw new Error('El padre debe de ser macho!');
  }
  req.id_pa_ganado = ganadoFound.id_ganado;
  return true;
};

exports.coMaGanado = async (codigo, { req }) => {
  if (codigo === '-1') {
    req.id_ma_ganado = -1;
    return true;
  }
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const codigoGanado = req.body.coGanado;
  if (codigoGanado === codigo) {
    throw new Error('El codigo de la madre no puede ser el mismo que el del ganado');
  }
  const ganadoFound = await db.oneOrNone(ganadoQueries.codigoExist, [codigo, id_empresa]);
  if (!ganadoFound) {
    throw new Error('no existe ningun ganado con el codigo ingresado en la empresa');
  }
  if (ganadoFound.id_tipo_ganado !== 2) {
    throw new Error('La madre debe de ser hembra');
  }
  req.id_ma_ganado = ganadoFound.id_ganado;
  return true;
};

exports.coPajuela = async (codigo, { req }) => {
  if (codigo === '-1') {
    req.id_pa_pajuela = -1;
    return true;
  } else {
    if (req.body.coPaGanado && req.body.coPaGanado !== '-1') {
      throw new Error('el ganado solo puede tener un padre, ganado o pajuela');
    }
  }
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const pajuelaFound = await db.oneOrNone(ganadoQueries.pajuelaExist, [codigo, id_empresa]);
  if (!pajuelaFound) {
    throw new Error('no existe ninguna pajuela con el codigo ingresado en la empresa');
  }
  req.id_pa_pajuela = pajuelaFound.id_pajuela;
  return true;
};

exports.coGanadoAvailable = async (codigo, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const codigoFound = await db.oneOrNone(ganadoQueries.codigoExist, [codigo, id_empresa]);
  if (codigoFound) {
    throw new Error('ya existe un ganado con el mismo codigo en la empresa');
  }
  return true;
};

exports.coGanadoExist = async (codigo, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const ganadoFound = await db.oneOrNone(ganadoQueries.codigoExist, [codigo, id_empresa]);
  if (!ganadoFound) {
    throw new Error('No existe un ganado con el codigo ingresado en la empresa');
  }
  //aqui adjunto la direccion de la foto para eliminarla si se actualiza;
  req.fo_ganado = ganadoFound.fo_ganado;
  req.id_ganado = ganadoFound.id_ganado;
  return true;
};

exports.newCoGanado = async (newCodigo, { req }) => {
  let id_empresa = req.body.idEmpresa;
  if (!id_empresa) {
    id_empresa = req.params.idEmpresa;
  }
  const oldCoGanado = req.body.coGanado;
  if (oldCoGanado === newCodigo) {
    return true;
  }
  const codigoFound = await db.oneOrNone(ganadoQueries.codigoExist, [newCodigo, id_empresa]);
  if (codigoFound) {
    throw new Error('ya existe un ganado con el mismo codigo en la empresa');
  }
  return true;
};
