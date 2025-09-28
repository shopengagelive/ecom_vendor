import { useState, useEffect } from "react";
import Button from "../components/ui/Button";
import { Product } from "../types";
import {
  getProducts,
  deleteProduct,
  updateProductStatus,
  getActiveCategories,
} from "../services/api";
import { showToast } from "../utils/toast";
import ProductList from "../components/products/ProductList";
import ProductViewModal from "../components/products/ProductViewModal"; // Import ProductViewModal
// import { Plus } from "lucide-react"; // Removed Plus import
import { useMemo } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // State for controlling ProductViewModal visibility
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined); // State for selected product to view
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch products and categories on component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);


  const fetchCategories = async () => {
    try {
      const response = await getActiveCategories(1, 100); // Get all active categories
      if (response.success) {
        setCategories(response.data.data);
      }
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      // Don't fail the entire component if categories fail
    }
  };

  const fetchProducts = async (page: number = 1, limit: number = 5) => {
    try {
      setLoading(true);
      setError(null);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const response = await getProducts(page, limit);

      if (response.success) {
        setMeta(response.data.meta);

        const transformedProducts = response.data.data.map((product: any) => {
          // 🔥 your transformation logic (same as before)
          return {
            id: product.id,
            name: product.name,
            images: product.images || [],
            stock: product.stock || 0,
            price: parseFloat(product.price) || 0,
            discountedPrice: product.discountedPrice
              ? parseFloat(product.discountedPrice)
              : undefined,
            status:
              product.status === "ACTIVE"
                ? "Online"
                : product.status === "DRAFT"
                  ? "Draft"
                  : product.status === "INACTIVE"
                    ? "Inactive"
                    : product.status === "PENDING_REVIEW"
                      ? "Pending"
                      : product.status === "REJECTED"
                        ? "Rejected"
                        : "Draft",
            visibility: product.isVisible ? "Visible" : "Hidden",
            category: product.category?.name || "Uncategorized",
            tags: product.tags || [],
            publishedDate: product.publisedDate || "",
            createdDate: product.createdAt || new Date().toISOString(),
            updatedDate: product.updatedAt || new Date().toISOString(),
            sku: product.sku || "",
            weight: product.weight ? parseFloat(product.weight) : 0,
            dimensions: {
              length: product.length ? parseFloat(product.length) : 0,
              width: product.width ? parseFloat(product.width) : 0,
              height: product.height ? parseFloat(product.height) : 0,
            },
            description: product.description || "",
            specifications:
              product.specification?.reduce((acc: any, spec: any) => {
                acc[spec.name] = spec.value;
                return acc;
              }, {}) || {},
            attributes: [],
            variations: [],
          };
        });

        setProducts(transformedProducts);
      }
    } catch (err: any) {
      console.error("Error fetching products:", err);
      showToast.error("Failed to load products. Please try again.");
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product); // Set the product to view
    setIsViewModalOpen(true); // Open the modal
  };


  // This function is for handling product saves from ProductModal
  // It will handle both creating and updating products
  const handleDeleteProduct = async (productId: string) => {
    console.log('handleDeleteProduct called with productId:', productId);
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
        showToast.success("Product deleted successfully!");
        fetchProducts();
      } catch (error: any) {
        showToast.error(error.message || "Failed to delete product.");
      }
    }
  };

  const handleBulkAction = async (action: string, productIds: string[]) => {
    try {
      switch (action) {
        case "publish":
          for (const productId of productIds) {
            await updateProductStatus(productId, "ACTIVE");
          }
          showToast.success(`Published ${productIds.length} products successfully!`);
          break;
        case "delete":
          if (confirm(`Are you sure you want to delete ${productIds.length} products?`)) {
            for (const productId of productIds) {
              await deleteProduct(productId);
            }
            showToast.success(`Deleted ${productIds.length} products successfully!`);
          }
          break;
      }
      fetchProducts();
    } catch (error: any) {
      showToast.error(error.message || "Failed to perform bulk action.");
    }
  };

  const handleAddProduct = () => {
    navigate('/products/new'); // Navigate to add product page
  };



  const categoryOptions = useMemo(
    () => ["all", ...categories.map((cat) => cat.name)],
    [categories]
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600">
              Manage your product catalog and inventory
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading products...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 text-red-600">
        <h1 className="text-3xl font-bold">Error</h1>
        <p>Failed to load products: {error}</p>
        <Button onClick={() => fetchProducts()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">

{/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
{/* @ts-ignore */}
      <ProductList
        products={products}
        meta={meta}
        onViewProduct={handleViewProduct}
        onDeleteProduct={handleDeleteProduct}
        onBulkAction={handleBulkAction}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        categories={categoryOptions}
        onAddProduct={handleAddProduct}
      />

      {/* {isModalOpen && (
        <ProductModal
          product={selectedProduct}
          categories={categories}
          onClose={handleCloseModal} // Pass the handleCloseModal function
        />
      )} */}
      <ProductViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
}
