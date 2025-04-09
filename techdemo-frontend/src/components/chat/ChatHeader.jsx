import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import Avatar from "../common/Avatar";
import Button from "../common/Button";
import { ThemeContext, THEMES } from "../../context/ThemeContext";
import {
  LeftOutlined,
  EllipsisOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

/**
 * Component for header of chat windows
 */
const ChatHeader = ({ exGirlfriend, toggleSettings }) => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const handleBack = () => {
    navigate("/");
  };

  if (theme === THEMES.WECHAT) {
    return (
      <div className="chat-header wechat-chat-header">
        <button className="back-button wechat-back" onClick={handleBack}>
          <LeftOutlined />
        </button>

        <div className="chat-header-name center-name">{exGirlfriend?.name}</div>

        <button
          className="settings-button wechat-settings"
          onClick={toggleSettings}
        >
          <EllipsisOutlined />
        </button>
      </div>
    );
  } else if (theme === THEMES.INSTAGRAM) {
    return (
      <div className="chat-header instagram-chat-header">
        <button className="back-button instagram-back" onClick={handleBack}>
          <LeftOutlined />
        </button>

        <div className="chat-header-profile">
          <Avatar
            src={`http://localhost:8080/uploads/${exGirlfriend?.profilePicturePath}`}
            alt={exGirlfriend?.name}
            size="small"
          />
          <div className="chat-header-name">{exGirlfriend?.name}</div>
        </div>

        <div className="chat-header-actions">
          <button className="icon-button">
            <PhoneOutlined />
          </button>
          <button className="icon-button">
            <VideoCameraOutlined />
          </button>
        </div>
      </div>
    );
  } else {
    // Discord theme
    return (
      <div className="chat-header discord-chat-header">
        <button className="back-button discord-back" onClick={handleBack}>
          <ArrowLeftOutlined />
        </button>

        <div className="chat-header-profile">
          <Avatar
            src={`http://localhost:8080/uploads/${exGirlfriend?.profilePicturePath}`}
            alt={exGirlfriend?.name}
            size="small"
          />
          <div className="chat-header-name">{exGirlfriend?.name}</div>
        </div>

        <div className="chat-header-actions">
          <button className="icon-button discord-icon-button">
            <PhoneOutlined />
          </button>
          <button className="icon-button discord-icon-button">
            <VideoCameraOutlined />
          </button>
        </div>
      </div>
    );
  }
};

export default ChatHeader;
