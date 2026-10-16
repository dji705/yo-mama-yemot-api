'use strict';
const http = require('node:http');
const handler = require('./api/yemot');
const port = Number(process.env.PORT || 3000);
http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  req.query = Object.fromEntries(url.searchParams.entries());
  req.body = {};
  res.status = function (code) { res.statusCode = code; return res; };
  res.send = function (body) { res.end(body); return res; };
  handler(req, res);
}).listen(port, () => console.log(`Local Yemot adapter listening on ${port}`));
