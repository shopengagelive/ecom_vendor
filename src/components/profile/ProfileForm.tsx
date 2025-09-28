import React, { useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { VendorProfile } from "../../types";
import { X } from "lucide-react";

interface ProfileFormProps {
  profile: VendorProfile;
  onSave: (profile: VendorProfile) => void;
}

export default function ProfileForm({ profile, onSave }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    ...profile,
    logo: profile.logo || ("" as string | File),
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(
    profile.logo || null
  );
  const [dragActive, setDragActive] = useState(false);

  const handleLogoChange = (file: File) => {
    setFormData({ ...formData, logo: file });
    setLogoPreview(URL.createObjectURL(file));
  };
  const handleLogoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleLogoChange(e.target.files[0]);
    }
  };
  const handleLogoDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleLogoDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };
  const handleLogoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleLogoChange(e.dataTransfer.files[0]);
    }
  };
  const handleRemoveLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData({ ...formData, logo: "" });
    setLogoPreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Only pass string for logo
    const saveData = {
      ...formData,
      logo:
        typeof formData.logo === "string" ? formData.logo : logoPreview || "",
    };
    onSave(saveData);
  };

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Profile Information
        </h3>
        <p className="text-sm text-gray-600">
          Update your personal and store information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Profile Image
          </label>
          <div
            className={`w-full h-32 flex items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 shadow-sm bg-gradient-to-br from-blue-50 to-white hover:from-blue-100 relative ${
              dragActive ? "border-blue-500 bg-blue-100" : "border-gray-300"
            }`}
            onDragOver={handleLogoDragOver}
            onDragLeave={handleLogoDragLeave}
            onDrop={handleLogoDrop}
            onClick={() =>
              document.getElementById("profile-logo-input")?.click()
            }
          >
            {logoPreview ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={logoPreview}
                  alt="Preview"
                  className="h-28 object-contain rounded-lg shadow-md"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-red-100 transition-colors"
                  onClick={handleRemoveLogo}
                  title="Remove image"
                >
                  <X className="h-5 w-5 text-red-500" />
                </button>
              </div>
            ) : (
              <span className="text-gray-400 font-medium">
                Drag & drop or click to upload
              </span>
            )}
            <input
              id="profile-logo-input"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleLogoInput}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Name
            </label>
            <input
              type="text"
              required
              value={formData.storeName}
              onChange={(e) =>
                setFormData({ ...formData, storeName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Store Address
          </label>
          <textarea
            required
            rows={3}
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Store Description
          </label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Card>
  );
}
