
const express = require("express");
const app = express();
const { server } = require("./../config/load");
const healthCheck = require("./default.router");
const myDeviceRouter = require("./router/mydevice");
const deviceRouter = require("./router/device");
const userRouter = require("./router/user");
const adminRouter = require("./router/admin");
const cookieParser  =require("cookie-parser");
const author = require('./middlewere/author')

exports.start = () => {

  app.use(express.json());
  app.use(cookieParser());

  app.get("/", healthCheck);
  app.use("/my-device",author, myDeviceRouter);
  app.use("/device",author, deviceRouter);
  app.use("/user", userRouter);
  app.use("/admin", adminRouter);
  app.listen(server.port, () => {
    console.log(`Example app listening on port ${server.port}`);
  });
};
