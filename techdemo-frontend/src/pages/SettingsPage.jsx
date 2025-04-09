import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserProfileForm from "../components/profile/UserProfileForm";
import ThemeToggle from "../components/common/ThemeToggle";
import Button from "../components/common/Button";
import Avatar from "../components/common/Avatar";
import { ThemeContext } from "../context/ThemeContext";

const SettingsPage = ({ user, setUser }) => {
  const [showProfileForm, setShowProfileForm] = useState(false);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    setShowProfileForm(false);
  };

  const goBack = () => {
    navigate("/");
  };

  return (
    <div className="settings-page">
      <header className="app-header">
        {/* <h1 className="app-title">Me</h1> */}
      </header>

      <div className="settings-content">
        <section className="theme-section">
          <h2>Appearance</h2>
          <ThemeToggle />
        </section>

        <section className="user-profile-section">
          <h2>You</h2>

          {!showProfileForm ? (
            <div className="profile-summary">
              <div className="profile-header">
                <Avatar
                  src={
                    user?.profilePicturePath
                      ? `http://localhost:8080/uploads/${user.profilePicturePath}`
                      : null
                  }
                  alt={user?.username || "User"}
                  size="large"
                />
                <div className="profile-info">
                  <h3>{user?.username || "User"}</h3>
                </div>
              </div>

              <Button onClick={() => setShowProfileForm(true)}>
                Edit Profile
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="secondary"
                className="cancel-button"
                onClick={() => setShowProfileForm(false)}
              >
                Cancel
              </Button>
              <UserProfileForm user={user} onUpdate={handleUserUpdate} />
            </>
          )}
        </section>

        <section className="app-info-section">
          <h2>About</h2>
          <p>Ex-Girlfriend Simulator v9.22</p>
          <p>A place to have that one last conversation.</p>
        </section>
        <section className="app-info-section">
          <h2>Version 9.22</h2>
          <p>Why version 9.22? </p>
          <p>because that's my ex's birthday</p>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
