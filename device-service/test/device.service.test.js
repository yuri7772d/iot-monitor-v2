// Mock error exception
const errExep = {
  USER_USED: "user already used",
};
jest.mock("../src/error.exeption", () => errExep);

// Mock role (ไม่ใช้งานใน service นี้ แต่ไว้เผื่อ)
jest.mock("../src/util/role", () => ({
  admin: "ADMIN",
}));

// Mock repo
const mockCreateDevice = jest.fn();
const mockDeleteDevice = jest.fn();
const mockListingDevice = jest.fn();

jest.mock("../src/repo/device", () => ({
  createDevice: (...args) => mockCreateDevice(...args),
  deleteDevice: (...args) => mockDeleteDevice(...args),
  listingDevice: (...args) => mockListingDevice(...args),
}));

const deviceService = require("../src/usecase/device");

describe("🧪 deviceService.add()", () => {
  afterEach(() => jest.clearAllMocks());

  test("✅ add device success", async () => {
    mockCreateDevice.mockResolvedValue({ insertId: 1 });

    await expect(deviceService.add("password123")).resolves.toBeUndefined();
    expect(mockCreateDevice).toHaveBeenCalledWith("password123");
  });

  test("❌ add device duplicate", async () => {
    mockCreateDevice.mockRejectedValue({ code: "ER_DUP_ENTRY" });

    await expect(deviceService.add("password123")).rejects.toThrow(
      errExep.USER_USED
    );
  });

  test("❌ add device unknown error", async () => {
    const errorObj = new Error("DB error");
    mockCreateDevice.mockRejectedValue(errorObj);

    await expect(deviceService.add("password123")).rejects.toThrow("DB error");
  });
});

describe("🧪 deviceService.delete()", () => {
  afterEach(() => jest.clearAllMocks());

  test("✅ delete device success", async () => {
    mockDeleteDevice.mockResolvedValue(1); // คืนจำนวน row ที่ลบ

    const result = await deviceService.delete(10);
    expect(result).toBe(1);
    expect(mockDeleteDevice).toHaveBeenCalledWith(10);
  });
});

describe("🧪 deviceService.listing()", () => {
  afterEach(() => jest.clearAllMocks());

  test("✅ listing devices success", async () => {
    const fakeData = [
      { id: 1, password: "pass1" },
      { id: 2, password: "pass2" },
    ];
    mockListingDevice.mockResolvedValue(fakeData);

    const result = await deviceService.listing(1, 10);
    expect(result).toEqual(fakeData);
    expect(mockListingDevice).toHaveBeenCalledWith(1, 10);
  });
});
