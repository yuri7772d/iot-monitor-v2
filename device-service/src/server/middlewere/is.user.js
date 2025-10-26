
const errExep = require("../../error.exeption");
const role = require("../../util/role")

module.exports = (req, res, next) => {
    if (!role.isUser(req.payload.role)) {
    return res.status(401).json({ mesage: errExep.YOU_NOT_USER });
  }
  next();
};
