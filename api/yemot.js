'use strict';

const { jokes, pickRandom, allJokes } = require('../lib/content');

function clean(value, max = 100) {
  return String(value ?? '').replace(/[\r\n\u0000-\u001f]/g, ' ').trim().slice(0, max);
}

function yemotRead(text) {
  // Yemot read format: speak once, collect one digit, then return input to this API.
  return `read=${clean(text, 1500)}=JOKE,,1,1,Digits,yes`;
}

function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).send(yemotRead('הפעולה אינה נתמכת.'));
  }

  const params = { ...(req.query || {}), ...(req.body && typeof req.body === 'object' ? req.body : {}) };
  const action = clean(params.action || params.op || params.mode || 'random', 30).toLowerCase();
  const category = clean(params.category || params.cat || '', 30).toLowerCase();

  if (action === 'health' || action === 'status') {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send('ok');
  }

  if (action === 'menu') {
    return res.status(200).send(yemotRead('ברוכים הבאים לבדיחות קצרות. לקבלת בדיחה נוספת הקישו ספרה כלשהי. לחזרה לתפריט הראשי הקישו אפס.'));
  }

  if (action === 'list' || action === 'all') {
    const list = category ? jokes[category] : allJokes();
    if (!list) return res.status(200).send(yemotRead('הקטגוריה לא נמצאה.'));
    return res.status(200).send(yemotRead(pickRandom(list)));
  }

  if (category && !jokes[category]) {
    return res.status(200).send(yemotRead('הקטגוריה לא נמצאה.'));
  }

  const pool = category ? jokes[category] : allJokes();
  if (!pool.length) return res.status(200).send(yemotRead('אין כרגע בדיחות זמינות.'));
  return res.status(200).send(yemotRead(pickRandom(pool)));
}

module.exports = handler;
