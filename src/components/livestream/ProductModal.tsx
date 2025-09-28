import React from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { Plus, X } from "lucide-react";
import { ProductModalProps } from "./types";

export default function ProductModal({
  isOpen,
  onClose,
  selectedStream,
  selectedReel,
  onAddProduct,
  onRemoveProduct,
}: ProductModalProps) {
  const products = selectedStream?.taggedProducts || selectedReel?.taggedProducts || [];
  const title = selectedStream ? selectedStream.broadcastTitle : selectedReel?.caption;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={selectedStream ? "Tagged Products" : "Reel Products"}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">{title}</h3>
          <Button
            variant="ghost"
            size="sm"
            icon={Plus}
            className="text-green-600 hover:text-green-800 border border-green-600"
            onClick={onAddProduct}
          >
            Add Product
          </Button>
        </div>

        <div className="grid gap-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-gray-500">IMG</span>
                </div>
                <div>
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-sm text-gray-600">₹{product.price}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon={X}
                className="text-red-600 hover:text-red-800"
                onClick={() => onRemoveProduct(product.id)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
