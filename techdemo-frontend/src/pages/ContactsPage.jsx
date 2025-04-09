import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ExGirlfriendForm from "../components/profile/ExGirlfriendForm";
import Button from "../components/common/Button";
import Avatar from "../components/common/Avatar";
import profileService from "../services/profileService";
import chatService from "../services/chatService";

const ContactsPage = () => {
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
        setError("Failed to load contacts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadExGirlfriends();
  }, []);

  // Handle ex-girlfriend creation
  const handleExGirlfriendCreated = (newExGirlfriend) => {
    setExGirlfriends((prev) => [...prev, newExGirlfriend]);
    setEditingExId(null);
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

  // Handle starting chat with ex-girlfriend
  const handleStartChat = async (exGirlfriendId) => {
    try {
      const chat = await chatService.startChat(exGirlfriendId);
      navigate(`/chat/${chat.id}`);
    } catch (err) {
      console.error("Error starting chat:", err);
      setError("Failed to start conversation. Please try again.");
    }
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
      setError("Failed to delete contact. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditingExId(null);
  };

  // Go back to home page
  const goBack = () => {
    navigate("/");
  };

  // Render ex-girlfriend card
  const renderExGirlfriendCard = (ex) => {
    const isConfirmingDelete = confirmDelete === ex.id;

    return (
      <div key={ex.id} className="contact-card">
        <div className="contact-info">
          <Avatar
            src={`http://localhost:8080/uploads/${ex.profilePicturePath}`}
            alt={ex.name}
            size="large"
          />
          <div className="contact-details">
            <h3>{ex.name}</h3>
            {ex.personality && (
              <p className="contact-personality">{ex.personality}</p>
            )}
          </div>
        </div>

        {isConfirmingDelete ? (
          <div className="confirm-delete">
            <p>Delete {ex.name}'s profile?</p>
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
          <div className="contact-actions">
            <Button onClick={() => handleStartChat(ex.id)}>Chat</Button>
            <Button variant="secondary" onClick={() => setEditingExId(ex.id)}>
              Edit
            </Button>
            <Button variant="error" onClick={() => handleDeleteClick(ex.id)}>
              Delete
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="contacts-page">
      <header className="app-header">
        <Button variant="secondary" onClick={goBack}>
          ← Back
        </Button>
        <h1>Contacts</h1>
        <Button onClick={() => setEditingExId("new")}>Add New</Button>
      </header>

      <div className="contacts-content">
        {error && <div className="message message-error">{error}</div>}

        {loading ? (
          <div className="loading">Loading contacts...</div>
        ) : (
          <div className="contacts-list">
            {exGirlfriends.length === 0 ? (
              <div className="empty-state">
                <h2>No Contacts Yet</h2>
                <p>Add an ex-girlfriend profile to start chatting.</p>
                <Button onClick={() => setEditingExId("new")}>
                  Add Ex-Girlfriend
                </Button>
              </div>
            ) : (
              exGirlfriends.map((ex) => renderExGirlfriendCard(ex))
            )}
          </div>
        )}
      </div>

      {editingExId && (
        <div className="iphone-fullscreen-modal">
          <div className="modal-header">
            <h2>
              {editingExId === "new" ? "Add New Contact" : "Edit Contact"}
            </h2>
          </div>

          <div className="modal-body">
            {editingExId === "new" ? (
              <ExGirlfriendForm
                onSuccess={handleExGirlfriendCreated}
                onCancel={handleCancelEdit}
                fullScreen={true}
              />
            ) : (
              <ExGirlfriendForm
                exGirlfriend={exGirlfriends.find((ex) => ex.id === editingExId)}
                onSuccess={handleExGirlfriendUpdated}
                onCancel={handleCancelEdit}
                fullScreen={true}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsPage;
