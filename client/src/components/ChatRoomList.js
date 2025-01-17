import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChatRoomList = ({ onJoinChatRoom }) => {
  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/chatrooms', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChatRooms(response.data);
      } catch (err) {
        console.error('Error fetching chat rooms:', err);
      }
    };

    fetchChatRooms();
  }, []);

  return (
    <div>
      <h2>Available Chat Rooms</h2>
      <ul>
        {chatRooms.map((chatRoom) => (
          <li key={chatRoom._id}>
            <span>{chatRoom.name}</span>
            <button onClick={() => onJoinChatRoom(chatRoom._id)}>Join</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatRoomList;