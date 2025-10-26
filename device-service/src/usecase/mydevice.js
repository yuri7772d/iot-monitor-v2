const { error } = require("console");
const repo = require("../repo/device");
const errExep = require("../error.exeption");
const role = require("../util/role");

exports.addMyDevice = async (payload, deviceId, password) => {
  const userID = payload.id;
  const device = await repo.getDeviceByID(deviceId);

  if (!device || device.length == 0) {
    throw new Error(errExep.DEVICE_NOT_FOUND);
  }
  if (device[0].password !== password) {
    throw new Error(errExep.PASSWORD_INVALID);
  }

  const mydevice = await repo.getMyDeviceByID(userID, deviceId);
  if (!mydevice || mydevice.length > 0) {
    throw new Error(errExep.DEVICE_ADDED);
  }
  return await repo.addMyDevice(userID, deviceId, password);
};

exports.removeMyDevice = async (payload, deviceId) => {
  const userID = payload.id;
  return await repo.removeMyDevice(userID, deviceId);
};

exports.listingMyDevice = async (payload, page, perPage) => {
  const userID = payload.id;
  return await repo.listingMyDevice(userID, page, perPage);
};

exports.getTempHistory = async (deviceId, page, perPage) => {

  return await repo.getGetTempHistory(deviceId, page, perPage);
};
