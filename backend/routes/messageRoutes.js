const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { messageLimiter } = require('../middleware/rateLimiter');

router.get('/', messageController.getMessages);
router.post('/', messageLimiter, messageController.createMessage);

module.exports = router;