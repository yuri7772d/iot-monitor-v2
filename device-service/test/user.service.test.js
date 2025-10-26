
// Mock repo

const jwt = require("jsonwebtoken");

// Mock config
jest.mock("../src/config/load", () => ({
  jwt: {
    secret: "secret123",
    refreshSecret: "refresh123",
  },
}));

// Mock role
jest.mock("../src/util/role", () => ({
  user: "USER",
}));

// Mock error exception
const errExep = {
  USER_USED: "user already used",
  USERNAME_NOT_FOUND: "username not found",
  PASSWORD_INVALID: "password invalid",
};
jest.mock("../src/error.exeption", () => errExep);


const mockCreateUser = jest.fn();
const mockGetUserbyUsername = jest.fn();
jest.mock("../src/repo/user", () => ({
  createUser: (...args) => mockCreateUser(...args),
  getUserbyUsername: (...args) => mockGetUserbyUsername(...args),
}));

const userService = require("../src/usecase/user");

describe("🧪 userService.register()", () => {
  afterEach(() => jest.clearAllMocks());

  test("✅ register success", async () => {
    
    mockCreateUser.mockResolvedValue({ insertId: 1 });

    const result = await userService.register("testuser", "pass123");

    expect(result.payload.username).toBe("testuser");
    expect(result.payload.role).toBe("USER");
    expect(result.token).toBeDefined();
    expect(result.refreshToken).toBeDefined();

    const decoded = jwt.verify(result.token, "secret123");
    expect(decoded.username).toBe("testuser");
  });

  test("❌ register duplicate username", async () => {
    mockCreateUser.mockRejectedValue({ code: "ER_DUP_ENTRY" });

    await expect(userService.register("testuser", "pass123")).rejects.toThrow(
      errExep.USER_USED
    );
  });
});

describe("🧪 userService.login()", () => {
  afterEach(() => jest.clearAllMocks());

  test("✅ login success", async () => {
    mockGetUserbyUsername.mockResolvedValue([{ id: 1, password: "pass123" }]);

    const result = await userService.login("testuser", "pass123");

    expect(result.payload.username).toBe("testuser");
    expect(result.payload.role).toBe("USER");
    expect(result.token).toBeDefined();
    expect(result.refreshToken).toBeDefined();
  });

  test("❌ login username not found", async () => {
    mockGetUserbyUsername.mockResolvedValue([]);

    await expect(userService.login("wronguser", "pass123")).rejects.toThrow(
      errExep.USERNAME_NOT_FOUND
    );
  });

  test("❌ login invalid password", async () => {
    mockGetUserbyUsername.mockResolvedValue([{ id: 1, password: "pass123" }]);

    await expect(userService.login("testuser", "wrongpass")).rejects.toThrow(
      errExep.PASSWORD_INVALID
    );
  });
});

describe("🧪 userService.refreshToken()", () => {
  test("✅ refresh token success", async () => {
    // สร้าง refresh token ตัวอย่าง
    const refreshToken = jwt.sign(
      { id: 1, username: "testuser", role: "USER" },
      "refresh123",
      { expiresIn: "7d" }
    );

    const result = await userService.refreshToken(refreshToken);

    expect(result.payload.username).toBe("testuser");
    expect(result.token).toBeDefined();
    expect(result.refreshToken).toBe(refreshToken);
  });
});