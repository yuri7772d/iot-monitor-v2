const repo = require("../repo/user");
const errExep = require("../error.exeption");
const jwt = require("jsonwebtoken");
const { jwt: jwtConf } = require("./../config/load");
const role = require("../util/role");
exports.register = async (username, password) => {
  let result;
  try {
    result = await repo.createUser(username, password);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      throw new Error(errExep.USER_USED);
    }
    throw err;
  }
  const userId = result.insertId;
  
  // 3. สร้าง payload
  const payload = { id: userId, username, role: role.user };
  // 4. สร้าง access token + refresh token
  const token = jwt.sign(payload, jwtConf.secret, { expiresIn: "1d" });
  const refreshToken = jwt.sign(payload, jwtConf.refreshSecret, {
    expiresIn: "7d",
  });

  // 5. ส่ง response กลับ
  return {
    payload,
    token,
    refreshToken,
  };
};

exports.login = async (username, password) => {
  const user = await repo.getUserbyUsername(username);
  if (user.length == 0) {
    throw new Error(errExep.USERNAME_NOT_FOUND);
  }
  if (user[0].password != password) {
    throw new Error(errExep.PASSWORD_INVALID);
  }

  const payload = { id: user[0].id, username, role: role.user };
  // 4. สร้าง access token + refresh token
  const token = jwt.sign(payload, jwtConf.secret, { expiresIn: "1d" });
  const refreshToken = jwt.sign(payload, jwtConf.refreshSecret, {
    expiresIn: "7d",
  });

  return {
    payload,
    token,
    refreshToken,
  };
};

exports.refreshToken = async (refreshToken) => {
  const decoded = jwt.verify(refreshToken, jwtConf.refreshSecret);
  const payload = {
    id: decoded.id,
    username: decoded.username,
    role: decoded.role,
  };
  const token = jwt.sign(payload, jwtConf.secret, { expiresIn: "1d" });

  return {
    payload,
    token,
    refreshToken,
  };
};
