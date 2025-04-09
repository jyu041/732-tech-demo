import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ChatWindow from "../components/chat/ChatWindow";
import chatService from "../services/chatService";

/**
 * Page component for displaying a chat conversation
 */
const ChatPage = ({ user }) => {
  const { chatId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatExists, setChatExists] = useState(false);

  const navigate = useNavigate();

  // Validate chat exists and user has access
  useEffect(() => {
    const validateChat = async () => {
      try {
        setLoading(true);

        // Check if user exists
        if (!user) {
          navigate("/");
          return;
        }

        // Check if chat exists
        await chatService.getChat(chatId);

        setChatExists(true);
      } catch (err) {
        console.error("Error validating chat:", err);
        setError("Chat not found or you do not have access");
        setTimeout(() => navigate("/"), 3000);
      } finally {
        setLoading(false);
      }
    };

    validateChat();
  }, [chatId, user, navigate]);

  if (loading) {
    return <div className="loading-screen">Loading chat...</div>;
  }

  if (error) {
    return (
      <div className="error-page">
        <div className="message message-error">{error}</div>
        <p>Redirecting to home page...</p>
      </div>
    );
  }

  if (!chatExists) {
    return null;
  }

  return (
    <div className="chat-page">
      <ChatWindow chatId={chatId} user={user} />
    </div>
  );
};

export default ChatPage;
