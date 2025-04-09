import { useState } from "react";
import defaultAvatar from "../../assets/default-avatar.png";

/**
 * Avatar component for displaying user/ex-girlfriend profile pictures
 */
const Avatar = ({ src, alt, size = "medium", className = "" }) => {
  const [error, setError] = useState(false);

  // Determine size class
  let sizeClass = "";
  switch (size) {
    case "large":
      sizeClass = "avatar-large";
      break;
    case "small":
      sizeClass = "avatar-small";
      break;
    default:
      sizeClass = "";
  }

  // Handle image loading error
  const handleError = () => {
    setError(true);
  };

  return (
    <img
      src={error ? defaultAvatar : src}
      alt={alt || "Avatar"}
      className={`avatar ${sizeClass} ${className}`}
      onError={handleError}
    />
  );
};

export default Avatar;
