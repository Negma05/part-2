const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const db = require('./config/db');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Connect to MongoDB
mongoose.connect(db.url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Mingleo: Connected to MongoDB'))
  .catch(err => console.error('Mingleo: MongoDB connection error:', err));

// Middleware
app.use(express.json());

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join a chat room
  socket.on('joinRoom', (chatRoomId) => {
    socket.join(chatRoomId);
    console.log(`User ${socket.id} joined room ${chatRoomId}`);
  });

  // Listen for chat messages
  socket.on('sendMessage', async (data) => {
    const { sender, content, chatRoom } = data;

    try {
      // Save the message to the database
      const message = new Message({ sender, content, chatRoom });
      await message.save();

      // Broadcast the message to all users in the chat room
      io.to(chatRoom).emit('receiveMessage', message);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});