import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import Register from './components/Register';
import ChatWindow from './components/ChatWindow';
import CreateChatRoom from './components/CreateChatRoom';
import ChatRoomList from './components/ChatRoomList';
import './App.css'; // Add global styles

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);

  // Check if the user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      // Fetch current user details
      const fetchCurrentUser = async () => {
        try {
          const response = await axios.get('http://localhost:5000/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCurrentUser(response.data);
        } catch (err) {
          console.error('Error fetching current user:', err);
        }
      };
      fetchCurrentUser();
    }
  }, []);

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

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="app-container">
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
          {/* Chat Route */}
          <Route
            path="/chat"
            element={
              isLoggedIn ? (
                <div className="chat-layout">
                  <div className="sidebar">
                    <CreateChatRoom onChatRoomCreated={handleChatRoomCreated} />
                    <ChatRoomList onJoinChatRoom={handleJoinChatRoom} />
                  </div>
                  <div className="chat-window-container">
                    <ChatWindow chatRoomId="your-chat-room-id" currentUser={currentUser} />
                  </div>
                </div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          {/* Chat Room Route */}
          <Route
            path="/chat/:chatRoomId"
            element={
              isLoggedIn ? (
                <div className="chat-layout">
                  <div className="sidebar">
                    <CreateChatRoom onChatRoomCreated={handleChatRoomCreated} />
                    <ChatRoomList onJoinChatRoom={handleJoinChatRoom} />
                  </div>
                  <div className="chat-window-container">
                    <ChatWindow currentUser={currentUser} />
                  </div>
                </div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;