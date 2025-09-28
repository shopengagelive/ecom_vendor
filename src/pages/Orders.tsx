import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import OrdersTable from "../components/orders/OrdersTable";
import OrderModal from "../components/orders/OrderModal";
import { useModal } from "../hooks/useModal";
import { mockOrders } from "../data/mockData";
import { Order } from "../types";
import Button from "../components/ui/Button";

export default function Orders() {
  const navigate = useNavigate();
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    openModal();
  };

  const handleBulkAction = (action: string, orderIds: string[]) => {
    console.log(`Bulk action: ${action} for orders:`, orderIds);

    switch (action) {
      case "invoice":
        alert(`Generating invoices for ${orderIds.length} orders`);
        break;
      case "packing-slip":
        alert(`Generating packing slips for ${orderIds.length} orders`);
        break;
      case "shipping-label":
        alert(`Generating shipping labels for ${orderIds.length} orders`);
        break;
      default:
        console.log("Unknown action:", action);
    }
  };

  const handleCreateOrder = () => {
    navigate("/create-order");
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Order Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <Button onClick={handleCreateOrder} icon={Plus}>
          Create Order
        </Button>
      </div> 

      <OrdersTable
        orders={mockOrders}
        onViewOrder={handleViewOrder}
        onBulkAction={handleBulkAction}
      />

      <OrderModal isOpen={isOpen} onClose={closeModal} order={selectedOrder} />
    </div>
  );
}
