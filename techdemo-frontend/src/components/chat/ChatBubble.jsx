import Avatar from "../common/Avatar";

const ChatBubble = ({ message, userImage, exGirlfriendImage }) => {
  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Check both isFromUser and fromUser properties
  const isUserMessage =
    message.isFromUser === true || message.fromUser === true;

  console.log(
    `Message: ${message.content.substring(0, 20)}... isFromUser:`,
    message.isFromUser,
    "fromUser:",
    message.fromUser,
    "Interpreted as user message:",
    isUserMessage
  );

  return (
    <div
      className={`message-container ${
        isUserMessage ? "message-container-user" : "message-container-other"
      }`}
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
        }`}
      >
        <div className="message-content">{message.content}</div>
        <div className="message-time">{formatTime(message.timestamp)}</div>
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
  );
};

export default ChatBubble;
