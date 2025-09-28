import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { Product } from "../../types";
import { Eye, EyeOff, Calendar, Tag, Package, DollarSign, Loader2 } from "lucide-react";
import { getProduct } from "../../services/api";

interface ProductViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
}

export default function ProductViewModal({
  isOpen,
  onClose,
  product,
}: ProductViewModalProps) {
  const [productDetails, setProductDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && product) {
      fetchProductDetails(product.id);
    }
  }, [isOpen, product]);

  const fetchProductDetails = async (productId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProduct(productId);
      
      if (response.success) {
        setProductDetails(response.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch product details");
      console.error("Error fetching product details:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

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

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Product Details" size="xl">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Loading product details...</span>
        </div>
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Product Details" size="xl">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => fetchProductDetails(product.id)}>
              Retry
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Product Details" size="xl">
      <div className="space-y-6">
        {/* Product Header */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <img
              src={
                product.images && product.images.length > 0
                  ? typeof product.images[0] === "string"
                    ? product.images[0]
                    : "https://via.placeholder.com/150"
                  : "https://via.placeholder.com/150"
              }
              alt={product.name}
              className="w-24 h-24 rounded-lg object-fill border"
            />
            {/* Show image count if multiple images */}
            {product.images && product.images.length > 1 && (
              <div className="mt-2 text-center">
                <Badge variant="info" className="text-xs">
                  +{product.images.length - 1} more
                </Badge>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {product.name}
            </h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>ID: {product.id}</span>
              <span>Category: {product.category}</span>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant={getStatusVariant(product.status)}>
                {product.status}
              </Badge>
              <Badge variant={getVisibilityVariant(product.visibility)}>
                {product.visibility === "Visible" ? (
                  <Eye className="w-3 h-3 mr-1" />
                ) : (
                  <EyeOff className="w-3 h-3 mr-1" />
                )}
                {product.visibility}
              </Badge>
            </div>
          </div>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Pricing Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Pricing Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sale Price:</span>
                  <span className="font-semibold">
                    ₹{product.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount Price:</span>
                  <span className="font-semibold text-green-600">
                    {product.discountedPrice
                      ? `₹${product.discountedPrice.toFixed(2)}`
                      : "No discount"}
                  </span>
                </div>
                {product.discountedPrice && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount Amount:</span>
                    <span className="font-semibold text-red-600">
                      ₹{(product.price - product.discountedPrice).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Stock Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Stock Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Stock:</span>
                  <span
                    className={`font-semibold ${
                      product.stock === 0
                        ? "text-red-600"
                        : product.stock <= 10
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {product.stock} units
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock Status:</span>
                  <span
                    className={`font-semibold ${
                      product.stock === 0
                        ? "text-red-600"
                        : product.stock <= 10
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {product.stock === 0
                      ? "Out of Stock"
                      : product.stock <= 10
                      ? "Low Stock"
                      : "In Stock"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Product Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                Product Information
              </h3>
              <div className="space-y-2">
               
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-semibold">{product.category}</span>
                </div>
                {product.tags && product.tags.length > 0 && (
                  <div>
                    <span className="text-gray-600">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {product.tags.map((tag, index) => (
                        <Badge key={index} variant="info" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Date Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Date Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-semibold">
                    {new Date(product.createdDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Updated:</span>
                  <span className="font-semibold">
                    {new Date(product.updatedDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Published:</span>
                  <span className="font-semibold">
                    {product.publishedDate
                      ? new Date(product.publishedDate).toLocaleDateString()
                      : "Not published"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API Product Details (if available) */}
        {productDetails && (
          <div className="space-y-4">
            {/* Specifications */}
            {productDetails.specification && productDetails.specification.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {productDetails.specification.map((spec: any, index: number) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-600 font-medium">{spec.name}:</span>
                      <span className="font-semibold">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Variations */}
            {productDetails.productVeriations && productDetails.productVeriations.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Product Variations
                </h3>
                <div className="space-y-3">
                  {productDetails.productVeriations.map((variation: any, index: number) => (
                    <div key={index} className="border rounded-lg p-3 bg-white">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{variation.name}</span>
                        <span className="text-sm text-gray-500">SKU: {variation.sku}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Price:</span>
                          <span className="ml-2 font-medium">₹{variation.price}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Stock:</span>
                          <span className="ml-2 font-medium">{variation.stock}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Status:</span>
                          <span className="ml-2 font-medium">{variation.status || 'draft'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Weight:</span>
                          <span className="ml-2 font-medium">{variation.weight || 'N/A'} kg</span>
                        </div>
                      </div>
                      {/* Display variation attributes */}
                      {variation.productVeriationAttributes && variation.productVeriationAttributes.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Variation Attributes:</h4>
                          <div className="flex flex-wrap gap-2">
                            {variation.productVeriationAttributes.map((attr: any, attrIndex: number) => (
                              <div key={attrIndex} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                {attr.key}: {attr.value}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
