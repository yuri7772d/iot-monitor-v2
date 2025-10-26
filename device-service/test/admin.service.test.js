const jwt = require("jsonwebtoken");

// Mock config
jest.mock("../src/config/load", () => ({
  admin: { username: "admin", password: "1234" },
  jwt: { secret: "secret123", refreshSecret: "refresh123" },
}));

// Mock role
jest.mock("../src/util/role", () => ({
  admin: "ADMIN",
}));

// Mock error exception
const errExep = {
  USERNAME_NOT_FOUND: "username not found",
  PASSWORD_INVALID: "password invalid",
};
jest.mock("../src/error.exeption", () => errExep);

const adminService = require("../src/usecase/admin");

describe("🧪 adminService.login()", () => {
  test("✅ login success", async () => {
    const result = await adminService.login("admin", "1234");

    // ตรวจ payload ของ JWT
    const decodedToken = jwt.verify(result.token, "secret123");
    const decodedRefresh = jwt.verify(result.refreshToken, "refresh123");

    expect(decodedToken.username).toBe("admin");
    expect(decodedToken.role).toBe("ADMIN");

    expect(decodedRefresh.username).toBe("admin");
    expect(decodedRefresh.role).toBe("ADMIN");

    expect(result.payload.username).toBe("admin");
    expect(result.payload.role).toBe("ADMIN");
  });

  test("❌ invalid username", async () => {
    await expect(adminService.login("wrong", "1234")).rejects.toThrow(
      errExep.USERNAME_NOT_FOUND
    );
  });

  test("❌ invalid password", async () => {
    await expect(adminService.login("admin", "wrong")).rejects.toThrow(
      errExep.PASSWORD_INVALID
    );
  });
});

describe("🧪 adminService.refreshToken()", () => {
  test("✅ refresh token success", async () => {
    const loginResult = await adminService.login("admin", "1234");

    const result = await adminService.refreshToken(loginResult.refreshToken);

    // ตรวจ payload ของ JWT
    const decodedToken = jwt.verify(result.token, "secret123");

    expect(decodedToken.username).toBe("admin");
    expect(decodedToken.role).toBe("ADMIN");

    expect(result.payload.username).toBe("admin");
    expect(result.payload.role).toBe("ADMIN");

    expect(result.refreshToken).toBe(loginResult.refreshToken);
  });

  test("❌ refresh token invalid", async () => {
    await expect(adminService.refreshToken("invalid-token")).rejects.toThrow();
  });
});
