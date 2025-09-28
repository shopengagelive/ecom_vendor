import React from "react";
import Card from "../components/ui/Card";

export default function Logistics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Logistics</h1>
        <p className="text-gray-600">
          Manage shipping, delivery, and logistics operations.
        </p>
      </div>

      <Card>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Shipping & Delivery
          </h3>
          <p className="text-sm text-gray-600">
            Configure shipping methods, delivery zones, and logistics settings.
          </p>
        </div>

        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Coming Soon
          </h3>
          <p className="text-gray-500">
            Logistics management will be available soon.
          </p>
        </div>
      </Card>
    </div>
  );
}
