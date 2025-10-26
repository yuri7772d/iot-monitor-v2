const errExep = require("../error.exeption");
const jwt = require("jsonwebtoken");
const { admin: adminConf,jwt :jwtConf } = require("./../config/load");
const role = require("../util/role");

exports.login = async (username, password) => {
  if (username != adminConf.username){
    throw new Error(errExep.USERNAME_NOT_FOUND);
  }

  if (adminConf.password != password) {
    throw new Error(errExep.PASSWORD_INVALID);
  }

  const payload = { id: -1, username, role: role.admin };
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
