import React, { useState } from "react";
import { X, Plus, Loader2 } from "lucide-react";

interface ProductImageUploadProps {
  images: (string | File)[];
  onImageChange: (file: File) => void;
  onRemoveImage: (index: number) => void;
  uploading?: boolean;
}

export default function ProductImageUpload({
  images,
  onImageChange,
  onRemoveImage,
  uploading = false,
}: ProductImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  React.useEffect(() => {
    const previews = images.map((img) =>
      typeof img === "string" ? img : URL.createObjectURL(img as File)
    );
    setImagePreviews(previews);
    if (previews.length > 0 && !selectedImage) {
      setSelectedImage(previews[0]);
    }
  }, [images, selectedImage]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent, isMainPreview: boolean) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const newPreview = URL.createObjectURL(file);
          onImageChange(file);
          if (isMainPreview && imagePreviews.length === 0 && selectedImage === null) {
            setSelectedImage(newPreview);
          }
        }
      });
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, isMainPreview: boolean) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach(file => {
        const newPreview = URL.createObjectURL(file);
        onImageChange(file);
        if (isMainPreview && imagePreviews.length === 0 && selectedImage === null) {
          setSelectedImage(newPreview);
        }
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    if (images[index] instanceof File) {
      URL.revokeObjectURL(imagePreviews[index]);
    }
    onRemoveImage(index);
    if (selectedImage === imagePreviews[index] && imagePreviews.length > 1) {
      const newSelectedIndex = index === 0 ? 0 : index - 1;
      setSelectedImage(imagePreviews[newSelectedIndex]);
    } else if (imagePreviews.length === 1) {
      setSelectedImage(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm h-full border p-6">
      {/* Main Image Display */}
      <div
        className={`w-full max-w-sm aspect-[3/4] border-2 border-dashed rounded-lg relative overflow-hidden bg-gray-50 flex items-center justify-center mb-4 mx-auto ${
          dragActive && images.length === 0 ? "border-blue-500 bg-blue-50" : "border-gray-300"
        } ${images.length === 0 ? "cursor-pointer hover:border-gray-400" : "cursor-default"}`}
        onDragOver={images.length === 0 ? handleDragOver : undefined}
        onDragLeave={images.length === 0 ? handleDragLeave : undefined}
        onDrop={images.length === 0 ? (e) => handleDrop(e, true) : undefined}
        onClick={images.length === 0 ? () => document.getElementById("product-image-input-main")?.click() : undefined}
      >
        {uploading && images.length === 0 ? (
          <div className="text-center text-gray-500">
            <Loader2 className="w-10 h-10 mx-auto mb-2 text-blue-500 animate-spin" />
            <p className="font-medium text-sm">Uploading Image...</p>
            <p className="text-xs">Please wait while we upload your image</p>
          </div>
        ) : selectedImage ? (
          <img
            src={selectedImage}
            alt="Product Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center text-gray-500">
            <Plus className="w-10 h-10 mx-auto mb-2 text-gray-400" />
            <p className="font-medium text-sm">Add Product Image</p>
            <p className="text-xs">Drag & drop or click to upload</p>
          </div>
        )}
        {images.length === 0 && (
          <input
            id="product-image-input-main"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFileInput(e, true)}
          />
        )}
      </div>

      {/* Image Thumbnails and Upload Box */}
      <div className="grid grid-cols-4 gap-2">
        {imagePreviews.map((preview, index) => (
          <div key={index} className="relative group">
            <img
              src={preview}
              alt={`Preview ${index + 1}`}
              className={`w-full aspect-[3/4] object-cover rounded cursor-pointer transition-all ${
                selectedImage === preview ? "ring-2 ring-blue-500" : "hover:opacity-75"
              }`}
              onClick={() => setSelectedImage(preview)}
            />
            <button
              type="button"
              className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemoveImage(index)}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {images.length > 0 && (
          <div
            className={`w-full aspect-[3/4] border-2 border-dashed rounded-lg relative overflow-hidden bg-gray-50 flex items-center justify-center ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            } ${uploading ? "cursor-default" : "cursor-pointer"}`}
            onDragOver={uploading ? undefined : handleDragOver}
            onDragLeave={uploading ? undefined : handleDragLeave}
            onDrop={uploading ? undefined : (e) => handleDrop(e, false)}
            onClick={uploading ? undefined : () => document.getElementById("product-image-input-thumbnail")?.click()}
          >
            {uploading ? (
              <div className="text-center text-gray-500">
                <Loader2 className="w-6 h-6 mx-auto mb-1 text-blue-500 animate-spin" />
                <p className="text-xs font-medium">Uploading...</p>
              </div>
            ) : (
              <div className="text-center flex flex-col items-center justify-center text-gray-500">
                <Plus className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                {/* <p className="text-xs font-medium">Add Image</p> */}
              </div>
            )}
            {!uploading && (
              <input
                id="product-image-input-thumbnail"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFileInput(e, false)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}