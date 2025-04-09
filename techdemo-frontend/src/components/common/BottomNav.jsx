import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeContext, THEMES } from "../../context/ThemeContext";
import {
  PlusOutlined,
  HomeOutlined,
  UserOutlined,
  CompassOutlined,
  SettingOutlined,
  TeamOutlined,
  CloudOutlined,
  SearchOutlined,
  SmileOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useContext(ThemeContext);

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path === "/contacts" && location.pathname === "/contacts") return true;
    if (path === "/settings" && location.pathname === "/settings") return true;
    if (path === "/discover" && location.pathname === "/discover") return true;
    return false;
  };

  // Determine which icon set to use based on theme
  const getHomeIcon = () => {
    switch (theme) {
      case THEMES.DISCORD:
        return <PlusOutlined />;
      case THEMES.WECHAT:
        return <HomeOutlined />;
      default: // Instagram
        return <AppstoreOutlined />;
    }
  };

  const getContactsIcon = () => {
    switch (theme) {
      case THEMES.DISCORD:
        return <CloudOutlined />;
      case THEMES.WECHAT:
        return <TeamOutlined />;
      default: // Instagram
        return <CompassOutlined />;
    }
  };

  const getDiscoverIcon = () => {
    switch (theme) {
      case THEMES.DISCORD:
        return <CompassOutlined />;
      case THEMES.WECHAT:
        return <SearchOutlined />;
      default: // Instagram
        return <SmileOutlined />;
    }
  };

  const getSettingsIcon = () => {
    switch (theme) {
      case THEMES.DISCORD:
        return <SettingOutlined />;
      case THEMES.WECHAT:
        return <SmileOutlined />;
      default: // Instagram
        return <UserOutlined />;
    }
  };

  return (
    <div className={`bottom-nav theme-${theme}`}>
      <div
        className={`nav-item ${isActive("/") ? "active" : ""}`}
        onClick={() => navigate("/")}
      >
        {getHomeIcon()}
        <span className="nav-text">Chats</span>
      </div>

      <div
        className={`nav-item ${isActive("/contacts") ? "active" : ""}`}
        onClick={() => navigate("/contacts")}
      >
        {getContactsIcon()}
        <span className="nav-text">Contacts</span>
      </div>

      <div
        className={`nav-item ${isActive("/discover") ? "active" : ""}`}
        onClick={() => {}}
      >
        {getDiscoverIcon()}
        <span className="nav-text">Discover</span>
      </div>

      <div
        className={`nav-item ${isActive("/settings") ? "active" : ""}`}
        onClick={() => navigate("/settings")}
      >
        {getSettingsIcon()}
        <span className="nav-text">Me</span>
      </div>
    </div>
  );
};

export default BottomNav;
