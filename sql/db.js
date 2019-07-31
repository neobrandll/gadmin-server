const pgp = require('pg-promise')();
const db = pgp(process.env.URL_DB);

module.exports = db;
