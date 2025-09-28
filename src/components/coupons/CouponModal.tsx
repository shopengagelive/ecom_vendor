import React, { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { ArrowLeft, Plus, Globe, Edit, ChevronDown } from "lucide-react";

interface CouponFormData {
  title: string;
  description: string;
  discountType: string;
  amount: string;
  emailRestrictions: string;
  usageLimit: string;
  usageLimitPerUser: string;
  expireDate: string;
  excludeSaleItems: boolean;
  minimumAmount: string;
  product: string;
  excludeProducts: string;
  categories: string;
}

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (couponData: CouponFormData) => void;
}

export default function CouponModal({
  isOpen,
  onClose,
  onSubmit,
}: CouponModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discountType: "PERCENTAGE DISCOUNT",
    amount: "",
    emailRestrictions: "",
    usageLimit: "",
    usageLimitPerUser: "",
    expireDate: "",
    excludeSaleItems: false,
    minimumAmount: "",
    product: "",
    excludeProducts: "",
    categories: "",
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create Coupon</h2>
          <Button
            onClick={onClose}
            variant="ghost"
            className="flex items-center gap-2 text-red-600 border border-red-600 hover:bg-red-50"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Coupon Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coupon Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter coupon title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <div className="relative">
              <textarea
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-20"
              />
              <div className="absolute right-2 top-2 flex gap-1">
                <button
                  type="button"
                  className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600"
                >
                  <Plus className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600"
                >
                  <Globe className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600"
                >
                  <Edit className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Discount Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Type
            </label>
            <div className="relative">
              <select
                value={formData.discountType}
                onChange={(e) =>
                  handleInputChange("discountType", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="PERCENTAGE DISCOUNT">PERCENTAGE DISCOUNT</option>
                <option value="FIXED DISCOUNT">FIXED DISCOUNT</option>
                <option value="FIXED PRODUCT DISCOUNT">
                  FIXED PRODUCT DISCOUNT
                </option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Coupon Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coupon Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="Enter coupon amount"
              value={formData.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>

          {/* Email Restrictions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Restrictions
            </label>
            <input
              type="text"
              placeholder="Enter email addresses"
              value={formData.emailRestrictions}
              onChange={(e) =>
                handleInputChange("emailRestrictions", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Usage Limit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usage Limit
            </label>
            <input
              type="number"
              placeholder="Usage Limit"
              value={formData.usageLimit}
              onChange={(e) => handleInputChange("usageLimit", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Usage Limit Per User */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usage Limit Per User
            </label>
            <input
              type="number"
              placeholder="Usage Limit Per User"
              value={formData.usageLimitPerUser}
              onChange={(e) =>
                handleInputChange("usageLimitPerUser", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Expire Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expire Date
            </label>
            <div className="bg-red-600 p-4 rounded-md">
              <div className="relative">
                <input
                  type="date"
                  value={formData.expireDate}
                  onChange={(e) =>
                    handleInputChange("expireDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                />
              </div>
            </div>
          </div>

          {/* Exclude Sale Items */}
          <div>
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="excludeSaleItems"
                checked={formData.excludeSaleItems}
                onChange={(e) =>
                  handleInputChange("excludeSaleItems", e.target.checked)
                }
                className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <div>
                <label
                  htmlFor="excludeSaleItems"
                  className="block text-sm font-medium text-gray-700"
                >
                  Exclude Sale Items
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  Check this box if the coupon should not apply to items on
                  sale. Per-item coupons will only work if the item is not on
                  sale. Per-cart coupons will only work if there are no sale
                  items in the cart.
                </p>
              </div>
            </div>
          </div>

          {/* Minimum Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                ₹
              </span>
              <input
                type="number"
                placeholder="Enter minimum coupon amount"
                value={formData.minimumAmount}
                onChange={(e) =>
                  handleInputChange("minimumAmount", e.target.value)
                }
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Product */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products"
                value={formData.product}
                onChange={(e) => handleInputChange("product", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10"
              />
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Exclude Products */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exclude Products
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products"
                value={formData.excludeProducts}
                onChange={(e) =>
                  handleInputChange("excludeProducts", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10"
              />
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search categories"
                value={formData.categories}
                onChange={(e) =>
                  handleInputChange("categories", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10"
              />
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
            >
              Create Coupon
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
