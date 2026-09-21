const jwt = require('jsonwebtoken');
const JWT_SECRET = "миний_нууц_түлхүүр_үг_123";

module.exports = (req, res, next) => {
  // Backend (middleware/auth.js)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer-ийг салгаж цэвэр токенийг авах

  if (!token) return res.status(401).json({ message: "Токен байхгүй, хандах эрхгүй" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Хүчингүй токен" });
  }
};
