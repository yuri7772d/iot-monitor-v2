const errExep = require("../../error.exeption");
const role = require("../../util/role")

module.exports = (req, res, next) => {
    if (!role.isAdmin(req.payload.role)) {
    return res.status(401).json({ mesage: errExep.YOU_NOT_ADMIN });
  }
  next();
};
