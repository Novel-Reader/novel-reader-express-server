const mysql = require("mysql");
const CONFIG = require("../config/config.json");
const LOCAL_CONFIG = require("../config/config-local.json");
const logger = require("./logger");

const config = LOCAL_CONFIG || CONFIG;

const mysql_config = {
  host: config.mysqlHost,
  port: config.mysqlPort,
  user: config.user,
  password: config.password,
  database: config.database,
  connectionLimit: config.connectionLimit || 10,
  charset: "UTF8MB4",
  timezone: "+00:00",
};

const pool = mysql.createPool(mysql_config);

function DBHelper(sql, callback, add = null) {
  try {
    if (add !== null) {
      pool.query(sql, add, callback);
    } else {
      pool.query(sql, callback);
    }
  } catch (error) {
    logger.error(error);
  }
}

module.exports = DBHelper;
