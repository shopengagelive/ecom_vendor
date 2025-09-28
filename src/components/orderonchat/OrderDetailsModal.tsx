import React from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { OrderDetailsModalProps } from "./types";

export default function OrderDetailsModal({
  isOpen,
  onClose,
  selectedOrder,
  onProcessOrder,
}: OrderDetailsModalProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "Shipped":
        return "info";
      case "Processing":
        return "warning";
      case "Pending":
        return "default";
      case "Cancelled":
        return "danger";
      default:
        return "default";
    }
  };

  if (!selectedOrder) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Order Details"
      size="lg"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Order ID
            </label>
            <p className="text-sm text-gray-900">{selectedOrder.id}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Status
            </label>
            <Badge variant={getStatusVariant(selectedOrder.status)}>
              {selectedOrder.status}
            </Badge>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Customer
            </label>
            <p className="text-sm text-gray-900">
              {selectedOrder.customerName}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Total
            </label>
            <p className="text-sm text-gray-900">
              ₹{selectedOrder.total.toFixed(2)}
            </p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Items</label>
          <div className="mt-2 space-y-2">
            {selectedOrder.items.map((item: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <span className="text-sm">{item.productName}</span>
                <span className="text-sm font-medium">
                  ₹{item.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Close
          </Button>
          <Button onClick={onProcessOrder}>Process Order</Button>
        </div>
      </div>
    </Modal>
  );
}
