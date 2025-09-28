import { useState } from "react";
import {
  FilterTabs,
  ReturnsTable,
  EmptyState,
  ReturnRequest,
  FilterTab,
} from "../components/returns";
import { RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react";

const mockReturnRequests: ReturnRequest[] = [
  {
    id: "RET001",
    customerName: "John Doe",
    orderNumber: "ORD-2024-001",
    products: [
      {
        name: "Wireless Bluetooth Headphones",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop&crop=center",
      },
    ],
    type: "refund",
    status: "pending",
    reason: "Product not as described",
    lastUpdated: "2024-01-15T10:30:00",
    createdAt: "2024-01-14T15:20:00",
    totalAmount: 129.99,
  },
  {
    id: "RET002",
    customerName: "Sarah Wilson",
    orderNumber: "ORD-2024-002",
    products: [
      {
        name: "Smart Fitness Watch",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop&crop=center",
      },
      {
        name: "Wireless Charger",
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1609592806596-b43bada2f4ce?w=80&h=80&fit=crop&crop=center",
      },
    ],
    type: "exchange",
    status: "approved",
    reason: "Wrong size received",
    lastUpdated: "2024-01-16T14:15:00",
    createdAt: "2024-01-15T09:45:00",
    totalAmount: 299.98,
  },
  {
    id: "RET003",
    customerName: "Mike Johnson",
    orderNumber: "ORD-2024-003",
    products: [
      {
        name: "Gaming Mouse",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=80&h=80&fit=crop&crop=center",
      },
    ],
    type: "return",
    status: "rejected",
    reason: "Changed mind",
    lastUpdated: "2024-01-17T11:20:00",
    createdAt: "2024-01-16T16:30:00",
    totalAmount: 89.99,
  },
  {
    id: "RET004",
    customerName: "Emily Brown",
    orderNumber: "ORD-2024-004",
    products: [
      {
        name: "Laptop Stand",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=80&h=80&fit=crop&crop=center",
      },
      {
        name: "USB-C Cable",
        quantity: 3,
        image:
          "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=80&h=80&fit=crop&crop=center",
      },
    ],
    type: "refund",
    status: "processing",
    reason: "Defective product",
    lastUpdated: "2024-01-18T08:45:00",
    createdAt: "2024-01-17T12:10:00",
    totalAmount: 67.97,
  },
  {
    id: "RET005",
    customerName: "David Lee",
    orderNumber: "ORD-2024-005",
    products: [
      {
        name: "Wireless Keyboard",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=80&h=80&fit=crop&crop=center",
      },
    ],
    type: "exchange",
    status: "pending",
    reason: "Color preference",
    lastUpdated: "2024-01-19T13:25:00",
    createdAt: "2024-01-18T10:15:00",
    totalAmount: 149.99,
  },
];

export default function Returns() {
  const [activeFilter, setActiveFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  const getStatusVariant = (status: ReturnRequest["status"]) => {
    switch (status) {
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "rejected":
        return "danger";
      case "processing":
        return "info";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: ReturnRequest["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "processing":
        return <RefreshCw className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: ReturnRequest["type"]) => {
    switch (type) {
      case "refund":
        return "Refund";
      case "exchange":
        return "Exchange";
      case "return":
        return "Return";
      default:
        return type;
    }
  };

  const getTypeVariant = (type: ReturnRequest["type"]) => {
    switch (type) {
      case "refund":
        return "danger";
      case "exchange":
        return "warning";
      case "return":
        return "info";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredRequests =
    activeFilter === "all"
      ? mockReturnRequests
      : mockReturnRequests.filter((request) => request.status === activeFilter);

  const tabs: FilterTab[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  const handleViewDetails = (request: ReturnRequest) => {
    console.log("View details for:", request.id);
    // TODO: Implement view details functionality
  };

  const handleApprove = (request: ReturnRequest) => {
    console.log("Approve request:", request.id);
    // TODO: Implement approve functionality
  };

  const handleReject = (request: ReturnRequest) => {
    console.log("Reject request:", request.id);
    // TODO: Implement reject functionality
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Return Requests</h1>
        <p className="text-gray-600">
          Manage customer return requests and refunds.
        </p>
      </div>

      <FilterTabs
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        tabs={tabs}
      />

      {filteredRequests.length === 0 ? (
        <EmptyState message="No return requests found for the selected filter." />
      ) : (
        <ReturnsTable
          requests={filteredRequests}
          onViewDetails={handleViewDetails}
          onApprove={handleApprove}
          onReject={handleReject}
          getStatusVariant={getStatusVariant}
          getStatusIcon={getStatusIcon}
          getTypeLabel={getTypeLabel}
          getTypeVariant={getTypeVariant}
          formatDate={formatDate}
        />
      )}
    </div>
  );
}
