import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserProfileForm from "../components/profile/UserProfileForm";
import ExGirlfriendForm from "../components/profile/ExGirlfriendForm";
import Button from "../components/common/Button";
import Avatar from "../components/common/Avatar";
import profileService from "../services/profileService";

/**
 * Page component for managing user and ex-girlfriend profiles
 */
const ProfilePage = ({ user, setUser }) => {
  const [exGirlfriends, setExGirlfriends] = useState([]);
  const [editingExId, setEditingExId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const navigate = useNavigate();

  // Load ex-girlfriends on component mount
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

  // Handle user profile update
  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  // Handle ex-girlfriend creation
  const handleExGirlfriendCreated = (newExGirlfriend) => {
    setExGirlfriends((prev) => [...prev, newExGirlfriend]);
  };

  // Handle ex-girlfriend update
  const handleExGirlfriendUpdated = (updatedExGirlfriend) => {
    setExGirlfriends((prev) =>
      prev.map((ex) =>
        ex.id === updatedExGirlfriend.id ? updatedExGirlfriend : ex
      )
    );
    setEditingExId(null);
  };

  // Handle starting delete confirmation
  const handleDeleteClick = (id) => {
    setConfirmDelete(id);
  };

  // Handle canceling delete
  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  // Handle confirming delete
  const handleConfirmDelete = async (id) => {
    try {
      await profileService.deleteExGirlfriend(id);
      setExGirlfriends((prev) => prev.filter((ex) => ex.id !== id));
      setConfirmDelete(null);
    } catch (err) {
      console.error("Error deleting ex-girlfriend:", err);
      setError("Failed to delete profile. Please try again.");
    }
  };

  // Go back to home page
  const goBack = () => {
    navigate("/");
  };

  // Render ex-girlfriend card with edit/delete options
  const renderExGirlfriendCard = (ex) => {
    const isConfirmingDelete = confirmDelete === ex.id;

    return (
      <div key={ex.id} className="profile-card">
        <Avatar
          src={`http://localhost:8080/uploads/${ex.profilePicturePath}`}
          alt={ex.name}
          size="large"
        />
        <h3>{ex.name}</h3>

        {isConfirmingDelete ? (
          <div className="confirm-delete">
            <p>Are you sure you want to delete {ex.name}'s profile?</p>
            <div className="confirm-actions">
              <Button variant="secondary" onClick={handleCancelDelete}>
                Cancel
              </Button>
              <Button
                variant="error"
                onClick={() => handleConfirmDelete(ex.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <div className="card-actions">
            <Button onClick={() => setEditingExId(ex.id)}>Edit</Button>
            <Button variant="error" onClick={() => handleDeleteClick(ex.id)}>
              Delete
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="profile-page">
      <header className="app-header">
        <Button variant="secondary" onClick={goBack}>
          ← Back
        </Button>
        <h1>Manage Profiles</h1>
        <div></div> {/* Empty div for flexbox spacing */}
      </header>

      <div className="profile-content">
        {error && <div className="message message-error">{error}</div>}

        <section className="user-profile-section">
          <UserProfileForm user={user} onUpdate={handleUserUpdate} />
        </section>

        <section className="ex-profiles-section">
          <h2>Ex-Girlfriend Profiles</h2>

          {loading ? (
            <div className="loading">Loading profiles...</div>
          ) : (
            <>
              <div className="ex-profile-list">
                {exGirlfriends.map((ex) => renderExGirlfriendCard(ex))}

                {/* Add new card */}
                <div
                  className="profile-card add-card"
                  onClick={() => setEditingExId("new")}
                >
                  <div className="add-icon">+</div>
                  <h3>Add New Ex-Girlfriend</h3>
                </div>
              </div>

              {editingExId && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <Button
                      variant="secondary"
                      className="close-button"
                      onClick={() => setEditingExId(null)}
                    >
                      ✕
                    </Button>

                    {editingExId === "new" ? (
                      <ExGirlfriendForm onSuccess={handleExGirlfriendCreated} />
                    ) : (
                      <ExGirlfriendForm
                        exGirlfriend={exGirlfriends.find(
                          (ex) => ex.id === editingExId
                        )}
                        onSuccess={handleExGirlfriendUpdated}
                      />
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
