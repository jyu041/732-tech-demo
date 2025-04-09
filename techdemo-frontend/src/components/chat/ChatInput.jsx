import { useState } from "react";
import Button from "../common/Button";

const ChatInput = ({ onSendMessage, isLoading = false, inputRef }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
      // No need to refocus here as the parent component handles it
    }
  };

  const handleKeyDown = (e) => {
    // Submit on Enter key (but not with Shift+Enter which should add a new line)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
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
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        ref={inputRef}
        autoFocus
      />
      <Button type="submit" disabled={!message.trim() || isLoading}>
        {isLoading ? "..." : "Send"}
      </Button>
    </form>
  );
};

export default ChatInput;
