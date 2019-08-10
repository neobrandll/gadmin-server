exports.dateValidator = (fechaString, { req }) => {
  const fecha = new Date(fechaString);
  const tiempoFecha = fecha.getTime();
  if (Object.prototype.toString.call(fecha) !== '[object Date]') {
    throw new Error('La fecha ingresada es invalida');
  }
  if (isNaN(tiempoFecha) || tiempoFecha > Date.now()) {
    throw new Error('La fecha ingresada es invalida');
  }
  return true;
};
