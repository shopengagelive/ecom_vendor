import React from "react";
import { Eye } from "lucide-react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { Table, TableRow, TableCell } from "../ui/Table";
import { Order } from "../../types";

interface RecentOrdersProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
}

export default function RecentOrders({
  orders,
  onViewOrder,
}: RecentOrdersProps) {
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
      default:
        return "default";
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </div>

      <Table
        headers={["Order ID", "Customer", "Status", "Date", "Total", "Actions"]}
      >
        {orders.slice(0, 5).map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.id}</TableCell>
            <TableCell>
              <div>
                <div className="font-medium">{order.customerName}</div>
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
            <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
            <TableCell className="font-medium">
              ₹{order.total.toFixed(2)}
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="sm"
                icon={Eye}
                onClick={() => onViewOrder(order)}
              >
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </Card>
  );
}
