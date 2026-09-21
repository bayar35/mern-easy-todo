const Message = require('../models/Message');

// Бүх мессеж авах
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 }).limit(100);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Шинэ мессеж хадгалах
exports.createMessage = async (req, res) => {
  try {
    const { sender, text } = req.body;
    const message = new Message({ sender, text });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};