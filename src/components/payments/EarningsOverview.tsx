import React from "react";
import { DollarSign, TrendingUp, CreditCard } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";

interface EarningsOverviewProps {
  totalEarnings: number;
  pendingPayouts: number;
  onRequestPayout: () => void;
}

export default function EarningsOverview({
  totalEarnings,
  pendingPayouts,
  onRequestPayout,
}: EarningsOverviewProps) {
  const availableBalance = totalEarnings - pendingPayouts;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="hover:shadow-md transition-shadow">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Earnings</p>
            <p className="text-2xl font-semibold text-gray-900">
              ₹{totalEarnings.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">
              Available Balance
            </p>
            <p className="text-2xl font-semibold text-gray-900">
              ₹{availableBalance.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Pending Payouts
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                ₹{pendingPayouts.toLocaleString()}
              </p>
            </div>
          </div>
          <Button size="sm" onClick={onRequestPayout}>
            Request Payout
          </Button>
        </div>
      </Card>
    </div>
  );
}
