const db = require('./connection')

exports.getUserbyID = async (userID) => {
  const [rows] = await db.execute(
    "SELECT * FROM user WHERE id = ? ;",
    [userID]
  );
  return rows;
};

exports.getUserbyUsername = async (username) => {
  const [rows] = await db.execute(
    "SELECT * FROM user WHERE username = ?;",
    [username]
  );
  return rows;
};

exports.createUser = async (username,password) => {
  const [rows] = await db.execute(
    "INSERT INTO user (username,password) VALUES (?,?);",
    [username,password]
  );
  return rows;
};

