import { useState } from "react";
import Button from "../common/Button";
import Avatar from "../common/Avatar";
import ImageCropper from "../common/ImageCropper";
import profileService from "../../services/profileService";

/**
 * Component for creating/updating user profile
 */
const UserProfileForm = ({ user, onUpdate }) => {
  const [username, setUsername] = useState(user?.username || "");
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cropImage, setCropImage] = useState(null);
  const [tempFile, setTempFile] = useState(null);

  // Handle profile picture selection
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Store original file
      setTempFile(file);

      // Create URL for cropper
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setCropImage(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedBlob) => {
    setProfilePicture(croppedBlob);

    // Create preview URL
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(croppedBlob);

    // Clear cropper
    setCropImage(null);
  };

  // Add crop cancel handler
  const handleCropCancel = () => {
    setCropImage(null);
    setTempFile(null);
  };

  // Submit form to update profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const updatedUser = await profileService.updateUserProfile(
        username,
        profilePicture
      );

      setSuccess("Profile updated successfully!");

      // Clear file input and preview
      setProfilePicture(null);
      setPreviewUrl(null);

      // Reset form file input
      const fileInput = document.getElementById("user-profile-picture");
      if (fileInput) fileInput.value = "";

      // Update parent component with new user data
      if (onUpdate) {
        onUpdate(updatedUser);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-form user-profile-form">
      <h2>Your Profile</h2>

      {error && <div className="message message-error">{error}</div>}
      {success && <div className="message message-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="user-profile-picture">Profile Picture</label>
          <input
            type="file"
            id="user-profile-picture"
            onChange={handleProfilePictureChange}
            accept="image/*"
          />
          {cropImage && (
            <div className="modal-overlay">
              <div className="modal-content">
                <ImageCropper
                  image={cropImage}
                  onCropComplete={handleCropComplete}
                  onCancel={handleCropCancel}
                />
              </div>
            </div>
          )}
        </div>

        <div className="profile-preview">
          <h3>Profile Preview</h3>
          <div className="avatar-preview">
            <Avatar
              src={
                previewUrl ||
                (user?.profilePicturePath
                  ? `http://localhost:8080/uploads/${user.profilePicturePath}`
                  : null)
              }
              alt={username || "User"}
              size="large"
            />
          </div>
          <div className="preview-name">{username || "Username"}</div>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Save Profile"}
        </Button>
      </form>
    </div>
  );
};

export default UserProfileForm;
