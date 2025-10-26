const mysql = require('mysql2/promise');
const { database: dbConf } = require("../config/load");

// ใช้ pool จะง่ายกว่า + รองรับหลาย query พร้อมกัน
module.exports = mysql.createPool({
  host: dbConf.host,
  user: dbConf.username,
  password: dbConf.password,
  database: dbConf.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
