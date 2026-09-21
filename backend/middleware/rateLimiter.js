const rateLimit = require('express-rate-limit');

// Ерөнхий API хязгаарлалт
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // 15 минутад 100 хүсэлт
  message: {
    message: 'Хэт олон хүсэлт илгээлээ. 15 минутын дараа дахин оролдоно уу.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Нэвтрэх / Бүртгүүлэх хязгаарлалт (илүү хатуу)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 15 минутад 10 оролдлого
  message: {
    message:
      'Хэт олон нэвтрэх оролдлого. 15 минутын дараа дахин оролдоно уу.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Мессеж илгээх хязгаарлалт
const messageLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 минут
  max: 30, // 1 минутад 30 мессеж
  message: {
    message: 'Хэт олон мессеж илгээлээ. Түр хүлээнэ үү.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { apiLimiter, authLimiter, messageLimiter };