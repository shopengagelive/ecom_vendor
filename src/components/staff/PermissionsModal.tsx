import React from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { PermissionsModalProps } from "./types";

export default function PermissionsModal({
  isOpen,
  onClose,
  selectedStaff,
  permissions,
  onPermissionsChange,
  onSave,
}: PermissionsModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Manage Permissions - ${selectedStaff?.name}`}
      size="lg"
    >
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            Select the permissions you want to grant to{" "}
            <span className="font-semibold">{selectedStaff?.name}</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">
              Core Features
            </h3>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={permissions.orders}
                onChange={(e) =>
                  onPermissionsChange({
                    ...permissions,
                    orders: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Orders Management
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={permissions.products}
                onChange={(e) =>
                  onPermissionsChange({
                    ...permissions,
                    products: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Products Management
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={permissions.customers}
                onChange={(e) =>
                  onPermissionsChange({
                    ...permissions,
                    customers: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Customer Management
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={permissions.payments}
                onChange={(e) =>
                  onPermissionsChange({
                    ...permissions,
                    payments: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Payments & Payouts
              </span>
            </label>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">
              Analytics & Reports
            </h3>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={permissions.analytics}
                onChange={(e) =>
                  onPermissionsChange({
                    ...permissions,
                    analytics: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Analytics Dashboard
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={permissions.reports}
                onChange={(e) =>
                  onPermissionsChange({
                    ...permissions,
                    reports: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Reports & Insights
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={permissions.settings}
                onChange={(e) =>
                  onPermissionsChange({
                    ...permissions,
                    settings: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Store Settings
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={permissions.staff}
                onChange={(e) =>
                  onPermissionsChange({
                    ...permissions,
                    staff: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Staff Management
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save Permissions</Button>
        </div>
      </div>
    </Modal>
  );
}
