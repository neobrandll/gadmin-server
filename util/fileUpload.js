const multer = require('multer');
const path = require('path');
const uniqid = require('uniqid');
const fs = require('fs');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(path.dirname(process.mainModule.filename), 'images', req.body.idEmpresa);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, path.join('images', req.body.idEmpresa));
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, uniqid(req.body.coGanado) + `.${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    // cb(null, false);
    cb(
      new Error('el tipo de archivo seleccionado es invalido, por favor solo use png, jpg o jpeg.')
    );
  }
};

const upload = multer({ storage: fileStorage, fileFilter: fileFilter });

module.exports = upload;
