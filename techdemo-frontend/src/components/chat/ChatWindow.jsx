import { useState, useEffect, useRef } from "react";
import chatService from "../../services/chatService";
import profileService from "../../services/profileService";
import ChatHeader from "./ChatHeader";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import ThemeToggle from "../common/ThemeToggle";

const ChatWindow = ({ chatId, user }) => {
  const [messages, setMessages] = useState([]);
  const [exGirlfriend, setExGirlfriend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const messagesEndRef = useRef(null);
  const chatMessagesRef = useRef(null);
  const inputRef = useRef(null);

  // Load chat data and messages
  useEffect(() => {
    const loadChatData = async () => {
      try {
        setLoading(true);

        // Get chat details
        const chatData = await chatService.getChat(chatId);

        // Get ex-girlfriend details
        const exGirlfriendData = await profileService.getExGirlfriend(
          chatData.exGirlfriendId
        );
        setExGirlfriend(exGirlfriendData);

        // Get chat messages
        const messageData = await chatService.getChatMessages(chatId);

        // Fix the property mismatch - convert fromUser to isFromUser
        const processedMessages = messageData.map((msg) => {
          return {
            ...msg,
            // The backend uses "fromUser" but our frontend expects "isFromUser"
            isFromUser: msg.fromUser === true || msg.isFromUser === true,
          };
        });

        setMessages(processedMessages);
      } catch (err) {
        console.error("Error loading chat:", err);
        setError("Failed to load chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (chatId) {
      loadChatData();
    }
  }, [chatId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input after messages change
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Toggle settings panel
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  // Send a message
  const handleSendMessage = async (content) => {
    try {
      setSendingMessage(true);

      // Create a temporary user message
      const tempUserMessage = {
        id: "temp-" + Date.now(),
        content,
        isFromUser: true,
        timestamp: new Date().toISOString(),
      };

      // Add temporary message to state
      setMessages((prev) => [...prev, tempUserMessage]);

      // Send to API and get AI response
      const response = await chatService.sendMessage(chatId, content);

      // Remove temporary message
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== tempUserMessage.id)
      );

      // Add permanent user message
      const userMessage = {
        id: response.userMessageId || "user-" + Date.now(),
        content,
        isFromUser: true,
        timestamp: new Date().toISOString(),
      };

      // Process AI response - handle the fromUser vs isFromUser mismatch
      const aiMessage = {
        ...response.aiResponse,
        // Convert fromUser to isFromUser if needed
        isFromUser:
          response.aiResponse.fromUser === true ||
          response.aiResponse.isFromUser === true,
      };

      // Add both messages to state
      setMessages((prev) => [...prev, userMessage, aiMessage]);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");

      // Remove temporary message if failed
      setMessages((prev) => prev.filter((msg) => !msg.id.startsWith("temp-")));
    } finally {
      setSendingMessage(false);

      // Focus the input field after sending
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading conversation...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="chat-window">
      <div className="chat-header-fixed">
        <ChatHeader
          exGirlfriend={exGirlfriend}
          toggleSettings={toggleSettings}
        />
      </div>

      <div className="chat-content" ref={chatMessagesRef}>
        <div className="chat-messages">
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message}
              userImage={user?.profilePicturePath}
              exGirlfriendImage={exGirlfriend?.profilePicturePath}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {showSettings && (
          <div className="settings-panel">
            <h2>Settings</h2>
            <ThemeToggle />
            <div className="ex-details">
              <h3>About {exGirlfriend.name}</h3>
              {exGirlfriend.personality && (
                <div className="personality-section">
                  <h4>Personality</h4>
                  <p>{exGirlfriend.personality}</p>
                </div>
              )}
              {exGirlfriend.backstory && (
                <div className="backstory-section">
                  <h4>Your History</h4>
                  <p>{exGirlfriend.backstory}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="chat-input-fixed">
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={sendingMessage}
          inputRef={inputRef}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
