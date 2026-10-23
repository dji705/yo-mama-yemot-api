'use strict';

const { jokes, pickRandom, allJokes } = require('../lib/content');

function clean(value, max = 100) {
  return String(value ?? '').replace(/[\r\n\u0000-\u001f]/g, ' ').trim().slice(0, max);
}

function yemotRead(text) {
  // Yemot's read action speaks the joke itself; say_api_answer should be disabled in ext.ini.
  return `read=${clean(text, 1500)}=JOKE,,1,1,20,No,,,,,,,,,`;
}

function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).send(yemotRead('הפעולה אינה נתמכת.'));
  }

  const params = { ...(req.query || {}), ...(req.body && typeof req.body === 'object' ? req.body : {}) };
  const action = clean(params.action || params.op || params.mode || 'random', 30).toLowerCase();
  const category = clean(params.category || params.cat || '', 30).toLowerCase();
  const digits = clean(params.ApiPhoneInput || params.ApiPhoneInput0 || params.val || params.Digits || params.digits || params.JOKE || '', 20);

  if (action === 'health' || action === 'status') {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send('ok');
  }

  if (action === 'menu') {
    return res.status(200).send(yemotRead('ברוכים הבאים לבדיחות קצרות. להגרלת בדיחה נוספת הקישו ספרה כלשהי. לחזרה לתפריט הראשי הקישו אפס.'));
  }

  let selectedCategory = category;
  if (!selectedCategory && digits === '2') selectedCategory = 'animals';
  if (!selectedCategory && digits === '3') selectedCategory = 'school';
  if (!selectedCategory && digits === '1') selectedCategory = 'general';

  if (action === 'list' || action === 'all') {
    const list = selectedCategory ? jokes[selectedCategory] : allJokes();
    if (!list) return res.status(200).send(yemotRead('הקטגוריה לא נמצאה.'));
    return res.status(200).send(yemotRead(list.join(' ')));
  }

  if (selectedCategory && !jokes[selectedCategory]) {
    return res.status(200).send(yemotRead('הקטגוריה לא נמצאה. אפשר לבחור general, animals או school.'));
  }

  const pool = selectedCategory ? jokes[selectedCategory] : allJokes();
  if (!pool.length) return res.status(200).send(yemotRead('אין כרגע בדיחות זמינות.'));
  return res.status(200).send(yemotRead(pickRandom(pool)));
}

module.exports = handler;
