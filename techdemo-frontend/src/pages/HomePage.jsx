// pages/HomePage.jsx
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext, THEMES } from "../context/ThemeContext";
import ChatList from "../components/chat/ChatList";
import UserProfileForm from "../components/profile/UserProfileForm";
import profileService from "../services/profileService";
import { SearchOutlined } from "@ant-design/icons";

const HomePage = ({ user, setUser }) => {
  const [exGirlfriends, setExGirlfriends] = useState([]);
  const [showUserForm, setShowUserForm] = useState(!user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  // Fetch ex-girlfriends on load
  useEffect(() => {
    const loadExGirlfriends = async () => {
      try {
        setLoading(true);
        const data = await profileService.getAllExGirlfriends();
        setExGirlfriends(data);
      } catch (err) {
        console.error("Error loading ex-girlfriends:", err);
        setError("Failed to load profiles. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadExGirlfriends();
  }, []);

  // Update user profile handler
  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    setShowUserForm(false);
  };

  // Get app title based on theme
  const getAppTitle = () => {
    switch (theme) {
      case THEMES.DISCORD:
        return "Messages";
      case THEMES.WECHAT:
        return "WeChat";
      default: // Instagram
        return user?.username || "Instagram"; // Show username for Instagram
    }
  };

  // Render search bar
  const renderSearchBar = () => {
    if (theme === THEMES.WECHAT) {
      return (
        <div className="search-bar wechat-search">
          <div className="search-icon">
            <SearchOutlined />
          </div>
          <input
            type="text"
            placeholder="Search"
            className="search-input"
            disabled
          />
        </div>
      );
    } else if (theme === THEMES.INSTAGRAM) {
      return (
        <div className="search-bar instagram-search">
          <div className="search-icon">
            <SearchOutlined />
          </div>
          <input
            type="text"
            placeholder="Ask Meta AI or search"
            className="search-input"
            disabled
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="home-page">
      <header className={`app-header theme-${theme}-header`}>
        <h1 className="app-title">{getAppTitle()}</h1>
      </header>

      {renderSearchBar()}

      <div className="home-content">
        <main className="main-content">
          {error && <div className="message message-error">{error}</div>}

          {!user ? (
            <div className="setup-prompt">
              <h2>Welcome to Ex-Girlfriend Simulator</h2>
              <p>Please set up your profile to get started.</p>
              <UserProfileForm onUpdate={handleUserUpdate} />
            </div>
          ) : (
            <>
              {exGirlfriends.length === 0 ? (
                <div className="empty-state">
                  {/* <h2>No Ex-Girlfriends Yet</h2>
                  <p>Add an ex-girlfriend profile to start chatting.</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/contacts")}
                  >
                    Add Ex-Girlfriend
                  </button> */}
                </div>
              ) : (
                <ChatList userData={user} />
              )}
            </>
          )}
        </main>
      </div>

      {showUserForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="btn btn-secondary close-button"
              onClick={() => setShowUserForm(false)}
            >
              ✕
            </button>
            <UserProfileForm user={user} onUpdate={handleUserUpdate} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
