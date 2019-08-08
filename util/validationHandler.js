const { validationResult } = require('express-validator');

const validationHandler = req => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error('Fallo de validacion');
    err.statusCode = 422;
    err.data = errors.array();
    throw err;
  }
};

module.exports = validationHandler;
