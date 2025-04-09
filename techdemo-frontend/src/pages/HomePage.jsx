import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import ChatList from "../components/chat/ChatList";
import UserProfileForm from "../components/profile/UserProfileForm";
import Button from "../components/common/Button";
import profileService from "../services/profileService";

/**
 * Home page component with chat list and profile management
 */
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

  return (
    <div className="home-page">
      <header className="app-header">
        <h1 className="app-title"></h1>
      </header>

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
                  <h2>No Conversations Yet</h2>
                  <p>Start a conversation with your friend.</p>
                  {/* <Button onClick={() => navigate("/contacts")}>
                    Add Ex-Girlfriend
                  </Button> */}
                </div>
              ) : (
                <ChatList userData={user} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePage;
