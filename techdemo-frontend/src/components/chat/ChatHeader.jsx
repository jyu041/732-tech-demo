import { useNavigate } from "react-router-dom";
import Avatar from "../common/Avatar";
import Button from "../common/Button";

/**
 * Component for the header of the chat window
 */
const ChatHeader = ({ exGirlfriend, toggleSettings }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="chat-header">
      <Button variant="secondary" className="back-button" onClick={handleBack}>
        ← Back
      </Button>

      {exGirlfriend && (
        <div className="chat-header-profile">
          <Avatar
            src={`http://localhost:8080/uploads/${exGirlfriend.profilePicturePath}`}
            alt={exGirlfriend.name}
          />
          <div className="chat-header-info">
            <div className="chat-header-name">{exGirlfriend.name}</div>
          </div>
        </div>
      )}

      {/* <Button
        variant="secondary"
        className="settings-button"
        onClick={toggleSettings}
      >
        ⚙️
      </Button> */}
    </div>
  );
};

export default ChatHeader;
