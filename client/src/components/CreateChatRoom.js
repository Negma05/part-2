import React, { useState } from 'react';
import axios from 'axios';

const CreateChatRoom = ({ onChatRoomCreated }) => {
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      console.error('Error creating chat room:', err);
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
      />
      <button type="submit">Create Chat Room</button>
    </form>
  );
};

export default CreateChatRoom;