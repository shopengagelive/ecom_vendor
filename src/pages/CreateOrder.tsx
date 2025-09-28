import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import {
  CreateOrderFormData,
  Address,
  OrderProduct,
} from "../components/orders/types";

// Mock products for search
const mockProducts = [
  {
    id: "1",
    code: "PROD001",
    name: "Printed Black Sweatshirt",
    price: 200,
    image:
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=80&h=80&fit=crop&crop=center",
  },
  {
    id: "2",
    code: "PROD002",
    name: "Lavie Rice Brightening Face Wash",
    price: 1399,
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=80&h=80&fit=crop&crop=center",
  },
  {
    id: "3",
    code: "PROD003",
    name: "Canvas School Bag - Unisex",
    price: 100,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=80&h=80&fit=crop&crop=center",
  },
  {
    id: "4",
    code: "PROD004",
    name: "Wireless Headphones",
    price: 2999,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop&crop=center",
  },
  {
    id: "5",
    code: "PROD005",
    name: "Smart Watch",
    price: 8999,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop&crop=center",
  },
  {
    id: "6",
    code: "PROD006",
    name: "Bluetooth Speaker",
    price: 1999,
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=80&h=80&fit=crop&crop=center",
  },
  {
    id: "7",
    code: "PROD007",
    name: "Phone Case",
    price: 499,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=80&h=80&fit=crop&crop=center",
  },
  {
    id: "8",
    code: "PROD008",
    name: "Laptop Stand",
    price: 1299,
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=80&h=80&fit=crop&crop=center",
  },
];

