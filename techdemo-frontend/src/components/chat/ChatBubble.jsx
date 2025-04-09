import { useContext } from "react";
import Avatar from "../common/Avatar";
import { ThemeContext, THEMES } from "../../context/ThemeContext";

const ChatBubble = ({
  message,
  userImage,
  exGirlfriendImage,
  showTimestamp = false,
  previousMessageTime = null,
}) => {
  const { theme } = useContext(ThemeContext);
  const isUserMessage = message.isFromUser;

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Format date for timestamp headers
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return (
      date.toLocaleDateString([], { month: "short", day: "numeric" }) +
      ", " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  // Discord style
  if (theme === THEMES.DISCORD) {
    return (
      <>
        {showTimestamp && (
          <div className="message-timestamp discord-timestamp">
            {formatDate(message.timestamp)}
          </div>
        )}
        <div className="discord-message">
          <div className="discord-avatar">
            <Avatar
              src={`http://localhost:8080/uploads/${
                isUserMessage ? userImage : exGirlfriendImage
              }`}
              alt={isUserMessage ? "You" : "Ex"}
              size="medium"
              className="discord-avatar-img"
            />
          </div>
          <div className="discord-message-content">
            <div className="discord-message-header">
              <span className="discord-username">
                {isUserMessage ? "You" : "Ex"}
              </span>
              <span className="discord-time">
                {formatTime(message.timestamp)}
              </span>
            </div>
            <div className="discord-message-text">{message.content}</div>
          </div>
        </div>
      </>
    );
  }

  // Instagram or WeChat style
  const shouldShowTimeInBubble =
    theme !== THEMES.INSTAGRAM && theme !== THEMES.WECHAT;

  return (
    <>
      {showTimestamp && (
        <div className="message-timestamp">{formatDate(message.timestamp)}</div>
      )}
      <div
        className={`message-container ${
          isUserMessage ? "message-container-user" : "message-container-other"
        } ${theme.toLowerCase()}-container`}
      >
        {!isUserMessage && (
          <div className="message-avatar-container">
            <Avatar
              src={`http://localhost:8080/uploads/${exGirlfriendImage}`}
              alt="Ex"
              size="small"
              className="message-avatar-small"
            />
          </div>
        )}

        <div
          className={`message-bubble ${
            isUserMessage ? "message-user" : "message-other"
          } ${theme.toLowerCase()}-bubble`}
        >
          <div className="message-content">{message.content}</div>
          {shouldShowTimeInBubble && (
            <div className="message-time">{formatTime(message.timestamp)}</div>
          )}
        </div>

        {isUserMessage && (
          <div className="message-avatar-container">
            <Avatar
              src={`http://localhost:8080/uploads/${userImage}`}
              alt="You"
              size="small"
              className="message-avatar-small"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ChatBubble;
