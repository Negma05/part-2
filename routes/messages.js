const express = require('express');
const Message = require('../models/Message');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Fetch messages for a chat room
router.get('/:chatRoomId', authMiddleware, async (req, res) => {
  const { chatRoomId } = req.params;

  try {
    const messages = await Message.find({ chatRoom: chatRoomId })
      .populate('sender', 'username')
      .sort({ createdAt: 1 }); // Sort by creation time (oldest first)
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;