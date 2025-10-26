const express = require("express");
const router = express.Router();
const usecase = require("../../usecase/device");
const { body } = require("express-validator");
const validatorError = require("./../middlewere/validating");
const errExep = require("./../../error.exeption");
const isAdmin = require("../middlewere/is.admin");

router.post(
  "/",
  [
    body("password")
      .isString()
      .withMessage(errExep.NEED_TYPE_STRING)
      .notEmpty()
      .withMessage(errExep.IS_EMPTY),
  ],
  validatorError,
  isAdmin,
  async (req, res) => {
    try {
      const {password } = req.body;
      await usecase.add( password);
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
  isAdmin,
  async (req, res) => {
    try {
      const { deviceID } = req.body;
      await usecase.delete(deviceID);
      res.status(200).json({ mesage: "ok" });
    } catch (error) {
      res.status(400).json({ mesage: error.message });
    }
  }
);


router.get("/listing", isAdmin, async (req, res) => {
  try {
    const page = req.query?.page; // ดึงจาก query string
    const perPage = req.query?.perPage;

    const result = await usecase.listing(page, perPage);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ mesage: error.message });
  }
});
module.exports = router;
