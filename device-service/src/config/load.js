const { error } = require("console");
const dotenv = require("dotenv");
dotenv.config();

module.exports =  {
  jwt:getJwtEnv(),
  admin:getAdminEnv(),
  database:getDatabaseEnv(),
  server:getServerEnv(),
};

function getJwtEnv() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new error("JWT_SECRET not found");
  }
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  if (!refreshSecret) {
    throw new error("JWT_REFRESH_SECRET not found");
  }
  return {
    secret:secret,
    refreshSecret:refreshSecret,
  };
}

function getAdminEnv() {

    const username = process.env.ADMIN_USERNAME;
  if (!username) {
    throw new error("ADMIN_USERNAME not found");
  }
    const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new error("ADMIN_PASSWORD not found");
  }

  
  return {
    username:username,
    password:password,
  };
}

function getDatabaseEnv() {
  const host = process.env.MYSQL_HOST;
  if (!host) {
    throw new error("👁‍🗨 MYSQL_HOST not found");
  }
  const username = process.env.MYSQL_USERNAME;
  if (!username) {
    throw new error("👁‍🗨 MYSQL_USERNAME not found");
  }
  const password = process.env.MYSQL_PASSWORD;
  if (!password) {
    throw new error("👁‍🗨 MYSQL_PASSWORD not found");
  }

  const database = process.env.MYSQL_DATABASE;
  if (!database) {
    throw new error("👁‍🗨 MYSQL_DATABASE not found");
  }

  return {
    host:host,
    username:username,
    password:password,
    database:database,
  }
}

function getServerEnv() {
  const portEnv = process.env.PORT;
  if (!portEnv) {
    throw new error("PORT not found");
  }
  const port = Number(portEnv)

   if (!Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error(`❌ Invalid PORT value: "${portEnv}" — must be a number between 1 and 65535`)
   }
   return {port:port}
}
