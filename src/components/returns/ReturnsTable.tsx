import React from "react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import { Table, TableRow, TableCell } from "../ui/Table";
import { User, Calendar, ShoppingBag } from "lucide-react";
import { ReturnsTableProps } from "./types";

export default function ReturnsTable({
  requests,
  onViewDetails,
  onApprove,
  onReject,
  getStatusVariant,
  getStatusIcon,
  getTypeLabel,
  getTypeVariant,
  formatDate,
}: ReturnsTableProps) {
  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Return Requests</h3>
        <p className="text-sm text-gray-600">
          Review and process customer return requests.
        </p>
      </div>

      <Table
        headers={[
          "DETAILS",
          "PRODUCTS",
          "TYPE",
          "STATUS",
          "LAST UPDATED",
          "ACTIONS",
        ]}
      >
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{request.customerName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ShoppingBag className="w-4 h-4" />
                  <span>{request.orderNumber}</span>
                </div>
                <div className="text-sm text-gray-500">
                  ₹{request.totalAmount.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600 max-w-xs truncate">
                  {request.reason}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-2">
                {request.products.map((product, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-8 h-8 rounded object-cover"
                    />
                    <div>
                      <div className="text-sm font-medium">{product.name}</div>
                      <div className="text-xs text-gray-500">
                        Qty: {product.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={getTypeVariant(request.type)}>
                {getTypeLabel(request.type)}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {getStatusIcon(request.status)}
                <Badge variant={getStatusVariant(request.status)}>
                  {request.status.charAt(0).toUpperCase() +
                    request.status.slice(1)}
                </Badge>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-mono">
                  {formatDate(request.lastUpdated)}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onViewDetails(request)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  VIEW
                </button>
                {request.status === "pending" && (
                  <>
                    <button
                      onClick={() => onApprove(request)}
                      className="text-green-600 hover:text-green-700 font-medium text-sm"
                    >
                      APPROVE
                    </button>
                    <button
                      onClick={() => onReject(request)}
                      className="text-red-600 hover:text-red-700 font-medium text-sm"
                    >
                      REJECT
                    </button>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </Card>
  );
}
