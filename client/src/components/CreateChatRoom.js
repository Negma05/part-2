import React, { useState } from 'react';
import axios from 'axios';

const CreateChatRoom = ({ onChatRoomCreated }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!name.trim()) {
      setError('Chat room name cannot be empty.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/chatrooms/create',
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onChatRoomCreated(response.data);
      setName('');
    } catch (err) {
      setError('Failed to create chat room. Please try again.');
      console.error('Error creating chat room:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter chat room name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Chat Room'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default CreateChatRoom;