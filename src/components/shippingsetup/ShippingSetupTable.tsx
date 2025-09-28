import { Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { ShippingSetupTableProps } from "./types";

export default function ShippingSetupTable({
  couriers,
  onEdit,
  onDelete,
  onToggleStatus,
}: ShippingSetupTableProps) {
  const getStatusVariant = (isActive: boolean) => {
    return isActive ? "success" : "default";
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? "Active" : "Inactive";
  };


  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Courier Company
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tracking URL
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tracking ID Prefix
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {couriers.map((courier) => (
            <tr key={courier.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {courier.providerName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  <a
                    href={courier.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {courier.trackingUrl}
                  </a>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 font-mono">
                  {courier.prefix || "null"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={getStatusVariant(courier.isActive)}>
                  {getStatusText(courier.isActive)}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(courier.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={courier.isActive ? ToggleRight : ToggleLeft}
                    onClick={() => onToggleStatus(courier.id)}
                    className={
                      courier.isActive ? "text-green-600" : "text-gray-400"
                    }
                  >
                    {""}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Edit}
                    onClick={() => onEdit(courier)}
                  >
                    {""}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    onClick={() => onDelete(courier)}
                    className="text-red-600 hover:text-red-700"
                  >
                    {""}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {couriers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">
            No courier companies found
          </div>
          <div className="text-gray-400 text-sm">
            Add your first courier company to get started
          </div>
        </div>
      )}
    </div>
  );
}
