const express = require("express");
const router = express.Router();
const adminUsecase = require("../../usecase/admin");
const { body } = require("express-validator");
const validatorError = require("../middlewere/validating");
const errExep = require("../../error.exeption");



router.post(
  "/login",
  [
    body("username")
      .isString()
      .withMessage(errExep.NEED_TYPE_STRING)
      .notEmpty()
      .withMessage(errExep.IS_EMPTY),
    body("password")
      .isString()
      .withMessage(errExep.NEED_TYPE_STRING)
      .notEmpty()
      .withMessage(errExep.IS_EMPTY),
  ],
  validatorError,
  async (req, res) => {
    try {
      const { username, password } = req.body;
      const result = await adminUsecase.login(username, password);

      res.cookie("token", result.token, {
        httpOnly: true, // ป้องกัน client script อ่าน cookie
        secure: false, // ใช้ true ถ้า https
        maxAge: 24 * 60 * 60 * 1000, // 1 วัน
      });

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true, // ป้องกัน client script อ่าน cookie
        secure: false, // ใช้ true ถ้า https
        maxAge: 24 * 60 * 60 * 1000 * 7, // 7 วัน
      });

      res.status(200).json(result.payload);
    } catch (error) {
      res.status(400).json({ mesage: error.message });
    }
  }
);

router.get("/refreshToken", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "No token" });
    const result = await adminUsecase.refreshToken(refreshToken);

    res.cookie("token", result.token, {
      httpOnly: true, // ป้องกัน client script อ่าน cookie
      secure: false, // ใช้ true ถ้า https
      maxAge: 24 * 60 * 60 * 1000, // 1 วัน
    });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true, // ป้องกัน client script อ่าน cookie
      secure: false, // ใช้ true ถ้า https
      maxAge: 24 * 60 * 60 * 1000 * 7, // 7 วัน
    });

    res.status(200).json(result.payload);
  } catch (error) {
    res.status(400).json({ mesage: error.message });
  }
});

module.exports = router;
