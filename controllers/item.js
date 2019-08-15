const db = require('../sql/db.js');
const itemQueries = require('../sql/queries/item');
const PS = require('pg-promise').PreparedStatement;

const errorHandler = require('../util/error');
const validationHandler = require('../util/validationHandler');
const permissionHandler = require('../util/permissionHandler');

const ITEMS_PER_PAGE = 10;
