import React from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { StaffFormProps } from "./types";

export default function StaffForm({
  isOpen,
  onClose,
  formData,
  onFormDataChange,
  onSubmit,
  editStaffId,
  avatarPreview,
  onImageChange,
  onFileInput,
  onDragOver,
  onDragLeave,
  onDrop,
  onRemoveImage,
  dragActive,
}: StaffFormProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Staff" size="lg">
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Avatar
          </label>
          <div
            className={`w-full h-32 flex items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 shadow-sm bg-gradient-to-br from-blue-50 to-white hover:from-blue-100 relative ${
              dragActive ? "border-blue-500 bg-blue-100" : "border-gray-300"
            }`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() =>
              document.getElementById("staff-avatar-input")?.click()
            }
          >
            {avatarPreview ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={avatarPreview}
                  alt="Preview"
                  className="h-28 object-contain rounded-lg shadow-md"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-red-100 transition-colors"
                  onClick={onRemoveImage}
                  title="Remove image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <span className="text-gray-400 font-medium">
                Drag & drop or click to upload
              </span>
            )}
            <input
              id="staff-avatar-input"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={onFileInput}
            />
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Name
          </label>
          <input
            type="text"
            required
            placeholder="Enter staff name"
            value={formData.name}
            onChange={(e) =>
              onFormDataChange({ ...formData, name: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white shadow-sm"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Email
          </label>
          <input
            type="email"
            required
            placeholder="Enter staff email"
            value={formData.email}
            onChange={(e) =>
              onFormDataChange({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white shadow-sm"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Role
          </label>
          <input
            type="text"
            required
            placeholder="Enter staff role"
            value={formData.role}
            onChange={(e) =>
              onFormDataChange({ ...formData, role: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white shadow-sm"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              onFormDataChange({
                ...formData,
                status: e.target.value as "Active" | "Inactive",
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white shadow-sm"
          >
            <option value="" disabled>
              Select status
            </option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit">
            {editStaffId ? "Update Staff" : "Add Staff"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
