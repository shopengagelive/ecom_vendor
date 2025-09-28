import { useState, useEffect } from "react";
import { Search, Plus, Minus, Trash2, Copy, Check } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import {
  CreateOrderModalProps,
  CreateOrderFormData,
  Address,
  OrderProduct,
} from "./types";

// Mock products for search
const mockProducts = [
  { id: "1", code: "PROD001", name: "Wireless Headphones", price: 2999 },
  { id: "2", code: "PROD002", name: "Smart Watch", price: 8999 },
  { id: "3", code: "PROD003", name: "Bluetooth Speaker", price: 1999 },
  { id: "4", code: "PROD004", name: "Phone Case", price: 499 },
  { id: "5", code: "PROD005", name: "Laptop Stand", price: 1299 },
];

export default function CreateOrderModal({
  isOpen,
  onClose,
  onSave,
}: CreateOrderModalProps) {
  const [formData, setFormData] = useState<CreateOrderFormData>({
    mobileNumber: "",
    firstName: "",
    lastName: "",
    email: "",
    shippingAddress: {
      address: "",
      city: "",
      state: "",
      country: "India",
      pinCode: "",
      landmark: "",
    },
    billingAddress: {
      address: "",
      city: "",
      state: "",
      country: "India",
      pinCode: "",
      landmark: "",
    },
    copyBillingToShipping: false,
    products: [],
    couponCode: "",
    totalDiscount: 0,
    shippingCharges: 0,
    bankDiscount: 0,
    couponDiscount: 0,
    paymentMode: "cod",
  });

  const [productSearch, setProductSearch] = useState("");
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [errors, setErrors] = useState<Partial<CreateOrderFormData>>({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        mobileNumber: "",
        firstName: "",
        lastName: "",
        email: "",
        shippingAddress: {
          address: "",
          city: "",
          state: "",
          country: "India",
          pinCode: "",
          landmark: "",
        },
        billingAddress: {
          address: "",
          city: "",
          state: "",
          country: "India",
          pinCode: "",
          landmark: "",
        },
        copyBillingToShipping: false,
        products: [],
        couponCode: "",
        totalDiscount: 0,
        shippingCharges: 0,
        bankDiscount: 0,
        couponDiscount: 0,
        paymentMode: "cod",
      });
      setErrors({});
    }
  }, [isOpen]);

  // Filter products based on search
  useEffect(() => {
    if (productSearch) {
      const filtered = mockProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
          product.code.toLowerCase().includes(productSearch.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(mockProducts);
    }
  }, [productSearch]);

  // Copy billing address to shipping
  useEffect(() => {
    if (formData.copyBillingToShipping) {
      setFormData((prev) => ({
        ...prev,
        shippingAddress: { ...prev.billingAddress },
      }));
    }
  }, [formData.copyBillingToShipping, formData.billingAddress]);

  const handleInputChange = (field: keyof CreateOrderFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddressChange = (
    type: "shipping" | "billing",
    field: keyof Address,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [`${type}Address`]: {
        ...prev[`${type}Address`],
        [field]: value,
      },
    }));
  };

  const addProduct = (product: (typeof mockProducts)[0]) => {
    const existingProduct = formData.products.find(
      (p) => p.productCode === product.code
    );

    if (existingProduct) {
      updateProductQuantity(existingProduct.id, existingProduct.quantity + 1);
    } else {
      const newProduct: OrderProduct = {
        id: Date.now().toString(),
        productCode: product.code,
        productName: product.name,
        price: product.price,
        quantity: 1,
        total: product.price,
      };
      setFormData((prev) => ({
        ...prev,
        products: [...prev.products, newProduct],
      }));
    }
    setProductSearch("");
    setShowProductSearch(false);
  };

  const updateProductQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeProduct(productId);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((product) =>
        product.id === productId
          ? { ...product, quantity, total: product.price * quantity }
          : product
      ),
    }));
  };

  const removeProduct = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((product) => product.id !== productId),
    }));
  };

  const calculateTotals = () => {
    const subtotal = formData.products.reduce(
      (sum, product) => sum + product.total,
      0
    );
    const total = subtotal + formData.shippingCharges - formData.totalDiscount;
    return { subtotal, total };
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateOrderFormData> = {};

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.shippingAddress.address.trim()) {
      newErrors.shippingAddress = {
        ...newErrors.shippingAddress,
        address: "Shipping address is required",
      };
    }

    if (formData.products.length === 0) {
      newErrors.products = "At least one product is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const { subtotal, total } = calculateTotals();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Order" size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Mobile Number *
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) =>
                  handleInputChange("mobileNumber", e.target.value)
                }
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.mobileNumber ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter mobile number"
              />
            </div>
            {errors.mobileNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.firstName ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter first name"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.lastName ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter last name"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Shipping Address
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <textarea
                  value={formData.shippingAddress.address}
                  onChange={(e) =>
                    handleAddressChange("shipping", "address", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.shippingAddress?.address
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  rows={3}
                  placeholder="Enter shipping address"
                />
                {errors.shippingAddress?.address && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.shippingAddress.address}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.shippingAddress.city}
                    onChange={(e) =>
                      handleAddressChange("shipping", "city", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.shippingAddress.state}
                    onChange={(e) =>
                      handleAddressChange("shipping", "state", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="State"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    value={formData.shippingAddress.pinCode}
                    onChange={(e) =>
                      handleAddressChange("shipping", "pinCode", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="PIN Code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Landmark
                  </label>
                  <input
                    type="text"
                    value={formData.shippingAddress.landmark || ""}
                    onChange={(e) =>
                      handleAddressChange(
                        "shipping",
                        "landmark",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Landmark (optional)"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Billing Address */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Billing Address
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="copyBilling"
                  checked={formData.copyBillingToShipping}
                  onChange={(e) =>
                    handleInputChange("copyBillingToShipping", e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="copyBilling"
                  className="ml-2 text-sm text-gray-700"
                >
                  Copy shipping address to billing address
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={formData.billingAddress.address}
                  onChange={(e) =>
                    handleAddressChange("billing", "address", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter billing address"
                  disabled={formData.copyBillingToShipping}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.billingAddress.city}
                    onChange={(e) =>
                      handleAddressChange("billing", "city", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="City"
                    disabled={formData.copyBillingToShipping}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.billingAddress.state}
                    onChange={(e) =>
                      handleAddressChange("billing", "state", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="State"
                    disabled={formData.copyBillingToShipping}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    value={formData.billingAddress.pinCode}
                    onChange={(e) =>
                      handleAddressChange("billing", "pinCode", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="PIN Code"
                    disabled={formData.copyBillingToShipping}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Landmark
                  </label>
                  <input
                    type="text"
                    value={formData.billingAddress.landmark || ""}
                    onChange={(e) =>
                      handleAddressChange("billing", "landmark", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Landmark (optional)"
                    disabled={formData.copyBillingToShipping}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Search and List */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Products</h3>

          {/* Product Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                onFocus={() => setShowProductSearch(true)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search products by name or code..."
              />
            </div>

            {/* Product Search Results */}
            {showProductSearch && productSearch && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => addProduct(product)}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Code: {product.code}
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        ₹{product.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Products */}
          <div className="space-y-2">
            {formData.products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {product.productName}
                  </div>
                  <div className="text-sm text-gray-500">
                    Code: {product.productCode} | ₹{product.price}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    icon={Minus}
                    onClick={() =>
                      updateProductQuantity(product.id, product.quantity - 1)
                    }
                  />
                  <span className="w-8 text-center">{product.quantity}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    icon={Plus}
                    onClick={() =>
                      updateProductQuantity(product.id, product.quantity + 1)
                    }
                  />
                  <span className="w-16 text-right font-medium">
                    ₹{product.total}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    onClick={() => removeProduct(product.id)}
                    className="text-red-600 hover:text-red-700"
                  />
                </div>
              </div>
            ))}
          </div>

          {formData.products.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No products added. Search and add products above.
            </div>
          )}
        </div>

        {/* Coupon and Pricing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Coupon & Discounts
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coupon Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.couponCode}
                    onChange={(e) =>
                      handleInputChange("couponCode", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter coupon code"
                  />
                  <Button type="button" variant="secondary">
                    Apply
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Discount</span>
                  <span className="text-sm font-medium">
                    ₹{formData.totalDiscount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Shipping Charges
                  </span>
                  <span className="text-sm font-medium">
                    ₹{formData.shippingCharges}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Bank Discount</span>
                  <span className="text-sm font-medium">
                    ₹{formData.bankDiscount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Coupon Discount</span>
                  <span className="text-sm font-medium">
                    ₹{formData.couponDiscount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Payment Mode
            </h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMode"
                  value="cod"
                  checked={formData.paymentMode === "cod"}
                  onChange={(e) =>
                    handleInputChange("paymentMode", e.target.value)
                  }
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Cash on Delivery (COD)
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMode"
                  value="payment-link"
                  checked={formData.paymentMode === "payment-link"}
                  onChange={(e) =>
                    handleInputChange("paymentMode", e.target.value)
                  }
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Payment Link</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMode"
                  value="qr"
                  checked={formData.paymentMode === "qr"}
                  onChange={(e) =>
                    handleInputChange("paymentMode", e.target.value)
                  }
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">QR Code</span>
              </label>
            </div>

            {/* Order Summary */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-medium">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Shipping</span>
                  <span className="text-sm font-medium">
                    ₹{formData.shippingCharges}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Discount</span>
                  <span className="text-sm font-medium text-green-600">
                    -₹{formData.totalDiscount}
                  </span>
                </div>
                <div className="border-t border-gray-300 pt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      ₹{total}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Place Order
          </Button>
        </div>
      </form>
    </Modal>
  );
}

