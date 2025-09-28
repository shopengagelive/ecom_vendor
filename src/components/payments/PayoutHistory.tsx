import React from "react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import { Table, TableRow, TableCell } from "../ui/Table";
import { PayoutRecord } from "../../types";

interface PayoutHistoryProps {
  payouts: PayoutRecord[];
}

export default function PayoutHistory({ payouts }: PayoutHistoryProps) {
  const getStatusVariant = (status: PayoutRecord["status"]) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Pending":
        return "warning";
      case "Failed":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Payout History</h3>
        <p className="text-sm text-gray-600">
          Track your payout requests and their status
        </p>
      </div>

      <Table headers={["Payout ID", "Date", "Amount", "Method", "Status"]}>
        {payouts.map((payout) => (
          <TableRow key={payout.id}>
            <TableCell className="font-medium">{payout.id}</TableCell>
            <TableCell>{new Date(payout.date).toLocaleDateString()}</TableCell>
            <TableCell className="font-medium">
              ₹{payout.amount.toFixed(2)}
            </TableCell>
            <TableCell>{payout.method}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(payout.status)}>
                {payout.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </Card>
  );
}
