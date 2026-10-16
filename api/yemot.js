'use strict';

const { jokes, pickRandom, allJokes } = require('../lib/content');

function clean(value, max = 100) {
  return String(value ?? '').replace(/[\r\n\u0000-\u001f]/g, ' ').trim().slice(0, max);
}

function yemotText(text) {
  // Plain-text response for simple Yemot messages.
  return `read=${clean(text, 1500)}`;
}

function yemotJoke(text) {
  // Keep the call in a keypad-read dialog so Yemot can react to DTMF.
  // ROUTE key actions are configured in the extension's ext.ini.
  return `read=t-${clean(text, 1500)}=ROUTE,,1,1,NO,yes`;
}

function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).send(yemotText('הפעולה אינה נתמכת.'));
  }

  const params = { ...(req.query || {}), ...(req.body && typeof req.body === 'object' ? req.body : {}) };
  const action = clean(params.action || params.op || params.mode || 'random', 30).toLowerCase();
  const category = clean(params.category || params.cat || '', 30).toLowerCase();
  const digits = clean(params.ApiPhoneInput || params.ApiPhoneInput0 || params.val || params.Digits || params.digits || '', 20);

  if (action === 'health' || action === 'status') {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send('ok');
  }

  if (action === 'menu') {
    return res.status(200).send(yemotText('ברוכים הבאים לבדיחות קצרות. להגרלה של בדיחה לחצו 1. לבדיחות על בעלי חיים לחצו 2. בדיחות בית ספר לחצו 3.'));
  }

  let selectedCategory = category;
  if (!selectedCategory && digits === '2') selectedCategory = 'animals';
  if (!selectedCategory && digits === '3') selectedCategory = 'school';
  if (!selectedCategory && digits === '1') selectedCategory = 'general';

  if (action === 'list' || action === 'all') {
    const list = selectedCategory ? jokes[selectedCategory] : allJokes();
    if (!list) return res.status(200).send(yemotText('הקטגוריה לא נמצאה.'));
    return res.status(200).send(yemotText(list.join(' ')));
  }

  if (selectedCategory && !jokes[selectedCategory]) {
    return res.status(200).send(yemotText('הקטגוריה לא נמצאה. אפשר לבחור general, animals או school.'));
  }

  const pool = selectedCategory ? jokes[selectedCategory] : allJokes();
  if (!pool.length) return res.status(200).send(yemotText('אין כרגע בדיחות זמינות.'));
  return res.status(200).send(yemotJoke(pickRandom(pool)));
}

module.exports = handler;
