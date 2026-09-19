const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "миний_нууц_түлхүүр_үг_123";

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ message: "Энэ нэр бүртгэлтэй байна" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.json({ message: "Амжилттай бүртгэгдлээ" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Нэр эсвэл нууц үг буруу" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Нэр эсвэл нууц үг buruu" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.json({ token, username: user.username });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
