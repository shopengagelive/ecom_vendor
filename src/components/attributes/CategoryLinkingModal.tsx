import React from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { Loader2 } from "lucide-react";
import { CategoryLinkingModalProps } from "./types";

export default function CategoryLinkingModal({
  isOpen,
  onClose,
  selectedAttribute,
  formData,
  onFormDataChange,
  onCategoryToggle,
  onSave,
  categories,
  savingCategories,
}: CategoryLinkingModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Link Categories - ${selectedAttribute?.name}`}
      size="md"
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Select categories to link with this attribute. Products in these
            categories will have this attribute available.
          </p>

          <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
            {categories.map((category) => (
              <label
                key={category.id}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  formData.linkedCategories.includes(category.id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:bg-gray-50"
                } ${savingCategories ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={formData.linkedCategories.includes(category.id)}
                  onChange={() => onCategoryToggle(category.id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={savingCategories}
                />
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {category.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={savingCategories}
          >
            Cancel
          </Button>
          <Button onClick={onSave} disabled={savingCategories}>
            {savingCategories ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Categories"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
