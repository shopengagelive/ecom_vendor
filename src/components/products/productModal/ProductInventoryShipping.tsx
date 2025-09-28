 

interface ProductInventoryShippingProps {
  formData: any;
  onFormChange: (updates: any) => void;
  warehouses?: Array<{
    id: string;
    name: string;
    address: string;
    postCode: string;
    city: string;
    state: string;
  }>;
}

export default function ProductInventoryShipping({
  formData,
  onFormChange,
  warehouses = [],
}: ProductInventoryShippingProps) {
  const handleInputChange = (field: string, value: any) => {
    onFormChange({ [field]: value });
  };

  const handleDimensionChange = (field: string, value: string) => {
    onFormChange({
      dimensions: {
        ...formData.dimensions,
        [field]: value,
      },
    });
  };

  return (
    <div className="grid md:grid-cols-[35%_63%] grid-cols-1 w-full gap-6">
      {/* Stock & Inventory */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Inventory & Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.stock}
              onChange={(e) => handleInputChange("stock", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Status
            </label>
            <select
              value={formData.stockStatus || ""}
              onChange={(e) => handleInputChange("stockStatus", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select status</option>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
              <option value="pre-order">Pre Order</option>
            </select>
          </div>
        </div>
        <div className="w-full mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Status
          </label>
          <select
            value={formData.productStatus || ""}
            onChange={(e) => handleInputChange("productStatus", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>
      </div>

      {/* Shipping & Dimensions */}
      <div className="bg-white rounded-lg shadow-sm border p-6 w-full">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Shipping Information
        </h2>
        <div className="grid grid-cols-2 gap-4 w-full">
          {/* Row 1 - Col 1: Weight + Shipping Method */}
          
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shipping Method *
              </label>
              <select
                value={formData.shipping}
                onChange={(e) => handleInputChange("shipping", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              >
                <option value="">Select shipping</option>
                <option value="free">Free Shipping</option>
                <option value="flat">Flat Rate</option>
                <option value="express">Express</option>
              </select>
            </div>
          {/* Row 1 - Col 2: Warehouse */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Warehouse
            </label>
            <select
              value={formData.warehouseId || ""}
              onChange={(e) => handleInputChange("warehouseId", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            >
              <option value="">Select warehouse</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} — {w.city}, {w.state}
                </option>
              ))}
            </select>
          </div>

          {/* Row 2 - Col 1: Dimensions */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Length (cm)
                </label>
                <input
                  type="text"
                  value={formData.dimensions.length}
                  onChange={(e) => handleDimensionChange("length", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width (cm)
                </label>
                <input
                  type="text"
                  value={formData.dimensions.width}
                  onChange={(e) => handleDimensionChange("width", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (cm)
                </label>
                <input
                  type="text"
                  value={formData.dimensions.height}
                  onChange={(e) => handleDimensionChange("height", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Row 2 - Col 2: RMA */}
          <div className="flex gap-4">
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              RMA Option *
            </label>
            <select
              value={formData.rmaOption || ""}
              onChange={(e) => handleInputChange("rmaOption", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            >
              <option value="">Select RMA Option</option>
              <option value="return">Return</option>
              <option value="replace">Replace</option>
              <option value="none">None</option>
            </select>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}