/* =========================
   Returns Types
========================= */

export interface ReturnProduct {
  name: string;
  quantity: number;
  image: string;
}

export interface ReturnRequest {
  id: string;
  customerName: string;
  orderNumber: string;
  products: ReturnProduct[];
  type: "refund" | "exchange" | "return";
  status: "pending" | "approved" | "rejected" | "processing";
  reason: string;
  lastUpdated: string;
  createdAt: string;
  totalAmount: number;
}

export interface FilterTab {
  key: "all" | "pending" | "approved" | "rejected";
  label: string;
}

export interface FilterTabsProps {
  activeFilter: "all" | "pending" | "approved" | "rejected";
  onFilterChange: (filter: "all" | "pending" | "approved" | "rejected") => void;
  tabs: FilterTab[];
}

export interface ReturnsTableProps {
  requests: ReturnRequest[];
  onViewDetails: (request: ReturnRequest) => void;
  onApprove: (request: ReturnRequest) => void;
  onReject: (request: ReturnRequest) => void;
  getStatusVariant: (status: ReturnRequest["status"]) => string;
  getStatusIcon: (status: ReturnRequest["status"]) => React.ReactNode;
  getTypeLabel: (type: ReturnRequest["type"]) => string;
  getTypeVariant: (type: ReturnRequest["type"]) => string;
  formatDate: (dateString: string) => string;
}

export interface EmptyStateProps {
  message: string;
}
