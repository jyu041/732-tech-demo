import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import chatService from "../../services/chatService";
import profileService from "../../services/profileService";
import Avatar from "../common/Avatar";

/**
 * Component for displaying the list of chats
 */
const ChatList = ({ userData }) => {
  const [chats, setChats] = useState([]);
  const [exGirlfriends, setExGirlfriends] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load chats and ex-girlfriend data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Get user's chats
        const chatData = await chatService.getUserChats();
        setChats(chatData);

        // Get all ex-girlfriends
        const exGirlfriendData = await profileService.getAllExGirlfriends();

        // Convert to map
        const exGirlfriendMap = {};
        exGirlfriendData.forEach((exGf) => {
          exGirlfriendMap[exGf.id] = exGf;
        });

        setExGirlfriends(exGirlfriendMap);
      } catch (err) {
        console.error("Error loading chat list:", err);
        setError("Failed to load chats. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle chat selection
  const handleChatSelect = (chatId) => {
    navigate(`/chat/${chatId}`);
  };

  // Create a new chat with an ex-girlfriend
  const handleStartChat = async (exGirlfriendId) => {
    try {
      const chat = await chatService.startChat(exGirlfriendId);
      navigate(`/chat/${chat.id}`);
    } catch (err) {
      console.error("Error starting chat:", err);
      setError("Failed to start chat. Please try again.");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString();
    }
  };

  // Render chats
  const renderChats = () => {
    if (chats.length === 0) {
      return (
        <div className="empty-state">
          <p>No conversations yet.</p>
          <p>Create one by adding an ex-girlfriend profile first.</p>
        </div>
      );
    }

    return chats.map((chat) => {
      const exGirlfriend = exGirlfriends[chat.exGirlfriendId];
      if (!exGirlfriend) return null;

      return (
        <div
          key={chat.id}
          className="chat-list-item"
          onClick={() => handleChatSelect(chat.id)}
        >
          <Avatar
            src={`http://localhost:8080/uploads/${exGirlfriend.profilePicturePath}`}
            alt={exGirlfriend.name}
          />
          <div className="chat-list-item-details">
            <div className="chat-list-item-name">{exGirlfriend.name}</div>
            <div className="chat-list-item-time">
              {formatDate(chat.lastMessageAt)}
            </div>
          </div>
        </div>
      );
    });
  };

  // Render ex-girlfriends without chats
  const renderNewChatOptions = () => {
    const exGirlfriendsWithoutChats = Object.values(exGirlfriends).filter(
      (exGf) => !chats.some((chat) => chat.exGirlfriendId === exGf.id)
    );

    if (exGirlfriendsWithoutChats.length === 0) return null;

    return (
      <div className="new-chats-section">
        <h3>Start New Conversation</h3>
        {exGirlfriendsWithoutChats.map((exGf) => (
          <div
            key={exGf.id}
            className="chat-list-item"
            onClick={() => handleStartChat(exGf.id)}
          >
            <Avatar
              src={`http://localhost:8080/uploads/${exGf.profilePicturePath}`}
              alt={exGf.name}
            />
            <div className="chat-list-item-details">
              <div className="chat-list-item-name">{exGf.name}</div>
              <div className="chat-list-item-new">New conversation</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading conversations...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="chat-list">
      <div className="existing-chats-section">
        <h3>Conversations</h3>
        {renderChats()}
      </div>
      {renderNewChatOptions()}
    </div>
  );
};

export default ChatList;
