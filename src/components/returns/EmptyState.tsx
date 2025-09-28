import React from "react";
import Card from "../ui/Card";
import { Package } from "lucide-react";
import { EmptyStateProps } from "./types";

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <Card>
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Package className="mx-auto h-12 w-12" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No results</h3>
        <p className="text-gray-500">{message}</p>
      </div>
    </Card>
  );
}
