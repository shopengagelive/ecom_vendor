import React from "react";
import Card from "../ui/Card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SalesChartProps {
  data: Array<{ month: string; sales: number }>;
}

export default function SalesChart({ data }: SalesChartProps) {
  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
        <p className="text-sm text-gray-600">Monthly sales performance</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="text-gray-200" />
            <XAxis dataKey="month" className="text-gray-500 text-xs" />
            <YAxis className="text-gray-500 text-xs" />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                background: "white",
                border: "1px solid #e5e7eb",
                color: "#1e293b",
              }}
              labelStyle={{ color: "#64748b", fontWeight: 500 }}
              formatter={(value: number) => [
                `₹${value.toLocaleString()}`,
                "Sales",
              ]}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#2563eb"
              fillOpacity={1}
              fill="url(#colorSales)"
              strokeWidth={3}
              dot={{ r: 4, stroke: "#2563eb", strokeWidth: 2, fill: "white" }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
