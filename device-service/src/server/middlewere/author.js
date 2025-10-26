const jwt = require("jsonwebtoken");
const { jwt: jwtConf } = require("../../config/load");
const errExep = require("../../error.exeption");

module.exports = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ mesage: errExep.TOKEN_NOT_FOUND });
  }
  try {
    const payload = jwt.verify(token, jwtConf.secret);
    req.payload = payload;
  } catch (error) {
    return res.status(401).json({ mesage: errExep.TOKEN_INVALID });
  }

  next();
};
