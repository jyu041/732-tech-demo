import { useState } from "react";
import Button from "../common/Button";
import Avatar from "../common/Avatar";
import ImageCropper from "../common/ImageCropper";
import profileService from "../../services/profileService";

/**
 * Component for creating/updating ex-girlfriend profiles
 */
const ExGirlfriendForm = ({
  onSuccess,
  onCancel,
  exGirlfriend = null,
  fullScreen = false,
}) => {
  const [name, setName] = useState(exGirlfriend?.name || "");
  const [personality, setPersonality] = useState(
    exGirlfriend?.personality || ""
  );
  const [backstory, setBackstory] = useState(exGirlfriend?.backstory || "");
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cropImage, setCropImage] = useState(null);
  const [tempFile, setTempFile] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const isEditMode = !!exGirlfriend;

  // Handle profile picture selection
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTempFile(file);

      const fileReader = new FileReader();
      fileReader.onload = () => {
        setCropImage(fileReader.result);
        setShowCropper(true); // Show cropper when image is loaded
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

    // Hide cropper
    setShowCropper(false);
    setCropImage(null);
  };

  // Add crop cancel handler
  const handleCropCancel = () => {
    setShowCropper(false);
    setCropImage(null);
    setTempFile(null);

    // Reset file input
    const fileInput = document.getElementById("ex-profile-picture");
    if (fileInput) fileInput.value = "";
  };

  // Submit form to create/update ex-girlfriend profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (!isEditMode && !profilePicture) {
      setError("Profile picture is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      let result;

      if (isEditMode) {
        // Update existing ex-girlfriend
        const updateData = {
          name,
          personality,
          backstory,
        };

        result = await profileService.updateExGirlfriend(
          exGirlfriend.id,
          updateData,
          profilePicture
        );

        setSuccess(`${name}'s profile updated successfully!`);
      } else {
        // Create new ex-girlfriend
        result = await profileService.createExGirlfriend(
          name,
          profilePicture,
          personality,
          backstory
        );

        setSuccess(`${name}'s profile created successfully!`);

        // Reset form for new entry
        setName("");
        setPersonality("");
        setBackstory("");
      }

      // Clear file input and preview
      setProfilePicture(null);
      setPreviewUrl(null);

      // Reset form file input
      const fileInput = document.getElementById("ex-profile-picture");
      if (fileInput) fileInput.value = "";

      // Notify parent component
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      console.error("Error saving ex-girlfriend profile:", err);
      setError("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`profile-form ex-profile-form ${
        fullScreen ? "fullscreen" : ""
      }`}
    >
      {!fullScreen && (
        <h2>
          {isEditMode
            ? `Edit ${exGirlfriend.name}'s Profile`
            : "Add Ex-Girlfriend"}
        </h2>
      )}

      {error && <div className="message message-error">{error}</div>}
      {success && <div className="message message-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter her name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="ex-profile-picture">Profile Picture</label>
          <input
            type="file"
            id="ex-profile-picture"
            onChange={handleProfilePictureChange}
            accept="image/*"
            required={!isEditMode}
          />
          {showCropper && cropImage && (
            <ImageCropper
              image={cropImage}
              onCropComplete={handleCropComplete}
              onCancel={handleCropCancel}
            />
          )}
        </div>

        <div className="form-group">
          <label htmlFor="personality">Personality (optional)</label>
          <textarea
            id="personality"
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            placeholder="Describe her personality to guide the AI responses..."
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="backstory">Your History (optional)</label>
          <textarea
            id="backstory"
            value={backstory}
            onChange={(e) => setBackstory(e.target.value)}
            placeholder="Describe your history with her to guide the conversation..."
            rows={5}
          />
        </div>

        <div className="profile-preview">
          <h3>Profile Preview</h3>
          <div className="avatar-preview">
            <Avatar
              src={
                previewUrl ||
                (isEditMode && exGirlfriend.profilePicturePath
                  ? `http://localhost:8080/uploads/${exGirlfriend.profilePicturePath}`
                  : null)
              }
              alt={name || "Ex"}
              size="large"
            />
          </div>
          <div className="preview-name">{name || "Name"}</div>
        </div>
        {fullScreen ? (
          <div className="form-actions-fixed">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEditMode ? "Update" : "Create"}
            </Button>
          </div>
        ) : (
          <Button type="submit" disabled={loading}>
            {loading
              ? "Saving..."
              : isEditMode
              ? "Update Profile"
              : "Create Profile"}
          </Button>
        )}
      </form>
    </div>
  );
};

export default ExGirlfriendForm;
