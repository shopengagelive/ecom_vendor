import Modal from "../ui/Modal"
import Button from "../ui/Button"

export interface ShippingPolicy {
  policy: string
  isCheck: boolean
}

interface PolicyModalProps {
  isOpen: boolean
  onClose: () => void
  shippingPolicy: ShippingPolicy
  onShippingPolicyChange: (policy: ShippingPolicy) => void
  onSave: () => void;
  isSubmitting: boolean;
  error: any
}

export default function PolicyModal({
  isOpen,
  onClose,
  shippingPolicy,
  onShippingPolicyChange,
  onSave,
  isSubmitting,
  error,
}: PolicyModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Shipping Policies"
      size="lg"
    >
      {
        error &&
        <div className="bg-red-100 text-red-700 w-full p-3 rounded-lg" >{error}</div>
      }
      <div className="space-y-6">
        {/* Shipping Policy Textarea */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Shipping Information
          </label>
          <textarea
            value={shippingPolicy.policy}
            onChange={(e) =>
              onShippingPolicyChange({
                ...shippingPolicy,
                policy: e.target.value,
              })
            }
            rows={6}
            placeholder="Enter your shipping policy details..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        {/* isCheck Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Status
          </label>
          <select
            value={shippingPolicy.isCheck ? "true" : "false"}
            onChange={(e) =>
              onShippingPolicyChange({
                ...shippingPolicy,
                isCheck: e.target.value === "true",
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave} >{isSubmitting ? 'Saving...' : 'Save'}</Button>
        </div>
      </div>
    </Modal>
  )
}
