import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './pages/Chat';
import CreateChatRoom from './components/CreateChatRoom';
import ChatRoomList from './components/ChatRoomList';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [chatRooms, setChatRooms] = useState([]);

  // Check if the user is logged in (e.g., by checking localStorage for a token)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    setIsLoggedIn(false); // Update the login state
  };

  // Handle chat room creation
  const handleChatRoomCreated = (newChatRoom) => {
    setChatRooms((prevChatRooms) => [...prevChatRooms, newChatRoom]);
  };

  // Handle joining a chat room
  const handleJoinChatRoom = async (chatRoomId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/chatrooms/join/${chatRoomId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('You have joined the chat room!');
    } catch (err) {
      console.error('Error joining chat room:', err);
    }
  };

  return (
    <Router>
      <Routes>
        {/* Redirect to /chat if the user is already logged in */}
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/chat" /> : <Navigate to="/login" />}
        />
        {/* Login Route */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/chat" />
            ) : (
              <Login onLogin={() => setIsLoggedIn(true)} />
            )
          }
        />
        {/* Register Route */}
        <Route
          path="/register"
          element={
            isLoggedIn ? (
              <Navigate to="/chat" />
            ) : (
              <Register onRegister={() => setIsLoggedIn(true)} />
            )
          }
        />
        {/* Chat Route (Protected) */}
        <Route
          path="/chat"
          element={
            isLoggedIn ? (
              <div>
                <Chat onLogout={handleLogout} />
                <CreateChatRoom onChatRoomCreated={handleChatRoomCreated} />
                <ChatRoomList onJoinChatRoom={handleJoinChatRoom} />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;