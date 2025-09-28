import React from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { MethodFormData, FreeShippingRequirement, MethodOption } from "./types";

interface MethodModalProps {
  isOpen: boolean;
  savingZone: boolean;
  onClose: () => void;
  editingMethod: any | null;
  methodFormData: any;
  onMethodFormDataChange: (data: MethodFormData) => void;
  onSave: () => void;
  methodError: string | null;
  methodOptions: readonly MethodOption[];
}

export default function MethodModal({
  isOpen,
  onClose,
  savingZone,
  editingMethod,
  methodFormData,
  onMethodFormDataChange,
  onSave,
  methodError,
  methodOptions,
}: MethodModalProps) {

  console.log(methodFormData)
  console.log(methodOptions)
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingMethod ? "Edit Shipping Method" : "Add New Shipping Method"}
      size="lg"
    >
      <div className="space-y-6">
        <p className="text-sm text-gray-600">
          Choose the shipping method you wish to add. Only shipping methods
          which support zones are listed.
        </p>
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Select a method
          </label>
          <select
            value={methodFormData.name}
            onChange={(e) => {
              const value = e.target.value as MethodOption | "";
              if (value === "Free Shipping") {
                onMethodFormDataChange({
                  ...methodFormData,
                  name: value,
                  isFree: true,
                  cost: 0,
                  freeShippingRequirement: "none",
                  minOrderAmount: 0,
                  applyMinBeforeCoupon: false,
                });
              } else if (value === "Local Pickup") {
                onMethodFormDataChange({
                  ...methodFormData,
                  name: value,
                  isFree: false,
                  cost: 0,
                });
              } else {
                onMethodFormDataChange({
                  ...methodFormData,
                  name: value,
                  isFree: false,
                  cost: methodFormData.cost || 0,
                });
              }
            }}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
              methodError ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select a method</option>
            {methodOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {methodError && (
            <p className="mt-1 text-xs text-red-600">{methodError}</p>
          )}
        </div>

        {/* Method Title */}
        {methodFormData.name && (
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Method Title
            </label>
            <input
              type="text"
              value={methodFormData.title || methodFormData.name}
              onChange={(e) =>
                onMethodFormDataChange({
                  ...methodFormData,
                  title: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Enter method title"
            />
          </div>
        )}

        {/* Fields common / conditional */}
        {methodFormData.name && methodFormData.name !== "Free Shipping" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Cost
                </label>
                <input
                  type="number"
                  min={0}
                  value={methodFormData.isFree ? 0 : methodFormData.cost}
                  onChange={(e) =>
                    onMethodFormDataChange({
                      ...methodFormData,
                      cost: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder={
                    methodFormData.name === "Flat Rate" ? "e.g., 50" : "0"
                  }
                />
              </div>
              {/* <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Delivery days
                </label>
                <input
                  type="number"
                  min={1}
                  value={methodFormData.deliveryDays}
                  onChange={(e) =>
                    onMethodFormDataChange({
                      ...methodFormData,
                      deliveryDays: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="e.g., 3"
                />
              </div> */}
            </div>

            {/* {methodFormData.name !== "Local Pickup" && (
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={methodFormData.isFree}
                  onChange={(e) =>
                    onMethodFormDataChange({
                      ...methodFormData,
                      isFree: e.target.checked,
                      cost: e.target.checked ? 0 : methodFormData.cost,
                    })
                  }
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Mark as free</span>
              </label>
            )} */}
          </>
        )}

        {/* Free Shipping advanced settings */}
        {methodFormData.name === "Free Shipping" && (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Free Shipping Requires
              </label>
              <select
                value={methodFormData.freeShippingRequirement}
                onChange={(e) =>
                  onMethodFormDataChange({
                    ...methodFormData,
                    freeShippingRequirement: e.target.value as FreeShippingRequirement,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                <option value="none">No requirement</option>
                <option value="min_amount">A minimum amount</option>
                {/* <option value="coupon">A valid coupon</option> */}
                {/* <option value="min_or_coupon">
                  A minimum amount OR coupon
                </option> */}
                {/* <option value="min_and_coupon">
                  A minimum amount AND coupon
                </option> */}
              </select>
            </div>

            {(methodFormData.freeShippingRequirement === "min_amount" ||
              methodFormData.freeShippingRequirement === "min_or_coupon" ||
              methodFormData.freeShippingRequirement === "min_and_coupon") && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Minimum order amount for free shipping
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={methodFormData.minOrderAmount}
                    onChange={(e) =>
                      onMethodFormDataChange({
                        ...methodFormData,
                        minOrderAmount: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={methodFormData.applyMinBeforeCoupon}
                    onChange={(e) =>
                      onMethodFormDataChange({
                        ...methodFormData,
                        applyMinBeforeCoupon: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Apply minimum order rule before coupon discount
                  </span>
                </label>
              </>
            )}
          </>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose} disabled={savingZone}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={savingZone || !methodFormData.name}>
            {savingZone
              ? editingMethod
                ? "Saving..."
                : "Adding..."
              : editingMethod
              ? "Save Method"
              : "Add Method"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}