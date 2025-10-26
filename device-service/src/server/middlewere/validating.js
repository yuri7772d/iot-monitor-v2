// middlewares/validate.js
const { validationResult } = require('express-validator');

module.exports = (req, res, next) => {
  const errors = validationResult(req);

  // ถ้ามี error จาก express-validator
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  // ถ้าไม่ error → ไปต่อ
  next();
};