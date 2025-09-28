import React from 'react';
import EarningsOverview from '../components/payments/EarningsOverview';
import PayoutHistory from '../components/payments/PayoutHistory';
import { mockPayouts } from '../data/mockData';

export default function Payments() {
  const totalEarnings = 15240.75;
  const pendingPayouts = 2100.00;

  const handleRequestPayout = () => {
    alert('Payout request submitted successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payments & Earnings</h1>
        <p className="text-gray-600">Manage your earnings and payout requests.</p>
      </div>

      <EarningsOverview
        totalEarnings={totalEarnings}
        pendingPayouts={pendingPayouts}
        onRequestPayout={handleRequestPayout}
      />

      <PayoutHistory payouts={mockPayouts} />
    </div>
  );
}