'use strict';

// Safe, generic one-liners used instead of importing appearance-based or targeted insults.
const jokes = {
  general: [
    'למה המחשב הלך לרופא? כי היה לו וירוס.',
    'מה אמר הקיר לקיר השני? נפגש בפינה.',
    'למה הספר היה עייף? כי היו לו הרבה עמודים לעבור.',
    'מה עושה שעון כשהוא רעב? הולך לאכול שנייה.',
    'למה העיפרון הלך לבית הספר? כדי ללמוד לכתוב טוב יותר.'
  ],
  animals: [
    'למה הדג לא משתמש בטלפון? כי הוא מפחד מרשת.',
    'מה אמר החתול למחשב? תפסיק לעכבר לי את הזמן.',
    'למה הציפור קמה מוקדם? כי היא רצתה לפתוח את הבוקר בשיר.'
  ],
  school: [
    'למה המחברת הייתה רגועה? כי הכול היה כתוב בה.',
    'למה הסרגל מצטיין? כי הוא תמיד ישר.',
    'מה אמר המחק לעיפרון? אל תדאג, אני מכסה אותך.'
  ]
};

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function allJokes() {
  return Object.values(jokes).flat();
}

module.exports = { jokes, pickRandom, allJokes };
