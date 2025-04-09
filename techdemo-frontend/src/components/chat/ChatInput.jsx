import { useState } from "react";
import Button from "../common/Button";

/**
 * Component for chat message input
 */
const ChatInput = ({ onSendMessage, isLoading = false }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form className="chat-input-container" onSubmit={handleSubmit}>
      <input
        type="text"
        className="chat-input"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isLoading}
      />
      <Button type="submit" disabled={!message.trim() || isLoading}>
        {isLoading ? "..." : "Send"}
      </Button>
    </form>
  );
};

export default ChatInput;
