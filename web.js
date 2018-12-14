'use strict';

const cp = require('child_process');
const http = require('http');
const url = require('url');

const redis = require("redis");
const redisClient = redis.createClient(process.env.REDIS_URL);

const HOST_NAME = cp.execSync('hostname', {encoding: 'utf8'}).trim();

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url);
  if (reqUrl.pathname === '/favicon.ico') {
    res.writeHead(200, { 'Content-Type': 'image/x-icon' });
    res.end('');
    return;
  }
  console.error(`incoming: ${reqUrl.pathname}`);
  redisClient.set(`${Math.floor(Date.now() / 1000)} - ${HOST_NAME}`, `Server receives a request to "${reqUrl.pathname}"`);

  redisClient.keys(
    '*',
    (_err1, keys) => {
      redisClient.mget(
        keys,
        (_err2, values) => {
          const arr = [];
          keys.forEach((key, i) => {
            const o = {
              key: key,
              value: values[i]
            };
            arr.push(o);
          });
          arr.sort((a, b) => { 
            const timeA = parseInt(a.key.split(' ')[0], 10) ? parseInt(a.key.split(' ')[0], 10) : 0;
            const timeB = parseInt(b.key.split(' ')[0], 10) ? parseInt(b.key.split(' ')[0], 10) : 0;
            return timeA == timeB ? 0 : (timeA < timeB ? -1 : 1)
          });

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end( JSON.stringify(arr, '\n', 2) );
        }
      );
    }
  );  
});

redisClient.on(
  'error',
  (err) => {
    console.log(`Redis error: ${err}`);
  }
);

server
  .listen(
    process.env.PORT,
    '0.0.0.0',
    () => {
      console.log(`start to listen on "${process.env.PORT}"`);
      redisClient.set(`${Math.floor(Date.now() / 1000)} - ${HOST_NAME}`, 'Server starts');
    }
  )
  .close(
    () => {
      console.log(`stop to listen on "${process.env.PORT}"`);
      redisClient.set(`${Math.floor(Date.now() / 1000)} - ${HOST_NAME}`, 'Server stops');
    }
  );
