import { config, client, getValueFromRedis, setValueFromRedis } from '../../src/utils/redis-helper';

describe("config and client", () => {
  it("should have config", () => {
    expect(config).toEqual(expect.any(Object));
  });

  it("should have client", () => {
    expect(client).toEqual(expect.any(Object));
  });
});

// need start server
describe("setValueFromRedis", () => {
  it("should set a key-value pair into redis", (done) => {
    const key = "test_set_value";
    const value = "test value";
    setValueFromRedis(key, value);
    setTimeout(() => {
      getValueFromRedis(key, (err, res) => {
        expect(err).toBeNull();
        expect(res).toBe(value);
        done();
      });
    }, 500);
  });
  it("test error when set redis", (done) => {
    setValueFromRedis(null, null);
    setTimeout(() => {
      getValueFromRedis(null, (err, res) => {
        expect(err.name).toBe('Error');
        done();
      });
    }, 500);
  });
});
