import { useState } from "react";
import { ChevronDown, Truck } from "lucide-react";

// Collapsible shipment row used inside the Order modal's Shipments section
// Tailwind-only, TypeScript-ready. Mirrors the Create Shipment form for updates.

export type Shipment = {
  id: string | number;
  status: string;
  date: string | number | Date;
  trackingNumber?: string;
};

const providerOptions = ["Other", "UPS", "FedEx", "USPS", "DHL"] as const;

type Provider = (typeof providerOptions)[number];

function UpdateShipmentForm() {
  const [status, setStatus] = useState("");
  const [provider, setProvider] = useState<Provider>("Other");
  const [notify, setNotify] = useState(true);
  const [formData, setFormData] = useState({
    providerName: "",
    trackingUrl: "",
    trackingNumber: "",
  });

  const handleProviderChange = (value: Provider) => {
    setProvider(value);
    if (value !== "Other") {
      setFormData({
        providerName: value,
        trackingUrl: `https://tracking.${value.toLowerCase()}.com`,
        trackingNumber: "AUTO123456",
      });
    } else {
      setFormData({ providerName: "", trackingUrl: "", trackingNumber: "" });
    }
  };

  return (
    <div className="mt-4 space-y-4">
      {/* Shipping Status */}
      <div>
        <label className="block text-sm text-gray-700 mb-1">
          Shipping Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-60 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select</option>
          <option>Delivered</option>
          <option>Cancelled</option>
          <option>Processing</option>
          <option>Ready for pickup</option>
          <option>Pickedup</option>
          <option>On the way</option>
        </select>
      </div>

      {/* Tracking Information */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-900">
          Tracking Information
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-700">
              Shipping Provider
            </label>
            <select
              value={provider}
              onChange={(e) => handleProviderChange(e.target.value as Provider)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {providerOptions.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-700">Date Shipped</label>
            <input
              type="date"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-700">
              Tracking Number
            </label>
            <input
              type="text"
              value={formData.trackingNumber}
              readOnly={provider !== "Other"}
              onChange={(e) =>
                setFormData({ ...formData, trackingNumber: e.target.value })
              }
              className={`rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                provider !== "Other" ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-700">Provider Name</label>
            <input
              type="text"
              value={formData.providerName}
              readOnly={provider !== "Other"}
              onChange={(e) =>
                setFormData({ ...formData, providerName: e.target.value })
              }
              className={`rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                provider !== "Other" ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>
          <div className="flex flex-col sm:col-span-2">
            <label className="mb-1 text-sm text-gray-700">Tracking URL</label>
            <input
              type="url"
              value={formData.trackingUrl}
              readOnly={provider !== "Other"}
              onChange={(e) =>
                setFormData({ ...formData, trackingUrl: e.target.value })
              }
              className={`rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                provider !== "Other" ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>
        </div>

        {/* <div className="flex flex-col">
          <label className="mb-1 text-sm text-gray-700">Comments</label>
          <textarea
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div> */}

        <label className="inline-flex items-center gap-2 text-sm text-gray-700 select-none">
          <input
            type="checkbox"
            checked={notify}
            onChange={(e) => setNotify(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Notify shipment details to customer
        </label>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Update Shipment
          </button>
          <button
            type="button"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export function CollapsibleShipmentRow({ shipment }: { shipment: Shipment }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="h-7 w-7 inline-flex items-center justify-center rounded-full border border-purple-200 bg-white hover:bg-purple-50 transition"
            aria-label={open ? "Collapse" : "Expand"}
          >
            <ChevronDown
              className={`h-4 w-4 text-purple-700 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>
          <div>
            <p className="font-medium">Shipment #{shipment.id}</p>
            {shipment.trackingNumber && (
              <p className="text-sm text-gray-600">
                Tracking: {shipment.trackingNumber}
              </p>
            )}
            <p className="text-sm text-gray-600">
              Date: {new Date(shipment.date).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-700">
            {shipment.status}
          </span>
        </div>
      </div>

      {open && (
        <div className="mt-4 pt-4 border-t border-purple-200">
          <UpdateShipmentForm />
        </div>
      )}
    </div>
  );
}

// EXAMPLE USAGE inside OrderModal Shipments section:
// {order.shipments.map((shipment) => (
//   <CollapsibleShipmentRow key={shipment.id} shipment={shipment} />
// ))}
