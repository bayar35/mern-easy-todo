const jwt = require('jsonwebtoken');
const JWT_SECRET = "миний_нууц_түлхүүр_үг_123";

module.exports = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: "Токен байхгүй, хандах эрхгүй" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Хүчингүй токен" });
  }
};
