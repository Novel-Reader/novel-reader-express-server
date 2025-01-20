import  { setToken, verifyToken } from "../../src/utils/token";

describe("token", () => {
  it("should set token success", async () => {
    const token = await setToken("test@163.com");
    expect(token).toBeDefined();
  });

  it("should verify token success", async () => {
    const token = await setToken("test@163.com");
    const info = await verifyToken(`Bearer ${token}`);
    expect(info).toBeDefined();
    expect(info.name).toBe("test@163.com");
  });

  it("should verify token failed", async () => {
    try {
      await verifyToken("Bearer 123");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
