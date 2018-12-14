'use strict';

const cp = require('child_process');
const redis = require("redis");
const redisClient = redis.createClient(process.env.REDIS_URL);
const HOST_NAME = cp.execSync('hostname', {encoding: 'utf8'}).trim();

redisClient.set(
  `${Math.floor(Date.now() / 1000)} - ${HOST_NAME}`,
  'Release script runs',
  () => {
    process.exit();
  }
);
