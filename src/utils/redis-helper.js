const redis = require("redis");
const CONFIG = require("../config/config.json");
const LOCAL_CONFIG = require("../config/config-local.json");
const logger = require("./logger");

const config = LOCAL_CONFIG || CONFIG;

const client = redis.createClient({
  host: config.redisHost || "localhost",
  port: config.redisPort || 6379,
});

const getValueFromRedis = (key, callback) => {
  client.get(key, callback);
};

const setValueFromRedis = (key, value) => {
  client.set(key, value, (err) => {
    if (err) {
      logger.error("set value from redis error " + String(err));
    }
  });
};

export { getValueFromRedis, setValueFromRedis };
