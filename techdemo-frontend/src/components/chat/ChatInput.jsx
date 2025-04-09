import { useState, useContext } from "react";
import Button from "../common/Button";
import { ThemeContext, THEMES } from "../../context/ThemeContext";
import {
  AudioOutlined,
  SmileOutlined,
  PlusOutlined,
  CameraOutlined,
  PictureOutlined,
  SearchOutlined,
  GiftOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";

const ChatInput = ({ onSendMessage, isLoading = false, inputRef }) => {
  const [message, setMessage] = useState("");
  const { theme } = useContext(ThemeContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    // Submit on Enter key (but not with Shift+Enter which should add a new line)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // WeChat input
  if (theme === THEMES.WECHAT) {
    return (
      <form
        className="chat-input-container wechat-input-container"
        onSubmit={handleSubmit}
      >
        <button type="button" className="wechat-voice-button">
          <AudioOutlined />
        </button>

        <input
          type="text"
          className="chat-input wechat-input"
          placeholder=""
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          ref={inputRef}
          autoFocus
        />

        <div className="wechat-buttons">
          <button type="button" className="wechat-emoji-button">
            <SmileOutlined />
          </button>
          <button type="button" className="wechat-plus-button">
            <PlusOutlined />
          </button>
        </div>
      </form>
    );
  } else if (theme === THEMES.INSTAGRAM) {
    return (
      <form
        className="chat-input-container instagram-input-container"
        onSubmit={handleSubmit}
      >
        <button type="button" className="instagram-camera-button">
          <CameraOutlined />
        </button>

        <input
          type="text"
          className="chat-input instagram-input"
          placeholder="Message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          ref={inputRef}
          autoFocus
        />

        <div className="instagram-buttons">
          <button type="button" className="instagram-icon-button">
            <AudioOutlined />
          </button>
          <button type="button" className="instagram-icon-button">
            <PictureOutlined />
          </button>
          <button type="button" className="instagram-icon-button">
            <SmileOutlined />
          </button>
          <button type="button" className="instagram-plus-button">
            <PlusCircleOutlined />
          </button>
        </div>
      </form>
    );
  } else {
    // Discord input
    return (
      <form
        className="chat-input-container discord-input-container"
        onSubmit={handleSubmit}
      >
        <div className="discord-input-buttons">
          <button type="button" className="discord-button">
            <PlusOutlined />
          </button>
          <button type="button" className="discord-button">
            <SearchOutlined />
          </button>
          <button type="button" className="discord-button">
            <GiftOutlined />
          </button>
        </div>

        <div className="discord-input-wrapper">
          <input
            type="text"
            className="chat-input discord-input"
            placeholder={`Message @${isLoading ? "Loading..." : "Ex"}`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            ref={inputRef}
            autoFocus
          />

          <button type="button" className="discord-emoji-button">
            <SmileOutlined />
          </button>
        </div>

        <button type="button" className="discord-mic-button">
          <AudioOutlined />
        </button>
      </form>
    );
  }
};

export default ChatInput;
