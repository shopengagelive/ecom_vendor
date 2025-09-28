import React, { useState } from "react";

export default function ShipmentsPanel() {
  type Item = {
    id: string;
    name: string;
    img: string;
    qty: number;
    checked: boolean;
  };

  const [openForm, setOpenForm] = useState(false);
  const [notify, setNotify] = useState(true);
  const [provider, setProvider] = useState("Other");
  const [status, setStatus] = useState("");
  const [items, setItems] = useState<Item[]>([
    {
      id: "A104",
      name: "Siroski Saree A104",
      img: "https://picsum.photos/seed/saree/80/112",
      qty: 1,
      checked: false,
    },
    {
      id: "B210",
      name: "Kashvi Kurti B210",
      img: "https://picsum.photos/seed/kurti/80/112",
      qty: 1,
      checked: false,
    },
    {
      id: "C315",
      name: "Anvi Lehenga C315",
      img: "https://picsum.photos/seed/lehenga/80/112",
      qty: 1,
      checked: false,
    },
  ]);

  const [formData, setFormData] = useState({
    providerName: "",
    trackingUrl: "",
    trackingNumber: "",
  });

  const allSelected = items.length > 0 && items.every((i) => i.checked);
  const selectedCount = items.filter((i) => i.checked).length;

  const toggleItem = (id: string) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i))
    );
  const toggleAll = () =>
    setItems((prev) => prev.map((i) => ({ ...i, checked: !allSelected })));

  const handleProviderChange = (value: string) => {
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
    <div className="w-full">
      <div className="border rounded-md overflow-hidden bg-white">
        <div className="border-b bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 flex items-center justify-between">
          <span>Shipments</span>
          {openForm && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <label className="inline-flex items-center gap-2 select-none">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Select all ({selectedCount}/{items.length})
              </label>
            </div>
          )}
        </div>

        {!openForm ? (
          <div className="p-6 flex flex-col items-center justify-center gap-4">
            <p className="text-gray-500 text-sm">No shipment found</p>
            <button
              type="button"
              onClick={() => setOpenForm(true)}
              className="inline-flex items-center justify-center rounded-md bg-red-600 px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Create New Shipment
            </button>
          </div>
        ) : (
          <div className="p-4">
            <div className="pb-3 mb-3 border-b space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleItem(item.id)}
                    className="mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-10 bg-gray-100 border rounded-sm overflow-hidden flex items-center justify-center">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="h-14 w-10 object-cover"
                      />
                    </div>
                    <div className="text-sm text-gray-800">
                      <div>{item.name}</div>
                      <div className="text-gray-500">Qty: {item.qty}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping Status */}
            <div className="mb-5">
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
                    onChange={(e) => handleProviderChange(e.target.value)}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Other</option>
                    <option>UPS</option>
                    <option>FedEx</option>
                    <option>USPS</option>
                    <option>DHL</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-sm text-gray-700">
                    Date Shipped
                  </label>
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        trackingNumber: e.target.value,
                      })
                    }
                    readOnly={provider !== "Other"}
                    className={`rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      provider !== "Other"
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col">
                  <label className="mb-1 text-sm text-gray-700">
                    Provider Name
                  </label>
                  <input
                    type="text"
                    value={formData.providerName}
                    onChange={(e) =>
                      setFormData({ ...formData, providerName: e.target.value })
                    }
                    readOnly={provider !== "Other"}
                    className={`rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      provider !== "Other"
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                  />
                </div>
                <div className="flex flex-col sm:col-span-2">
                  <label className="mb-1 text-sm text-gray-700">
                    Tracking URL
                  </label>
                  <input
                    type="url"
                    value={formData.trackingUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, trackingUrl: e.target.value })
                    }
                    readOnly={provider !== "Other"}
                    className={`rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      provider !== "Other"
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
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
                  disabled={selectedCount === 0}
                  className={`rounded-md px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 ${
                    selectedCount === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gray-900 hover:bg-black focus:ring-gray-500"
                  }`}
                >
                  Create Shipment ({selectedCount} selected)
                </button>
                <button
                  type="button"
                  onClick={() => setOpenForm(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
