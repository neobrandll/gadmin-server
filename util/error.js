errorHandler = (err, next) => {
  if (!err.statusCode) {
    err.statuscode = 500;
  }
  next(err);
};

module.exports = errorHandler;
