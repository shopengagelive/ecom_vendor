import React from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { ShoppingCart, MapPin, X } from "lucide-react";
import { CreateOrderModalProps } from "./types";

export default function CreateOrderModal({
  isOpen,
  onClose,
  orderForm,
  onOrderFormChange,
  onAddProduct,
  onRemoveProduct,
  onUpdateQuantity,
  onPlaceOrder,
  products,
}: CreateOrderModalProps) {
  const total = orderForm.selectedProducts.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Order"
      size="xl"
    >
      <div className="space-y-6">
        {/* Customer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Name
            </label>
            <input
              type="text"
              value={orderForm.customerName}
              onChange={(e) =>
                onOrderFormChange({ ...orderForm, customerName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={orderForm.customerEmail}
              onChange={(e) =>
                onOrderFormChange({ ...orderForm, customerEmail: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={orderForm.customerPhone}
              onChange={(e) =>
                onOrderFormChange({ ...orderForm, customerPhone: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <input
              type="text"
              value={orderForm.address.country}
              onChange={(e) =>
                onOrderFormChange({
                  ...orderForm,
                  address: { ...orderForm.address, country: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Shipping Address
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <input
                type="text"
                value={orderForm.address.street}
                onChange={(e) =>
                  onOrderFormChange({
                    ...orderForm,
                    address: { ...orderForm.address, street: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={orderForm.address.city}
                onChange={(e) =>
                  onOrderFormChange({
                    ...orderForm,
                    address: { ...orderForm.address, city: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                value={orderForm.address.state}
                onChange={(e) =>
                  onOrderFormChange({
                    ...orderForm,
                    address: { ...orderForm.address, state: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                value={orderForm.address.zipCode}
                onChange={(e) =>
                  onOrderFormChange({
                    ...orderForm,
                    address: {
                      ...orderForm.address,
                      zipCode: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Products */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Select Products
          </h4>

          {/* Available Products */}
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">
              Available Products
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-40 overflow-y-auto">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        typeof product.image === "string" ? product.image : ""
                      }
                      alt={product.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        ₹{product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onAddProduct(product)}
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Products */}
          {orderForm.selectedProducts.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">
                Selected Products
              </h5>
              <div className="space-y-2">
                {orderForm.selectedProducts.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={
                          typeof item.product.image === "string"
                            ? item.product.image
                            : ""
                        }
                        alt={item.product.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          ₹{item.product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          onUpdateQuantity(
                            item.product.id,
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onRemoveProduct(item.product.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-lg font-semibold text-blue-900">
                  Total: ₹{total.toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={onPlaceOrder}
            disabled={orderForm.selectedProducts.length === 0}
          >
            Place Order
          </Button>
        </div>
      </div>
    </Modal>
  );
}
