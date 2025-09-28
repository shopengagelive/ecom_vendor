import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { CourierModalProps } from "./types";

interface CourierFormData {
  providerName: string;
  trackingUrl: string;
  prefix: string;

}

export default function CourierModal({
  isOpen,
  onClose,
  onSave,
  courier,
  isEditing,
isSubmitting
}: CourierModalProps) {
  const [formData, setFormData] = useState<CourierFormData>({
    providerName: "",
    trackingUrl: "",
    prefix: "",
  });
  const [errors, setErrors] = useState<Partial<CourierFormData>>({});

  useEffect(() => {
    if (isOpen) {
      if (isEditing && courier) {
        setFormData({
          providerName: courier.providerName,
          trackingUrl: courier.trackingUrl,
          prefix: courier.prefix,
        });
      } else {
        setFormData({
          providerName: "",
          trackingUrl: "",
          prefix: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, isEditing, courier]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CourierFormData> = {};

    if (!formData.providerName.trim()) {
      newErrors.providerName = "Courier company name is required";
    }

    if (!formData.trackingUrl.trim()) {
      newErrors.trackingUrl = "Tracking URL is required";
    } else if (!isValidUrl(formData.trackingUrl)) {
      newErrors.trackingUrl = "Please enter a valid URL";
    }

    if (!formData.prefix.trim()) {
      newErrors.prefix = "Prefix is required";
    } else if (formData.prefix.length !== 4) {
      newErrors.prefix = "Prefix must be exactly 4 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Map form data to the expected format for onSave
      onSave({
        name: formData.providerName,
        trackingUrl: formData.trackingUrl,
        trackingIdPrefix: formData.prefix,
      });
    }
  };

  const handleChange = (field: keyof CourierFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Courier Company" : "Add Courier Company"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Courier Company Name *
          </label>
          <input
            type="text"
            value={formData.providerName}
            onChange={(e) => handleChange("providerName", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.providerName ? "border-red-300" : "border-gray-300"
              }`}
            placeholder="Enter courier company name"
          />
          {errors.providerName && (
            <p className="mt-1 text-sm text-red-600">{errors.providerName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tracking URL *
          </label>
          <input
            type="url"
            value={formData.trackingUrl}
            onChange={(e) => handleChange("trackingUrl", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.trackingUrl ? "border-red-300" : "border-gray-300"
              }`}
            placeholder="https://example.com/tracking"
          />
          {errors.trackingUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.trackingUrl}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tracking ID Prefix *
          </label>
          <input
            type="text"
            value={formData.prefix}
            onChange={(e) => handleChange("prefix", e.target.value.toUpperCase())}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono ${errors.prefix ? "border-red-300" : "border-gray-300"
              }`}
            placeholder="e.g., BLUE, DTDC, DELH"
            maxLength={4}
          />
          {errors.prefix && (
            <p className="mt-1 text-sm text-red-600">{errors.prefix}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Enter exactly 4 characters for the tracking ID prefix
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting
              ? (isEditing ? "Updating..." : "Adding...")
              : (isEditing ? "Update" : "Add")}
            Courier Company
          </Button>

        </div>
      </form>
    </Modal>
  );
}