const express = require("express");
const router = express.Router();
const usecase = require("../../usecase/mydevice");
const { body } = require("express-validator");
const validatorError = require("./../middlewere/validating");
const errExep = require("./../../error.exeption");
const isUser = require("../middlewere/is.user");

router.post(
  "/",
  [
    body("deviceID")
      .isNumeric()
      .withMessage(errExep.NEED_TYPE_NUMBER)
      .notEmpty()
      .withMessage(errExep.IS_EMPTY),
    body("password")
      .isString()
      .withMessage(errExep.NEED_TYPE_STRING)
      .notEmpty()
      .withMessage(errExep.IS_EMPTY),
  ],
  validatorError,
  isUser,
  async (req, res) => {
    try {
      const { deviceID, password } = req.body;
      await usecase.addMyDevice(req.payload, deviceID, password);
      res.status(200).json({ mesage: "ok" });
    } catch (error) {
      res.status(400).json({ mesage: error.message });
    }
  }
);

router.delete(
  "/",
  [
    body("deviceID")
      .isNumeric()
      .withMessage(errExep.NEED_TYPE_NUMBER)
      .notEmpty()
      .withMessage(errExep.IS_EMPTY),
  ],
  validatorError,
  isUser,
  async (req, res) => {
    try {
      const { deviceID } = req.body;
      await usecase.removeMyDevice(req.payload, deviceID);
      res.status(200).json({ mesage: "ok" });
    } catch (error) {
      res.status(400).json({ mesage: error.message });
    }
  }
);

router.get("/tempHistory",
    [
    body("deviceID")
      .isNumeric()
      .withMessage(errExep.NEED_TYPE_NUMBER)
      .notEmpty()
      .withMessage(errExep.IS_EMPTY),
  ],
  validatorError,
  isUser, async (req, res) => {
  try {
    const page = req.query.page; // ดึงจาก query string
    const perPage = req.query.perPage;

    const {deviceID} = req.body

    const result = await usecase.getTempHistory(deviceID, page, perPage);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ mesage: error.message });
  }
});

router.get("/listing", isUser, async (req, res) => {
  try {
    const page = req.query?.page; // ดึงจาก query string
    const perPage = req.query?.perPage;

    const result = await usecase.listingMyDevice(req.payload, page, perPage);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ mesage: error.message });
  }
});
module.exports = router;
