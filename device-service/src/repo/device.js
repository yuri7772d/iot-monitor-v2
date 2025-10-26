
const db = require('./connection')


// --- listingMyDevice ---
exports.listingMyDevice = async (userID, page, perPage) => {

  const pageNum = Number(page) || 1;
  const perPageNum = Number(perPage) || 10;
  const offset = (pageNum - 1) * perPageNum;

  const [rows] = await db.execute(
    `SELECT * FROM my_device WHERE user_id = ? ORDER BY id LIMIT ${perPageNum} OFFSET ${offset};`,
    [userID]
  );
  return rows;
};

// --- getGetTempHistory ---
exports.getGetTempHistory = async (deviceID, page, perPage) => {

  const pageNum = Number(page) || 1;
  const perPageNum = Number(perPage) || 10;
  const offset = (pageNum - 1) * perPageNum;

  const [rows] = await db.execute(
    `SELECT * FROM device_temp_history WHERE device_id = ? ORDER BY id LIMIT ${perPageNum} OFFSET ${offset};`,
    [deviceID, perPage, offset]
  );
  return rows;
};

// --- getMyDeviceByID ---
exports.getMyDeviceByID = async (userID, deviceID) => {
  const [rows] = await db.execute(
    "SELECT * FROM my_device WHERE device_id = ? AND user_id = ?;",
    [deviceID, userID]
  );
  return rows;
};

// --- addMyDevice ---
exports.addMyDevice = async (userID, deviceID) => {
  const [result] = await db.execute(
    "INSERT INTO my_device (device_id,user_id) VALUES (?,?);",
    [deviceID, userID]
  );
  return result.insertId;
};

// --- removeMyDevice ---
exports.removeMyDevice = async (userID, deviceID) => {
  const [result] = await db.execute(
    "DELETE FROM my_device WHERE device_id = ? AND user_id = ?;",
    [deviceID, userID]
  );
  return result.affectedRows > 0;
};

// --- createDevice ---
exports.createDevice = async (password) => {
  const [result] = await db.execute(
    "INSERT INTO device (password) VALUES (?);",
    [password]
  );
  return result.insertId;
};

// --- deleteDevice ---
exports.deleteDevice = async (deviceID) => {
  const [result] = await db.execute(
    "DELETE FROM device WHERE id = ? ;",
    [deviceID]
  );
  return result.affectedRows > 0;
};

// --- listingDevice ---
exports.listingDevice = async (page, perPage) => {

  const pageNum = Number(page) || 1;
  const perPageNum = Number(perPage) || 10;
  const offset = (pageNum - 1) * perPageNum;

  const [rows] = await db.execute(
    `SELECT * FROM device ORDER BY id LIMIT ${perPageNum} OFFSET ${offset};`,
  );
  return rows;
};

// --- getDeviceByID ---
exports.getDeviceByID = async (deviceID) => {
  const [rows] = await db.execute(
    "SELECT * FROM device WHERE id = ?", 
    [deviceID]
  );
 
  return rows; 
};