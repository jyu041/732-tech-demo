import { useState, useRef } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Button from "./Button";

const ImageCropper = ({ image, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState();
  const imgRef = useRef(null);

  // Function to center crop with a 1:1 aspect ratio
  const centerAspectCrop = (mediaWidth, mediaHeight) => {
    return centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        1, // 1:1 aspect ratio
        mediaWidth,
        mediaHeight
      ),
      mediaWidth,
      mediaHeight
    );
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height));
    imgRef.current = e.currentTarget;
  };

  const handleComplete = () => {
    if (!crop || !imgRef.current) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    const pixelRatio = window.devicePixelRatio || 1;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      imgRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    // Convert canvas to blob and pass to parent
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        blob.name = "cropped-image.jpg";
        onCropComplete(blob);
      },
      "image/jpeg",
      0.95
    );
  };

  return (
    <div className="image-cropper-container">
      <div className="dimmed-background"></div>
      <div className="image-cropper-modal">
        <h3>Position and Size</h3>
        <div className="crop-container">
          <ReactCrop
            crop={crop}
            onChange={(newCrop) => setCrop(newCrop)}
            circularCrop
            aspect={1}
          >
            <img
              src={image}
              onLoad={onImageLoad}
              alt="Crop preview"
              className="crop-image"
            />
          </ReactCrop>
        </div>
        <div className="crop-actions-fixed">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleComplete}>Apply</Button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
