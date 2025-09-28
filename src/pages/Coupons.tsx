import React, { useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { Table, TableRow, TableCell } from "../components/ui/Table";
import { Plus, Calendar, Tag, DollarSign } from "lucide-react";
import CouponModal from "../components/coupons/CouponModal";

interface Coupon {
  id: string;
  code: string;
  amount: number;
  discountType: "fixed" | "percentage" | "fixed_product";
  usage: {
    used: number;
    limit: number;
  };
  expiryDate: string;
  status: "active" | "expired" | "disabled";
}

const mockCoupons: Coupon[] = [
  {
    id: "1",
    code: "combo100",
    amount: 50.0,
    discountType: "fixed_product",
    usage: {
      used: 0,
      limit: 50,
    },
    expiryDate: "2025-03-20",
    status: "active",
  },
  {
    id: "2",
    code: "SAVE20",
    amount: 20,
    discountType: "percentage",
    usage: {
      used: 15,
      limit: 100,
    },
    expiryDate: "2025-02-15",
    status: "active",
  },
  {
    id: "3",
    code: "WELCOME50",
    amount: 100.0,
    discountType: "fixed",
    usage: {
      used: 25,
      limit: 200,
    },
    expiryDate: "2025-01-30",
    status: "active",
  },
  {
    id: "4",
    code: "FLASH25",
    amount: 25,
    discountType: "percentage",
    usage: {
      used: 50,
      limit: 50,
    },
    expiryDate: "2024-12-31",
    status: "expired",
  },
];

export default function Coupons() {
  const [activeTab, setActiveTab] = useState<"my" | "marketplace">("my");
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getDiscountTypeLabel = (type: Coupon["discountType"]) => {
    switch (type) {
      case "fixed":
        return "Fixed discount";
      case "percentage":
        return "Percentage discount";
      case "fixed_product":
        return "Fixed product discount";
      default:
        return type;
    }
  };

  const getDiscountTypeVariant = (type: Coupon["discountType"]) => {
    switch (type) {
      case "fixed":
        return "success";
      case "percentage":
        return "info";
      case "fixed_product":
        return "warning";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // DD/MM/YYYY format
  };

  const handleEditCoupon = (coupon: Coupon) => {
    console.log("Edit coupon:", coupon);
    // TODO: Implement edit functionality
  };

  const handleDeleteCoupon = (coupon: Coupon) => {
    if (confirm(`Are you sure you want to delete coupon "${coupon.code}"?`)) {
      setCoupons(coupons.filter((c) => c.id !== coupon.id));
    }
  };

  const handleAddNewCoupon = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleCouponSubmit = (couponData: {
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
  }) => {
    console.log("New coupon data:", couponData);
    // TODO: Implement API call to create coupon
    // For now, add to local state
    const newCoupon: Coupon = {
      id: Date.now().toString(),
      code: couponData.title.toUpperCase().replace(/\s+/g, ""),
      amount: parseFloat(couponData.amount),
      discountType:
        couponData.discountType === "PERCENTAGE DISCOUNT"
          ? "percentage"
          : couponData.discountType === "FIXED DISCOUNT"
          ? "fixed"
          : "fixed_product",
      usage: {
        used: 0,
        limit: parseInt(couponData.usageLimit) || 0,
      },
      expiryDate: couponData.expireDate,
      status: "active",
    };
    setCoupons([newCoupon, ...coupons]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Coupons</h1>
          <p className="text-gray-600">
            Manage discount coupons and promotional codes.
          </p>
        </div>
        <Button
          onClick={handleAddNewCoupon}
          icon={Plus}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Add New Coupon
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("my")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "my"
                ? "border-red-500 text-red-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            My Coupons
          </button>
          <button
            onClick={() => setActiveTab("marketplace")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "marketplace"
                ? "border-red-500 text-red-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Marketplace Coupons
          </button>
        </nav>
      </div>

      {/* Coupons Table */}
      <Card>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {activeTab === "my" ? "My Coupons" : "Marketplace Coupons"}
          </h3>
          <p className="text-sm text-gray-600">
            {activeTab === "my"
              ? "Manage your store's promotional coupons and discount codes."
              : "Browse and use marketplace-wide promotional offers."}
          </p>
        </div>

        {coupons.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Tag className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No coupons found
            </h3>
            <p className="text-gray-500">
              {activeTab === "my"
                ? "You haven't created any coupons yet."
                : "No marketplace coupons available at the moment."}
            </p>
          </div>
        ) : (
          <Table
            headers={[
              "COUPON CODE",
              "AMOUNT",
              "DISCOUNT TYPE",
              "USAGE",
              "EXPIRY DATE",
              "ACTIONS",
            ]}
          >
            {coupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell>
                  <span className="font-mono text-red-600 font-semibold">
                    {coupon.code}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="font-semibold">
                      {coupon.discountType === "percentage"
                        ? `${coupon.amount}%`
                        : `₹${coupon.amount.toFixed(2)}`}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getDiscountTypeVariant(coupon.discountType)}>
                    {getDiscountTypeLabel(coupon.discountType)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="font-medium">
                      {coupon.usage.used}/{coupon.usage.limit}
                    </span>
                    {coupon.usage.used === coupon.usage.limit && (
                      <Badge variant="danger" className="ml-2 text-xs">
                        Full
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="font-mono text-sm">
                      {formatDate(coupon.expiryDate)}
                    </span>
                    {new Date(coupon.expiryDate) < new Date() && (
                      <Badge variant="danger" className="ml-2 text-xs">
                        Expired
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditCoupon(coupon)}
                      className="text-red-600 hover:text-red-700 font-medium text-sm"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => handleDeleteCoupon(coupon)}
                      className="text-red-600 hover:text-red-700 font-medium text-sm"
                    >
                      DELETE
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        )}
      </Card>

      {/* Coupon Modal */}
      <CouponModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleCouponSubmit}
      />
    </div>
  );
}
