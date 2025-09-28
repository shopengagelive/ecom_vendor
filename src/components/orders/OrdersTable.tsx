import { useMemo, useState } from "react";
import { Search, Eye, Calendar, FileText, Package, Truck } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { Table, TableRow, TableCell } from "../ui/Table";
import { Order } from "../../types";

type OrderStatus = Order["status"] | "all";

interface OrdersTableProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  onBulkAction?: (action: string, orderIds: string[]) => void;
}

export default function OrdersTable({
  orders,
  onViewOrder,
  onBulkAction,
}: OrdersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [activeStatus, setActiveStatus] = useState<OrderStatus>("all");
  const [bulkAction, setBulkAction] = useState("");

  // 1) Base filter = search + date only (used for counts)
  const baseFiltered = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
      const orderDate = new Date(order.date);
      const matchesStart = !startDate || orderDate >= new Date(startDate);
      const matchesEnd = !endDate || orderDate <= new Date(endDate);
      return matchesSearch && matchesStart && matchesEnd;
    });
  }, [orders, searchTerm, startDate, endDate]);
  console.log(orders);
  // 2) Table rows = base filter + status tab
  const displayedOrders = useMemo(() => {
    return baseFiltered.filter(
      (o) => activeStatus === "all" || o.status === activeStatus
    );
  }, [baseFiltered, activeStatus]);

  const countByStatus = (s: Exclude<OrderStatus, "all">) =>
    baseFiltered.filter((o) => o.status === s).length;

  const totals = {
    total: baseFiltered.length,
    Pending: countByStatus("Pending"),
    Processing: countByStatus("Processing"),
    Shipped: countByStatus("Shipped"),
    Delivered: countByStatus("Delivered"),
    Cancelled: countByStatus("Cancelled"),
    Failed: countByStatus("Failed"),
    Refund: countByStatus("Refund"),
  };

  // Select-all reflects *currently displayed* rows
  const allCurrentlySelected =
    displayedOrders.length > 0 &&
    displayedOrders.every((o) => selectedOrders.includes(o.id));

  const toggleSelectAll = () => {
    if (allCurrentlySelected) {
      setSelectedOrders((prev) =>
        prev.filter((id) => !displayedOrders.some((o) => o.id === id))
      );
    } else {
      setSelectedOrders((prev) => [
        ...new Set([...prev, ...displayedOrders.map((o) => o.id)]),
      ]);
    }
  };

  const toggleRow = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const applyBulkAction = (action: string) => {
    if (!action) return;
    if (onBulkAction && selectedOrders.length > 0) {
      onBulkAction(action, selectedOrders);
    }
    setBulkAction(""); // reset the select
  };

  const getStatusVariant = (status: Order["status"]) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "Shipped":
        return "info";
      case "Processing":
      case "Refund":
        return "warning";
      case "Pending":
        return "default";
      case "Cancelled":
      case "Failed":
        return "danger";
      default:
        return "default";
    }
  };

  // Small helper for the clickable stat “tabs”
  const StatCard = ({
    label,
    value,
    active,
    onClick,
    className = "",
  }: {
    label: string;
    value: number | string;
    active?: boolean;
    onClick?: () => void;
    className?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={[
        "min-w-[120px] px-4 py-3 rounded-xl border text-left transition",
        "hover:shadow-sm",
        active ? "ring-2 ring-blue-500 bg-white" : "",
        className,
      ].join(" ")}
    >
      <div className="text-xs text-gray-600">{label}</div>
      <div className="text-xl font-bold text-gray-900">{value}</div>
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Clickable status tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
        <div className="flex flex-wrap items-stretch gap-3 justify-end">
          <StatCard
            label="Total Orders"
            value={totals.total}
            active={activeStatus === "all"}
            onClick={() => setActiveStatus("all")}
            className="border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50"
          />
          <StatCard
            label="Pending"
            value={totals.Pending}
            active={activeStatus === "Pending"}
            onClick={() => setActiveStatus("Pending")}
            className="border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100"
          />
          <StatCard
            label="Processing"
            value={totals.Processing}
            active={activeStatus === "Processing"}
            onClick={() => setActiveStatus("Processing")}
            className="border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50"
          />
          <StatCard
            label="Shipped"
            value={totals.Shipped}
            active={activeStatus === "Shipped"}
            onClick={() => setActiveStatus("Shipped")}
            className="border-sky-100 bg-gradient-to-r from-sky-50 to-cyan-50"
          />
          <StatCard
            label="Delivered"
            value={totals.Delivered}
            active={activeStatus === "Delivered"}
            onClick={() => setActiveStatus("Delivered")}
            className="border-emerald-100 bg-gradient-to-r from-green-50 to-emerald-50"
          />
          <StatCard
            label="Cancelled"
            value={totals.Cancelled}
            active={activeStatus === "Cancelled"}
            onClick={() => setActiveStatus("Cancelled")}
            className="border-rose-100 bg-gradient-to-r from-rose-50 to-red-50"
          />
          <StatCard
            label="Failed"
            value={totals.Failed}
            active={activeStatus === "Failed"}
            onClick={() => setActiveStatus("Failed")}
            className="border-red-200 bg-gradient-to-r from-red-50 to-rose-50"
          />
          <StatCard
            label="Refund"
            value={totals.Refund}
            active={activeStatus === "Refund"}
            onClick={() => setActiveStatus("Refund")}
            className="border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50"
          />
        </div>
      </div>

      {/* Filters row (Bulk actions SELECT before search) */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Bulk actions select */}
          <div className="flex items-center gap-2">
            <select
              value={bulkAction}
              onChange={(e) => applyBulkAction(e.target.value)}
              disabled={selectedOrders.length === 0}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            >
              <option value="">Bulk actions</option>
              <option value="invoice">Generate Invoice</option>
              <option value="packing-slip">Packing Slips</option>
              <option value="shipping-label">Shipping Labels</option>
            </select>
            {/* <span className="text-sm text-gray-500">
              {selectedOrders.length > 0
                ? `${selectedOrders.length} selected`
                : "Select orders to enable"}
            </span> */}
          </div>

          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Date range */}
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Start Date"
            />
            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="End Date"
            />
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card padding={false}>
        <Table
          headers={[
            <input
              key="select-all"
              type="checkbox"
              checked={allCurrentlySelected}
              onChange={toggleSelectAll}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />,
            "Order ID",
            "Products",
            "Customer",
            "Status",
            "Date",
            "Total",
            "Shipping Address",
            "Actions",
          ]}
        >
          {displayedOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order.id)}
                  onChange={() => toggleRow(order.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </TableCell>

              <TableCell className="font-medium">
                <button
                  onClick={() => onViewOrder(order)}
                  className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                >
                  {order.id}
                </button>
              </TableCell>
              <TableCell className="font-sm">
                {/* {order.items.map((product) => (
                  <span key={product.productName}>{product.productName}</span>
                ))} */}
                {order.items.length}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium text-gray-900">
                    {order.customerName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.customerEmail}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(order.status)}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(order.date).toLocaleDateString()}
                <br />
                <span>{new Date(order.date).toLocaleTimeString()}</span>
              </TableCell>
              <TableCell className="font-medium">
                ₹{order.total.toFixed(2)}
              </TableCell>
              <TableCell className="font-medium">
                {order.shippingAddress?.address}, {order.shippingAddress?.city}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Eye}
                    onClick={() => onViewOrder(order)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={FileText}
                    onClick={() => applyBulkAction("invoice")}
                    disabled={selectedOrders.length === 0}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Package}
                    onClick={() => applyBulkAction("packing-slip")}
                    disabled={selectedOrders.length === 0}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Truck}
                    onClick={() => applyBulkAction("shipping-label")}
                    disabled={selectedOrders.length === 0}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
}
