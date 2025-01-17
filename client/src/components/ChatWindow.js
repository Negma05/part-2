import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Message from './Message';

const socket = io('http://localhost:5000');

const ChatWindow = ({ chatRoomId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Fetch messages for the chat room
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/messages/${chatRoomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(response.data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();
  }, [chatRoomId]);

  // Join the chat room
  useEffect(() => {
    if (chatRoomId) {
      socket.emit('joinRoom', chatRoomId);
    }
  }, [chatRoomId]);

  // Listen for new messages
  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  // Scroll to the bottom of the chat window when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        sender: currentUser._id,
        content: newMessage,
        chatRoom: chatRoomId,
      };

      // Emit the message to the server
      socket.emit('sendMessage', message);
      setNewMessage('');
    }
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((message) => (
          <Message
            key={message._id}
            message={message}
            own={message.sender._id === currentUser._id}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;