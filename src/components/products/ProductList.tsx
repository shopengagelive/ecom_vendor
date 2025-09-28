import { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  Calendar,
  Upload,
  Eye,
  Package,
  Loader2,
  EyeOff,
} from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { Table, TableRow, TableCell } from "../ui/Table";
import { Product } from "../../types";
import { toggleProductVisibility, bulkUpdateProductStatus, bulkToggleProductVisibility, bulkDeleteProducts } from "../../services/api";
import { showToast } from "../../utils/toast";
import { useNavigate } from "react-router-dom";
interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ProductListProps {
  products: Product[];
  meta?: Meta | null;
  onDeleteProduct: (productId: string) => void;
  onAddProduct: () => void;
  onViewProduct: (product: Product) => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
  categories: string[];
  onBulkAdd: () => void;
  onBulkAction?: (action: string, productIds: string[]) => void;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onRefresh?: () => void; // Add refresh callback
}

export default function ProductList({
  products,
  meta,
  onDeleteProduct,
  onAddProduct,
  onViewProduct,
  categoryFilter,
  onCategoryFilterChange,
  categories,
  onBulkAdd,
  onBulkAction,
  onPageChange,
  onLimitChange,
  onRefresh,
}: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [visibilityFilter, setVisibilityFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [attributeFilter, setAttributeFilter] = useState<string>("all");
  const [variationFilter, setVariationFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");

  // Number filters
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [stockMin, setStockMin] = useState<string>("");
  const [stockMax, setStockMax] = useState<string>("");
  const [weightMin, setWeightMin] = useState<string>("");
  const [weightMax, setWeightMax] = useState<string>("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  // Loading states for visibility toggles
  const [updatingVisibility, setUpdatingVisibility] = useState<string | null>(null);

  // Loading state for bulk actions
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [currentBulkAction, setCurrentBulkAction] = useState<string | null>(null);
  const [locallyDeletedIds, setLocallyDeletedIds] = useState<Set<string>>(new Set());

  // Local overrides so toggles reflect instantly after API success
  const [localProductState, setLocalProductState] = useState<Record<string, { status: Product["status"]; visibility: Product["visibility"] }>>({});

  const getEffectiveState = (product: Product) => {
    const override = localProductState[product.id];
    return {
      status: override?.status ?? product.status,
      visibility: override?.visibility ?? product.visibility,
    } as { status: Product["status"]; visibility: Product["visibility"] };
  };

  console.log(priceMin, priceMax)

  // Mock attributes for filter
  const filteredProducts = products
    .filter((product) => !locallyDeletedIds.has(product.id))
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || product.status === statusFilter;
      const matchesVisibility =
        visibilityFilter === "all" || product.visibility === visibilityFilter;
      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;

      // Date range filter
      const productDate = new Date(product.createdDate);
      const matchesStartDate = !startDate || productDate >= new Date(startDate);
      const matchesEndDate = !endDate || productDate <= new Date(endDate);

      // Stock filter (presets)
      let matchesStock = true;
      if (stockFilter !== "all") {
        if (stockFilter === "<5") matchesStock = product.stock < 5;
        else if (stockFilter === "<10") matchesStock = product.stock < 10;
        else if (stockFilter === "<50") matchesStock = product.stock < 50;
        else if (stockFilter === "In Stock") matchesStock = product.stock > 10;
        else if (stockFilter === "Low Stock") matchesStock = product.stock <= 10 && product.stock > 0;
        else if (stockFilter === "Out of Stock") matchesStock = product.stock === 0;
      }

      // Price range filter
      const parsedPriceMin = priceMin && !isNaN(parseFloat(priceMin)) ? parseFloat(priceMin) : undefined;
      const parsedPriceMax = priceMax && !isNaN(parseFloat(priceMax)) ? parseFloat(priceMax) : undefined;
      const effectivePrice = product.discountedPrice !== undefined && product.discountedPrice !== null
        ? (typeof product.discountedPrice === 'string' ? parseFloat(product.discountedPrice) : product.discountedPrice)
        : (typeof product.price === 'string' ? parseFloat(product.price) : product.price);
      const matchesPriceMin = parsedPriceMin === undefined || (!isNaN(effectivePrice) && effectivePrice >= parsedPriceMin);
      const matchesPriceMax = parsedPriceMax === undefined || (!isNaN(effectivePrice) && effectivePrice <= parsedPriceMax);

      // Stock range filter
      const matchesStockMin = !stockMin || product.stock >= parseInt(stockMin);
      const matchesStockMax = !stockMax || product.stock <= parseInt(stockMax);

      // Weight range filter
      const matchesWeightMin =
        !weightMin || (product.weight && product.weight >= parseFloat(weightMin));
      const matchesWeightMax =
        !weightMax || (product.weight && product.weight <= parseFloat(weightMax));

      return (
        matchesSearch &&
        matchesStatus &&
        matchesVisibility &&
        matchesCategory &&
        matchesStartDate &&
        matchesEndDate &&
        matchesStock &&
        matchesPriceMin &&
        matchesPriceMax &&
        matchesStockMin &&
        matchesStockMax &&
        matchesWeightMin &&
        matchesWeightMax
      );
    });

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
      setSelectAll(false);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id));
      setSelectAll(true);
    }
  };

  const handleProductSelection = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
      setSelectAll(false);
    } else {
      const newSelected = [...selectedProducts, productId];
      setSelectedProducts(newSelected);
      if (newSelected.length === filteredProducts.length) {
        setSelectAll(true);
      }
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedProducts.length === 0 || !action) return;

    setCurrentBulkAction(action);
    setBulkActionLoading(true);
    try {
      switch (action) {
        case 'delete': {
          console.log('Bulk delete called with product IDs:', selectedProducts);
          // Optimistically remove from UI
          setLocallyDeletedIds(prev => {
            const next = new Set(prev);
            selectedProducts.forEach(id => next.add(id));
            return next;
          });
          if (confirm(`Are you sure you want to delete ${selectedProducts.length} products? This action cannot be undone.`)) {
            await bulkDeleteProducts(selectedProducts);
            showToast.success(`${selectedProducts.length} products deleted successfully`);
            setSelectedProducts([]);
            setSelectAll(false);
            onRefresh?.();
          }
          break;
        }
        case 'publish': {
          // Update local state immediately for better UX
          const updates: Record<string, { status: Product["status"]; visibility: Product["visibility"] }> = {};
          selectedProducts.forEach(id => {
            const product = products.find(p => p.id === id);
            if (product) {
              updates[id] = {
                status: "Online",
                visibility: getEffectiveState(product).visibility,
              };
            }
          });
          setLocalProductState(prev => ({ ...prev, ...updates }));

          await bulkUpdateProductStatus(selectedProducts, 'ACTIVE');
          showToast.success(`${selectedProducts.length} products published successfully`);
          setSelectedProducts([]);
          setSelectAll(false);
          onRefresh?.();
          break;
        }
        case 'draft': {
          // Update local state immediately for better UX
          const updates: Record<string, { status: Product["status"]; visibility: Product["visibility"] }> = {};
          selectedProducts.forEach(id => {
            const product = products.find(p => p.id === id);
            if (product) {
              updates[id] = {
                status: "Draft",
                visibility: getEffectiveState(product).visibility,
              };
            }
          });
          setLocalProductState(prev => ({ ...prev, ...updates }));

          await bulkUpdateProductStatus(selectedProducts, 'DRAFT');
          showToast.success(`${selectedProducts.length} products moved to draft`);
          setSelectedProducts([]);
          setSelectAll(false);
          onRefresh?.();
          break;
        }
        case 'visibility': {
          // Update local state immediately for better UX
          const updates: Record<string, { status: Product["status"]; visibility: Product["visibility"] }> = {};
          selectedProducts.forEach(id => {
            const product = products.find(p => p.id === id);
            if (product) {
              const currentVisibility = getEffectiveState(product).visibility;
              updates[id] = {
                status: getEffectiveState(product).status,
                visibility: currentVisibility === "Visible" ? "Hidden" : "Visible",
              };
            }
          });
          setLocalProductState(prev => ({ ...prev, ...updates }));

          await bulkToggleProductVisibility(selectedProducts);
          showToast.success(`${selectedProducts.length} products visibility toggled`);
          setSelectedProducts([]);
          setSelectAll(false);
          onRefresh?.();
          break;
        }
        default:
          if (onBulkAction) {
            onBulkAction(action, selectedProducts);
          }
      }
    } catch (error: any) {
      console.error(`Error performing bulk ${action}:`, error);
      showToast.error(error.message || `Failed to ${action} products`);
    } finally {
      setBulkActionLoading(false);
      setCurrentBulkAction(null);
    }
  };

  const getStatusVariant = (status: Product["status"]) => {
    switch (status) {
      case "Online":
        return "success";
      case "Draft":
        return "warning";
      default:
        return "default";
    }
  };

  const getVisibilityVariant = (visibility: Product["visibility"]) => {
    switch (visibility) {
      case "Visible":
        return "success";
      case "Hidden":
        return "danger";
      default:
        return "default";
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setVisibilityFilter("all");
    setStartDate("");
    setEndDate("");
    setAttributeFilter("all");
    setVariationFilter("all");
    setStockFilter("all");
    setPriceMin("");
    setPriceMax("");
    setStockMin("");
    setStockMax("");
    setWeightMin("");
    setWeightMax("");
    onCategoryFilterChange("all");
  };

  const getFilterCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (statusFilter !== "all") count++;
    if (visibilityFilter !== "all") count++;
    if (categoryFilter !== "all") count++;
    if (startDate || endDate) count++;
    if (attributeFilter !== "all") count++;
    if (variationFilter !== "all") count++;
    if (stockFilter !== "all") count++;
    if (priceMin || priceMax) count++;
    if (stockMin || stockMax) count++;
    if (weightMin || weightMax) count++;
    return count;
  };


  // Combined toggle: only changes visibility, not status
  const handleCombinedToggle = async (product: Product) => {
    try {
      setUpdatingVisibility(product.id);

      const effective = getEffectiveState(product);
      const isVisible = effective.visibility === "Visible";
      const targetVisibilityActive = !isVisible; // true means Visible/ACTIVE, false means Hidden/INACTIVE

      // Only update visibility
      await toggleProductVisibility(product.id, targetVisibilityActive ? "ACTIVE" : "INACTIVE");

      showToast.success(`Product visibility ${isVisible ? "hidden" : "shown"} successfully`);
      setLocalProductState(prev => ({
        ...prev,
        [product.id]: {
          status: effective.status, // Keep status unchanged
          visibility: targetVisibilityActive ? "Visible" : "Hidden",
        },
      }));
      onRefresh?.();
    } catch (error: any) {
      console.error("Error toggling product visibility:", error);
      showToast.error(error.message || "Failed to toggle product visibility");
    } finally {
      setUpdatingVisibility(null);
    }
  };

  return (
    <div className=" min-h-[calc(100vh-130px)] gap-6  flex flex-col justify-between bg-red flex-1 ">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600">
              Manage your product catalog and inventory
            </p>
          </div>
          <div className="flex gap-2">

            <Button onClick={onBulkAdd} variant="secondary" icon={Upload}>
              Bulk Add
            </Button>
            <Button onClick={onAddProduct} icon={Plus}>
              Add Product
            </Button>
            <Button
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              Export
            </Button>
            <Button
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              Import
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <div className="space-y-4">
            {/* Basic Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">

              <select
                value={categoryFilter}
                onChange={(e) => onCategoryFilterChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>

              {/* Status Filter */}

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="Online">Online</option>
                <option value="Draft">Draft</option>
              </select>

              {/* Visibility + Stock Preset Filters */}
              <select
                value={visibilityFilter}
                onChange={(e) => setVisibilityFilter(e.target.value)}
                className="px-4 py-2 border w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                <option value="all">All Visibility</option>
                <option value="Visible">Visible</option>
                <option value="Hidden">Hidden</option>
              </select>
              <div className="flex items-center gap-3 col-span-1 w-full">
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="px-4 py-2 border w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                >
                  <option value="all">All Stock</option>
                  <option value="<5">Less than 5</option>
                  <option value="<10">Less than 10</option>
                  <option value="<50">Less than 50</option>
                  <option value="Low Stock">Low Stock (≤10)</option>
                  <option value="In Stock">In Stock (&gt;10)</option>
                  <option value="Out of Stock">Out of Stock (=0)</option>
                </select>
                <Button
                  variant="ghost"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  icon={Filter}
                  className="text-blue-600 flex justify-center hover:text-blue-800"
                >
                  {getFilterCount() > 0 && (
                    <Badge variant="info" className="mx-auto">
                      {getFilterCount()}
                    </Badge>
                  )}
                </Button>
                {getFilterCount() > 0 && (
                  <Button
                    variant="ghost"
                    onClick={handleResetFilters}
                    className="text-gray-600 whitespace-nowrap hover:text-gray-800"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>

            </div>



            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                {/* Date Range */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {/* <Calendar className="inline w-4 h-4 mr-1" /> */}
                    Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
                    />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Price Range (₹)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                {/* Stock Range */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {/* <Package className="inline w-4 h-4 mr-1" /> */}
                    Stock Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={stockMin}
                      onChange={(e) => setStockMin(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={stockMax}
                      onChange={(e) => setStockMax(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
                    />
                  </div>
                </div>


              </div>
            )}
          </div>

        </Card>
        <Card>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {selectedProducts.length} selected
              </span>
              <select
                value=""
                onChange={(e) => {
                  const action = e.target.value;
                  console.log('Bulk action selected:', action);
                  handleBulkAction(action);
                  // Reset the select value after action
                  e.target.value = "";
                }}
                disabled={selectedProducts.length === 0 || bulkActionLoading}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {bulkActionLoading ? "Processing..." : "Bulk actions"}
                </option>
                <option value="delete">Delete Products</option>
                <option value="publish">Publish Products</option>
                <option value="draft">Move to Draft</option>
                <option value="visibility">Toggle Visibility</option>
              </select>
              {bulkActionLoading && (
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              )}
            </div>

            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </Card>

        <Card padding={false}>
          <Table
            headers={[
              <input
                key="select-all"
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />,
              "Product",
              "Category",
              "Price",
              "Stock",
              "Status",
              "Visibility",
              "Created",
              "Actions",
            ]}
          >
            {filteredProducts.map((product) => {
              console.log('Rendering product:', product.id, product.name);
              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleProductSelection(product.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3 cursor-pointer">
                      <img
                        src={
                          product.images && product.images.length > 0
                            ? typeof product.images[0] === "string"
                              ? product.images[0]
                              : "/placeholder-product.jpg"
                            : "/placeholder-product.jpg"
                        }
                        alt={product.name}
                        onClick={() => onViewProduct(product)}

                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          SKU: {product.sku || "N/A"}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="info">{product.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium text-gray-900 line-through ">
                        ₹{product.price.toFixed(2)}
                      </div>
                      {product.discountedPrice && (
                        <div className="text-green-600">
                          ₹{product.discountedPrice.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm flex items-center flex-col">
                      <span className="font-medium text-gray-900">
                        {product.stock}
                      </span>
                      {product.stock <= 10 && product.stock > 0 && (
                        <Badge variant="warning" className="ml-1 text-xs w-fit">
                          Low
                        </Badge>
                      )}
                      {product.stock === 0 && (
                        <Badge variant="danger" className="ml-1 text-xs">
                          Out
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(getEffectiveState(product).status)}>
                      {bulkActionLoading && currentBulkAction === 'publish' || bulkActionLoading && currentBulkAction === 'draft' ? (
                        selectedProducts.includes(product.id) ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          getEffectiveState(product).status
                        )
                      ) : (
                        getEffectiveState(product).status
                      )}
                    </Badge>

                  </TableCell>
                  <TableCell>
                    <Badge variant={getVisibilityVariant(getEffectiveState(product).visibility)} >
                      {(updatingVisibility === product.id || (bulkActionLoading && currentBulkAction === 'visibility' && selectedProducts.includes(product.id))) ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <>
                          {getEffectiveState(product).visibility === "Visible" ? (
                            <Eye className="w-3 h-3 mr-1" />
                          ) : (
                            <EyeOff className="w-3 h-3 mr-1" />
                          )}
                          {getEffectiveState(product).visibility}
                        </>
                      )}
                    </Badge>

                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      <div>{new Date(product.createdDate).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(product.createdDate).toLocaleTimeString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewProduct(product)}
                        icon={Eye}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Product"
                      >
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/products/new?id=${product.id}`)}
                        icon={Edit}
                        className="text-green-600 hover:text-green-800"
                        title="Edit Product">
                      </Button>
                      {/* Row On/Off Toggle */}
                      <label className="relative inline-flex items-center cursor-pointer" title="Visibility Toggle">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={getEffectiveState(product).visibility === "Visible"}
                          onChange={() => handleCombinedToggle(product)}
                          disabled={updatingVisibility === product.id}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Individual delete clicked for product:', product.id);
                          if (product.id && product.id !== 'bulk') {
                            onDeleteProduct(product.id);
                          } else {
                            console.error('Invalid product ID for delete:', product.id);
                          }
                        }}
                        icon={Trash2}
                        className="text-red-600 hover:text-red-800"
                        title="Delete Product"
                      >
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </Table>

        </Card>
      </div>

      {meta && (
        <div className="flex justify-between items-center mb-6">
          {/* Previous Button */}
          <Button
            variant="ghost"
            size="sm"
            className="bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-600"
            disabled={meta.page === 1}
            onClick={() => onPageChange?.(meta.page - 1)}
          >
            Previous
          </Button>

          {/* Center - Page Info + Dropdown */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              Page <strong>{meta.page}</strong> of {meta.totalPages}
            </span>

            {/* Beautiful Dropdown */}

            <div className="relative inline-block">
              <select
                className="block w-full appearance-none border border-gray-300 rounded-lg px-3 py-1.5 text-sm 
               bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 
               shadow-sm cursor-pointer pr-8"
                value={meta.limit}
                onChange={(e) => onLimitChange?.(Number(e.target.value))}   // 👈 ye badla
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>

              {/* Custom Arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

          </div>

          {/* Next Button */}
          <Button
            variant="ghost"
            size="sm"
            className="bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-600"
            disabled={meta.page === meta.totalPages}
            onClick={() => onPageChange?.(meta.page + 1)}
          >
            Next
          </Button>
        </div>
      )}


      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Package className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-500">
              {getFilterCount() > 0
                ? "Try adjusting your filters to find more products."
                : "Get started by adding your first product."}
            </p>
            {getFilterCount() === 0 && (
              <Button onClick={onAddProduct} className="mt-4" icon={Plus}>
                Add Product
              </Button>
            )}
          </div>
        </Card>
      )}

    </div>

  );
}