const usecase = require('../src/usecase/mydevice');
const repo = require('../src/repo/device');
const errExep = require('../src/error.exeption');

// mock repo functions
jest.mock('../src/repo/device');

describe('MyDevice Usecase', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('addMyDevice - DEVICE_NOT_FOUND', async () => {
    repo.getDeviceByID.mockResolvedValue(null); // ไม่มี device

    await expect(usecase.addMyDevice(1, 10, 'pass'))
      .rejects
      .toThrow(errExep.DEVICE_NOT_FOUND);
  });

  test('addMyDevice - PASSWORD_INVALID', async () => {
    repo.getDeviceByID.mockResolvedValue([{ password: '1234' }]);
    
    await expect(usecase.addMyDevice(1, 10, '123'))
      .rejects
      .toThrow(errExep.PASSWORD_INVALID);
  });

  test('addMyDevice - DEVICE_ADDED', async () => {
    repo.getDeviceByID.mockResolvedValue([{ password: 'abcd' }]);
    repo.getMyDeviceByID.mockResolvedValue([{ device_id: 10 }]);

    await expect(usecase.addMyDevice(1, 10, 'abcd'))
      .rejects
      .toThrow(errExep.DEVICE_ADDED);
  });

  test('addMyDevice - success', async () => {
    repo.getDeviceByID.mockResolvedValue([{ password: 'abcd' }]);
    repo.getMyDeviceByID.mockResolvedValue([]); // ยังไม่ถูกเพิ่ม
    repo.addMyDevice.mockResolvedValue({ insertId: 1 });

    const result = await usecase.addMyDevice(1, 10, 'abcd');
    expect(result).toEqual({ insertId: 1 });
  });

});

test('removeMyDevice calls repo', async () => {
  repo.removeMyDevice.mockResolvedValue(true);
  const result = await usecase.removeMyDevice({id:1}, 10);
  expect(result).toBe(true);
  expect(repo.removeMyDevice).toHaveBeenCalledWith(1, 10);
});

test('listingMyDevice calls repo', async () => {
  repo.listingMyDevice.mockResolvedValue([{ device_id: 10 }]);
  const result = await usecase.listingMyDevice(1, 1, 10);
  expect(result).toEqual([{ device_id: 10 }]);
});

test('getTempHistory calls repo', async () => {
  repo.getGetTempHistory.mockResolvedValue([{ temp: 30 }]);
  const result = await usecase.getTempHistory(10, 1, 10);
  expect(result).toEqual([{ temp: 30 }]);
});