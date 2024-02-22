const redis = require('redis');
const CONFIG = require("../config/config.json");
const logger = require("./logger");

const client = redis.createClient({
  host: CONFIG.redisHost || 'localhost',
  port: CONFIG.redisPort || 6379,
});

const getValueFromRedis = (key, callback) => {
  client.get(key, callback);
}

const setValueFromRedis = (key, value) => {
  client.set(key, value, (err) => {
    if (err) {
      logger.error('set value from redis error ' + String(err));
    }
  });
}

export { getValueFromRedis, setValueFromRedis };
