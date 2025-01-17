import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ChatWindow from './components/ChatWindow';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/chat" /> : <Navigate to="/login" />}
        />
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
        <Route
          path="/chat"
          element={
            isLoggedIn ? (
              <ChatWindow chatRoomId="your-chat-room-id" currentUser={currentUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;