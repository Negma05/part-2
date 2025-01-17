const express = require('express');
const ChatRoom = require('../models/ChatRoom');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new chat room
router.post('/create', authMiddleware, async (req, res) => {
  const { name } = req.body;
  const createdBy = req.user.id;

  try {
    // Check if a chat room with the same name already exists
    const existingChatRoom = await ChatRoom.findOne({ name });
    if (existingChatRoom) {
      return res.status(400).json({ message: 'Chat room with this name already exists.' });
    }

    // Create a new chat room
    const chatRoom = new ChatRoom({ name, createdBy, members: [createdBy] });
    await chatRoom.save();

    res.status(201).json(chatRoom);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Join a chat room
router.post('/join/:id', authMiddleware, async (req, res) => {
  const chatRoomId = req.params.id;
  const userId = req.user.id;

  try {
    // Find the chat room
    const chatRoom = await ChatRoom.findById(chatRoomId);
    if (!chatRoom) {
      return res.status(404).json({ message: 'Chat room not found.' });
    }

    // Check if the user is already a member
    if (chatRoom.members.includes(userId)) {
      return res.status(400).json({ message: 'You are already a member of this chat room.' });
    }

    // Add the user to the chat room
    chatRoom.members.push(userId);
    await chatRoom.save();

    res.json(chatRoom);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Leave a chat room
router.post('/leave/:id', authMiddleware, async (req, res) => {
  const chatRoomId = req.params.id;
  const userId = req.user.id;

  try {
    // Find the chat room
    const chatRoom = await ChatRoom.findById(chatRoomId);
    if (!chatRoom) {
      return res.status(404).json({ message: 'Chat room not found.' });
    }

    // Check if the user is a member
    if (!chatRoom.members.includes(userId)) {
      return res.status(400).json({ message: 'You are not a member of this chat room.' });
    }

    // Remove the user from the chat room
    chatRoom.members = chatRoom.members.filter((member) => member.toString() !== userId);
    await chatRoom.save();

    res.json(chatRoom);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get all chat rooms
router.get('/', authMiddleware, async (req, res) => {
  try {
    const chatRooms = await ChatRoom.find().populate('createdBy', 'username').populate('members', 'username');
    res.json(chatRooms);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;