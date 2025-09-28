import React from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { Trash2, Loader2 } from "lucide-react";
import { AttributeFormProps } from "./types";

export default function AttributeForm({
  isOpen,
  onClose,
  editingAttribute,
  formData,
  onFormDataChange,
  onSubmit,
  onAddOption,
  onRemoveOption,
  onOptionChange,
  onValueChange,
  onCategoryToggle,
  categories,
  submitting,
}: AttributeFormProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingAttribute ? "Edit Attribute" : "Add Attribute"}
      size="lg"
    >
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Attribute Name */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-800">
            Attribute Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Color, Size, Material"
            value={formData.name}
            onChange={(e) =>
              onFormDataChange({ ...formData, name: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm"
            disabled={submitting}
          />
        </div>

        {/* Attribute Type */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-800">
            Attribute Type
          </label>
          <select
            value={formData.type}
            onChange={(e) =>
              onFormDataChange({
                ...formData,
                type: e.target.value as "text" | "color" | "number" | "select",
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm"
            disabled={submitting}
          >
            <option value="text">Text</option>
            <option value="color">Color</option>
            <option value="select">Select</option>
            <option value="number">Number</option>
          </select>
        </div>

        {/* Group */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-800">
            Group
          </label>
          <input
            type="text"
            placeholder="e.g., Appearance, Dimensions, Material"
            value={formData.group}
            onChange={(e) =>
              onFormDataChange({ ...formData, group: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm"
            required
            disabled={submitting}
          />
        </div>

        {/* Options & Values */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">
            Options & Values
          </label>
          <div className="space-y-3">
            {formData.options.map((option, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Option name"
                  value={option}
                  onChange={(e) => onOptionChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm"
                  disabled={submitting}
                />
                {formData.type === "color" ? (
                  <input
                    type="color"
                    value={formData.values[index] || "#000000"}
                    onChange={(e) => onValueChange(index, e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded-lg shadow-sm"
                    disabled={submitting}
                  />
                ) : (
                  <input
                    type="text"
                    placeholder="Value"
                    value={formData.values[index]}
                    onChange={(e) => onValueChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm"
                    disabled={submitting}
                  />
                )}
                {formData.options.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveOption(index)}
                    className="text-red-600 hover:text-red-700"
                    disabled={submitting}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={onAddOption}
              className="w-full mt-1"
              disabled={submitting}
            >
              Add Option
            </Button>
          </div>
        </div>

        {/* Required & Sort Order */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={formData.isRequired}
              onChange={(e) =>
                onFormDataChange({ ...formData, isRequired: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={submitting}
            />
            <span className="text-sm font-medium text-gray-700">
              Required Attribute
            </span>
          </div>
          <div className="mt-2">
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Sort Order
            </label>
            <input
              type="number"
              min="1"
              value={formData.sortOrder}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  sortOrder: parseInt(e.target.value),
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm"
              disabled={submitting}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">
            Link Categories
          </label>
          <div className="grid grid-cols-2 gap-3 max-h-44 overflow-y-auto border border-gray-200 rounded-lg p-3">
            {categories.length > 0 ? (
              categories.map((category) => (
                <label
                  key={category.id}
                  className={`flex items-center p-2 border rounded cursor-pointer transition-colors ${
                    formData.linkedCategories.includes(category.id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  } ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={formData.linkedCategories.includes(category.id)}
                    onChange={() => onCategoryToggle(category.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={submitting}
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {category.name}
                  </span>
                </label>
              ))
            ) : (
              <span className="text-sm text-gray-500 col-span-2 text-center py-2">
                No categories available
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={onClose}
            type="button"
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit">
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {editingAttribute ? "Updating..." : "Creating..."}
              </>
            ) : editingAttribute ? (
              "Update Attribute"
            ) : (
              "Add Attribute"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
