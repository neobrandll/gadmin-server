const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const result = require('dotenv').config();

if (result.error) {
  throw result.error;
}
const multer = require('multer');
const { port } = require('./config.js');
const authRoutes = require('./routes/auth');
const empresaRoutes = require('./routes/empresa.js');
const adminRoutes = require('./routes/admin');
const employeeRoutes = require('./routes/employee');
const ganadoRoutes = require('./routes/ganado');
const loteRoutes = require('./routes/lote');
const potreroRoutes = require('./routes/potrero');
const pajuelaRoutes = require('./routes/pajuela');
const itemRoutes = require('./routes/item');

const app = express();

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/auth', authRoutes);
app.use('/empresa', empresaRoutes);
app.use('/admin', adminRoutes);
app.use('/employee', employeeRoutes);
app.use('/ganado', ganadoRoutes);
app.use('/lote', loteRoutes);
app.use('/potrero', potreroRoutes);
app.use('/pajuela', pajuelaRoutes);
app.use('/item', itemRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data });
});

app.listen(port, () => {
  console.log('server started!');
});