export default function CreateOrder() {
  const navigate = useNavigate();
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
    },
    billingAddress: {
      address: "",
      city: "",
      state: "",
      country: "India",
      pinCode: "",
    },
    copyBillingToShipping: false,
    products: [
      {
        id: "1",
        productCode: "PROD001",
        productName: "Printed Black Sweatshirt",
        price: 200,
        quantity: 1,
        total: 200,
      },
      {
        id: "2",
        productCode: "PROD002",
        productName: "Lavie Rice Brightening Face Wash",
        price: 1399,
        quantity: 1,
        total: 1399,
      },
      {
        id: "3",
        productCode: "PROD003",
        productName: "Canvas School Bag - Unisex",
        price: 100,
        quantity: 1,
        total: 100,
      },
    ],
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
  const [errors, setErrors] = useState<Record<string, any>>({});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".product-search-container")) {
        setShowProductSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    const newErrors: Record<string, any> = {};

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
      console.log("Creating new order:", formData);
      // Here you would typically send the data to your API
      alert("Order created successfully!");
      navigate("/orders");
    }
  };

  const { subtotal, total } = calculateTotals();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate("/orders")}
            className="p-2"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Order</h1>
            <p className="text-sm text-gray-500">
              Fill in the details to create a new order
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Details */}
        <Card>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Customer Details
            </h3>
            <div className="space-y-4">
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
                  <p className="mt-1 text-sm text-red-600">
                    {errors.mobileNumber}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.firstName ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.lastName ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.lastName}
                    </p>
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
            </div>
          </div>
        </Card>

        {/* Addresses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <Card>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Shipping Address
              </h3>
              <div className="space-y-4">
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
              </div>
            </div>
          </Card>

          {/* Billing Address */}
          <Card>
            <div className="mb-6">
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
                      handleInputChange(
                        "copyBillingToShipping",
                        e.target.checked
                      )
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
              </div>
            </div>
          </Card>
        </div>

        {/* Product Search and List */}
        <Card>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Products
            </h3>

            {/* Product Search */}
            <div className="mb-4 product-search-container relative">
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

              {/* Product Search Results Dropdown */}
              {showProductSearch && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center space-x-3">
                        {/* Product Image */}
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 mb-1">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 mb-1">
                            Product ID: {product.code}
                          </div>
                          <div className="text-sm font-semibold text-gray-900">
                            ₹{product.price}
                          </div>
                        </div>

                        {/* Add Button */}
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          onClick={() => addProduct(product)}
                          className="ml-2 flex-shrink-0"
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile-style Product Cards - Two in a row */}
            <div className="grid grid-cols-2 gap-4">
              {formData.products.map((product, index) => {
                // Mock data to match the screenshot exactly
                const mockProducts = [
                  {
                    name: "Printed Black Sweatshirt",
                    currentPrice: 200.0,
                    originalPrice: 1000.0,
                    discount: 70,
                    color: "Black",
                    size: "40",
                    seller: "Seller A",
                    image:
                      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=80&h=80&fit=crop&crop=center",
                  },
                  {
                    name: "Lavie Rice Brightening Face Wash",
                    currentPrice: 1399.0,
                    originalPrice: 7000.0,
                    discount: 80,
                    color: "Brown",
                    size: "One Size",
                    seller: "Seller B",
                    image:
                      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=80&h=80&fit=crop&crop=center",
                  },
                  {
                    name: "Canvas School Bag - Unisex",
                    currentPrice: 100.0,
                    originalPrice: 150.0,
                    discount: 50,
                    color: "Green",
                    size: "40",
                    seller: "Jack",
                    image:
                      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=80&h=80&fit=crop&crop=center",
                  },
                ];

                const mockProduct = mockProducts[index] || {
                  name: product.productName,
                  currentPrice: product.price,
                  originalPrice: Math.round(product.price * 1.5),
                  discount: 30,
                  color: "Black",
                  size: "40",
                  seller: "Jack",
                };

                return (
                  <div
                    key={product.id}
                    className="flex items-start space-x-4 p-4 bg-white"
                  >
                    {/* Product Image - Increased size */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img
                        src={mockProduct.image}
                        alt={mockProduct.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-sm mb-1">
                          {mockProduct.name}
                        </h3>
                        <div className="text-xs text-gray-500 mb-1">
                          Product ID: {product.productCode}
                        </div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-bold text-gray-900">
                            ₹{mockProduct.currentPrice}
                          </span>
                          <span className="text-xs text-gray-500 line-through">
                            ₹{mockProduct.originalPrice}
                          </span>
                          <span className="text-xs bg-green-100 text-green-600 px-1 py-0.5 rounded">
                            {mockProduct.discount} OFF
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          Color: {mockProduct.color} • Size: {mockProduct.size}
                        </div>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center space-x-2 mb-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateProductQuantity(
                              product.id,
                              product.quantity - 1
                            )
                          }
                          className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">
                          {product.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateProductQuantity(
                              product.id,
                              product.quantity + 1
                            )
                          }
                          className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-xs text-gray-500 mb-2">
                        Sold by: {mockProduct.seller}
                      </div>

                      {/* Remove Button - Moved below */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => removeProduct(product.id)}
                        className="text-gray-400 hover:text-red-600 p-1 w-fit"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {formData.products.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No products added. Search and add products above.
              </div>
            )}
          </div>
        </Card>

        {/* Mobile-style Bag/Cart Layout */}
        <div className="space-y-4">
          {/* Apply Coupon Code Section */}
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">
                  Apply Coupon Code
                </h3>
                <button className="text-purple-600 text-sm font-medium">
                  View Coupons
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={formData.couponCode}
                  onChange={(e) =>
                    handleInputChange("couponCode", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Choose coupon"
                />
              </div>
            </div>
          </Card>

          {/* Price Details Section */}
          <Card>
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Price Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Bag-Total</span>
                  <span className="font-medium">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Bag Discount</span>
                  <span className="text-gray-500 text-sm">
                    -₹{formData.totalDiscount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Coupon Discount</span>
                  <span className="text-gray-500 text-sm">
                    -₹{formData.couponDiscount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Fee</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      Grand Total
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      ₹{total}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Select Payment Method Section */}
          <Card>
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Select Payment Method
              </h3>
              <div className="space-y-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMode"
                    value="cod"
                    checked={formData.paymentMode === "cod"}
                    onChange={(e) =>
                      handleInputChange("paymentMode", e.target.value)
                    }
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-700 font-medium">
                    Cash on Delivery
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMode"
                    value="qr"
                    checked={formData.paymentMode === "qr"}
                    onChange={(e) =>
                      handleInputChange("paymentMode", e.target.value)
                    }
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-700 font-medium">
                    Payment on QR
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMode"
                    value="payment-link"
                    checked={formData.paymentMode === "payment-link"}
                    onChange={(e) =>
                      handleInputChange("paymentMode", e.target.value)
                    }
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-700 font-medium">
                    Payments on link
                  </span>
                </label>
              </div>
            </div>
            {/* Large Horizontal Place Order Button */}
            <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
              <Button
                type="submit"
                variant="primary"
                className="w-full bg-black text-white py-4 rounded-lg font-medium text-lg"
              >
                Place Order
              </Button>
            </div>
          </Card>
        </div>

        {/* Spacer to prevent content from being hidden behind fixed bottom bar */}
        <div className="h-20"></div>
      </form>
    </div>
  );
}
