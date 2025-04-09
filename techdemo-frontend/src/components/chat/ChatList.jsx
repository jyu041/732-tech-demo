// components/chat/ChatList.jsx
import { useState, useEffect, useContext } from "react"; // Add useContext
import { useNavigate } from "react-router-dom";
import { ThemeContext, THEMES } from "../../context/ThemeContext"; // Import ThemeContext and THEMES
import chatService from "../../services/chatService";
import profileService from "../../services/profileService";
import Avatar from "../common/Avatar";

/**
 * Compoent for displaying list of chats
 */
const ChatList = ({ userData }) => {
  const [chats, setChats] = useState([]);
  const [exGirlfriends, setExGirlfriends] = useState({});
  const [lastMessages, setLastMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { theme } = useContext(ThemeContext);

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

        // Convert to map for easy lookup
        const exGirlfriendMap = {};
        exGirlfriendData.forEach((exGf) => {
          exGirlfriendMap[exGf.id] = exGf;
        });

        setExGirlfriends(exGirlfriendMap);

        // Get last message for each chat
        const messagesMap = {};
        for (const chat of chatData) {
          try {
            const recentMessages = await chatService.getRecentMessages(chat.id);
            if (recentMessages && recentMessages.length > 0) {
              // Get the most recent message
              messagesMap[chat.id] = recentMessages[recentMessages.length - 1];
            }
          } catch (err) {
            console.error(`Error fetching messages for chat ${chat.id}:`, err);
          }
        }

        setLastMessages(messagesMap);
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

  // Format date based on theme
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);

    if (theme === THEMES.INSTAGRAM || theme === THEMES.DISCORD) {
      // Instagram/Discord style: relative time (1m, 3h, 2d, 1w)
      if (diffMinutes < 1) return "now";
      if (diffMinutes < 60) return `${diffMinutes}m`;
      if (diffHours < 24) return `${diffHours}h`;
      if (diffDays < 7) return `${diffDays}d`;
      if (diffWeeks < 4) return `${diffWeeks}w`;
      return `${Math.floor(diffWeeks / 4)}mo`;
    } else {
      // WeChat style: actual time
      if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else {
        return date.toLocaleDateString([], {
          month: "numeric",
          day: "numeric",
        });
      }
    }
  };

  // Format message preview based on theme
  const getMessagePreview = (message) => {
    if (!message) return "";

    // Discord style: "You: " or "Username: " prefix
    if (theme === THEMES.DISCORD) {
      const prefix = message.isFromUser
        ? "You: "
        : `${exGirlfriends[message.senderId]?.name || "Ex"}: `;
      const maxLength = 20; // Shorter for Discord due to prefix
      const content =
        message.content.length <= maxLength
          ? message.content
          : message.content.substring(0, maxLength) + "...";
      return prefix + content;
    }

    // Instagram style: shorter preview
    if (theme === THEMES.INSTAGRAM) {
      const maxLength = 25;
      return message.content.length <= maxLength
        ? message.content
        : message.content.substring(0, maxLength) + "...";
    }

    // WeChat style: longer preview
    const maxLength = 30;
    return message.content.length <= maxLength
      ? message.content
      : message.content.substring(0, maxLength) + "...";
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

      const lastMessage = lastMessages[chat.id];

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
          <div
            className={`chat-list-item-details ${
              theme === THEMES.INSTAGRAM ? "instagram-chat-details" : ""
            }`}
          >
            <div className="chat-list-item-header">
              <div className="chat-list-item-name">{exGirlfriend.name}</div>
              <div className="chat-list-item-time">
                {formatDate(chat.lastMessageAt)}
              </div>
            </div>
            <div className="chat-list-item-message">
              {getMessagePreview(lastMessages[chat.id])}
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
              <div className="chat-list-item-header">
                <div className="chat-list-item-name">{exGf.name}</div>
              </div>
              <div className="chat-list-item-message">
                Start a new conversation
              </div>
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
      <div className="existing-chats-section">{renderChats()}</div>
      {renderNewChatOptions()}
    </div>
  );
};

export default ChatList;
