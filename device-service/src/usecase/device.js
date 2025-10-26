const { error } = require("console");
const repo = require("../repo/device");
const errExep = require("../error.exeption");
const role = require("../util/role");

exports.add= async (password) => {
  try {
   await repo.createDevice(password);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      throw new Error(errExep.USER_USED);
    }
    throw err;
  }
};

exports.delete = async (deviceId) => {
  return await repo.deleteDevice(deviceId);
};

exports.listing = async (page, perPage) => {

  return await repo.listingDevice(page, perPage);
};

