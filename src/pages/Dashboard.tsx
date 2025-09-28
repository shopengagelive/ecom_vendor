import DashboardCards from '../components/dashboard/DashboardCards';
import RecentOrders from '../components/dashboard/RecentOrders';
import SalesChart from '../components/dashboard/SalesChart';
import OrderModal from '../components/orders/OrderModal';
import { useModal } from '../hooks/useModal';
import { mockDashboardStats, mockOrders, salesChartData } from '../data/mockData';
import { Order } from '../types';
import { useState } from 'react';

export default function Dashboard() {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    openModal();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's an overview of your store performance.</p>
      </div>

      <DashboardCards stats={mockDashboardStats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrders orders={mockOrders} onViewOrder={handleViewOrder} />
        </div>
        <div>
          <SalesChart data={salesChartData} />
        </div>
      </div>

      <OrderModal
        isOpen={isOpen}
        onClose={closeModal}
        order={selectedOrder}
      />
    </div>
  );
}