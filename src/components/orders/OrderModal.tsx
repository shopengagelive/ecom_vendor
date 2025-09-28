import { useState } from "react";
import Modal from "../ui/Modal";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { Order } from "../../types";
import { Truck, Trash2 } from "lucide-react";
import ShipmentsPanel from "./ShipmentsPanel";
import { CollapsibleShipmentRow } from "./CollapsableShipmentRow";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export default function OrderModal({
  isOpen,
  onClose,
  order,
}: OrderModalProps) {
  const [newNote, setNewNote] = useState("");
  const [isCustomerNote, setIsCustomerNote] = useState(false);

  if (!order) return null;

  const getStatusVariant = (status: Order["status"]) => {
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
      case "Failed":
        return "danger";
      case "Refund":
        return "warning";
      default:
        return "default";
    }
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      console.log("Adding note:", newNote, "Customer note:", isCustomerNote);
      setNewNote("");
      setIsCustomerNote(false);
    }
  };

  // const handleCreateShipment = () => {
  //   console.log("Creating new shipment for order:", order.id);
  // };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Order#${order.id}`}
      size="6xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 min-h-[70vh]">
        {/* Left Panel - Order Items & Shipments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm mr-3">
                  #{order.id}
                </span>
                Order Items
              </h3>
            </div>

            <div className="p-6">
              {/* Items Table */}
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {item.productName}
                      </h4>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-sm text-gray-600">
                        Cost: ₹{item.price.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </div>
                      <div className="font-medium">
                        Total: ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Tax: ₹{item.tax.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping Row */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 mt-4">
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-900">Free Shipping</span>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-sm text-gray-600">
                    Cost: ₹{order.shipping.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Tax: -</div>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-6 space-y-3 text-sm bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount:</span>
                  <span className="text-gray-900">
                    -₹{order.discount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Coupon Discount:</span>
                  <span className="text-gray-900">
                    -₹{order.discount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="text-gray-900">
                    ₹{order.shipping.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="text-gray-900">₹{order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-blue-200 pt-3">
                  <span className="text-blue-900">Order Total:</span>
                  <span className="text-blue-900">
                    ₹{order.total.toFixed(2)}
                  </span>
                </div>
                {order.refunded > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Refunded:</span>
                    <span>-₹{order.refunded.toFixed(2)}</span>
                  </div>
                )}
              </div> 
            </div>
          </div>

          {/* Shipments */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <Truck className="w-5 h-5 mr-2 text-purple-600" />
                Shipments
              </h3>
            </div>

            <div className="p-6">
              {order.shipments && order.shipments.length > 0 ? (
                <div className="space-y-4">
                  {order.shipments.map((shipment) => (
                    <CollapsibleShipmentRow
                      key={shipment.id}
                      shipment={shipment}
                    />
                  ))}
                </div>
              ) : (
                <ShipmentsPanel />
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - General Details & Order Notes */}
        <div className="space-y-6">
          {/* General Details */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                General Details
              </h3>
            </div>

            <div className="p-6 space-y-4 bg-gradient-to-br from-white to-emerald-50/30">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-600">Order Status:</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusVariant(order.status)}>
                      {order.status}
                    </Badge>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      Edit
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-sm text-gray-600">Order Date:</span>
                <p className="text-gray-900">
                  {new Date(order.date).toLocaleString()}
                </p>
              </div>

              <div>
                <span className="text-sm text-gray-600">
                  Earning From Order:
                </span>
                <p className="text-gray-900 font-medium">
                  ₹{order.earning.toFixed(2)}
                </p>
              </div>

              <div>
                <span className="text-sm text-gray-600">Customer:</span>
                <p className="text-gray-900">{order.customerName}</p>
              </div>

              <div>
                <span className="text-sm text-gray-600">Email:</span>
                <p className="text-gray-900">{order.customerEmail}</p>
              </div>

              {order.customerPhone && (
                <div>
                  <span className="text-sm text-gray-600">Phone:</span>
                  <p className="text-gray-900">{order.customerPhone}</p>
                </div>
              )}

              {/* {order.customerIP && (
                <div>
                  <span className="text-sm text-gray-600">Customer IP:</span>
                  <p className="text-gray-900">{order.customerIP}</p>
                </div>
              )} */}

              {/* Billing Address */}
              {order.billingAddress && (
                <div>
                  <span className="text-sm text-gray-600">
                    Billing Address:
                  </span>
                  <div className="text-gray-900 mt-1">
                    <p>{order.billingAddress.name}</p>
                    <p>{order.billingAddress.address}</p>
                    <p>
                      {order.billingAddress.city}, {order.billingAddress.state}{" "}
                      {order.billingAddress.zipCode}
                    </p>
                    <p>{order.billingAddress.country}</p>
                    <p>{order.billingAddress.phone}</p>
                  </div>
                </div>
              )}

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div>
                  <span className="text-sm text-gray-600">
                    Shipping Address:
                  </span>
                  <div className="text-gray-900 mt-1">
                    <p>{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}{" "}
                      {order.shippingAddress.zipCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                    <p>{order.shippingAddress.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Notes */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                Order Notes
              </h3>
            </div>

            <div className="p-6 space-y-4 bg-gradient-to-br from-white to-orange-50/30">
              {/* Existing Notes */}
              {order.notes && order.notes.length > 0 ? (
                <div className="space-y-3">
                  {order.notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100"
                    >
                      <p className="text-gray-900">{note.text}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">
                          {new Date(note.date).toLocaleDateString()} -{" "}
                          {note.isCustomerNote ? "Customer note" : "Admin note"}
                        </span>
                        <button className="text-red-600 hover:text-red-800 text-sm">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No notes yet</p>
              )}

              {/* Add Note Form */}
              <div className="space-y-3">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none bg-white/80 backdrop-blur-sm"
                  rows={3}
                />

                <div className="flex items-center space-x-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isCustomerNote}
                      onChange={(e) => setIsCustomerNote(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">Customer note</span>
                  </label>
                </div>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                >
                  ADD NOTE
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
