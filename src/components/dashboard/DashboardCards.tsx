import React from "react";
import { DollarSign, ShoppingBag, Package, TrendingUp } from "lucide-react";
import Card from "../ui/Card";
import { DashboardStats } from "../../types";

interface DashboardCardsProps {
  stats: DashboardStats;
}

export default function DashboardCards({ stats }: DashboardCardsProps) {
  const cards = [
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+12.5%",
    },
    {
      title: "Total Sales",
      value: `₹${stats.totalSales.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "+8.2%",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: "+23.1%",
    },
    {
      title: "Total Products",
      value: stats.totalProducts.toString(),
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      change: "+5.4%",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${card.bgColor}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <div className="flex items-center">
                <p className="text-2xl font-semibold text-gray-900">
                  {card.value}
                </p>
                <span className="ml-2 text-xs font-medium text-green-600">
                  {card.change}
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
