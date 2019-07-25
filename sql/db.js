const pgp = require('pg-promise')();
const db = pgp('postgres://postgres:masterkey@localhost:5432/gadmin');

module.exports = db;
