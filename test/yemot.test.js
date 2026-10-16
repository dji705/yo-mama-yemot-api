'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const handler = require('../api/yemot');

function invoke({ method = 'GET', query = {}, body = {} } = {}) {
  return new Promise((resolve) => {
    const headers = {};
    const res = {
      statusCode: 200,
      setHeader: (k, v) => { headers[k] = v; },
      status(code) { this.statusCode = code; return this; },
      send(text) { resolve({ statusCode: this.statusCode, headers, text }); return this; }
    };
    handler({ method, query, body }, res);
  });
}

test('random response uses Yemot read= format', async () => {
  const r = await invoke();
  assert.equal(r.statusCode, 200);
  assert.match(r.text, /^read=/);
});

test('menu response is in Hebrew and readable', async () => {
  const r = await invoke({ query: { action: 'menu' } });
  assert.match(r.text, /^read=ברוכים הבאים/);
});

test('unknown category returns a graceful IVR message', async () => {
  const r = await invoke({ query: { category: 'unknown' } });
  assert.match(r.text, /הקטגוריה לא נמצאה/);
});

test('health endpoint returns plain ok', async () => {
  const r = await invoke({ query: { action: 'health' } });
  assert.equal(r.text, 'ok');
});
