import React, { useState, useEffect, useRef } from "react";
import { Edit, Trash2, Save, Upload, X, Package, Eye, Plus, Search, Loader2 } from "lucide-react";
import Button from "../ui/Button";
import { ProductVariation as BaseProductVariation } from "../../types";
import { uploadMultipleImages, addProductVariations, updateProductVariation, deleteProductVariation } from "../../services/api";
import { showToast } from "../../utils/toast";

// Extended type for the variations editor with dynamic attributes
interface ProductVariation extends BaseProductVariation {
    // Dynamic attributes based on category variations
    [key: string]: any;
    stockStatus?: 'instock' | 'outofstock';
    status?: 'draft' | 'published' | 'hidden';
    length?: number;
    width?: number;
    height?: number;
    defaultImage?: string;
    shippingMethod?: 'free' | 'flat_rate' | 'express';
}

type StockStatus = 'instock' | 'outofstock';
type ProductStatus = 'draft' | 'published' | 'hidden';
type ShippingMethod = 'free' | 'flat_rate' | 'express';

interface VariationDef {
    id: string;
    name: string;
    type: string;
    required: boolean;
    options: { name: string; value: string }[];
}

interface EditVariationModalProps {
    variation: ProductVariation | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (variation: ProductVariation) => void;
    variationDefs?: VariationDef[];
    variations?: ProductVariation[];
    setVariations?: (variations: ProductVariation[]) => void;
    onChange?: (variations: ProductVariation[]) => void;
    uploadingImages?: boolean;
    onUploadingChange?: (uploading: boolean) => void;
    productId?: string;
}

interface ViewVariationModalProps {
    variation: ProductVariation | null;
    isOpen: boolean;
    onClose: () => void;
    variationDefs?: VariationDef[];
}

interface BulkEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (updates: Partial<ProductVariation>) => void;
    selectedVariations: ProductVariation[];
}

// Bulk Edit Modal Component
const BulkEditModal: React.FC<BulkEditModalProps> = ({ 
    isOpen, 
    onClose, 
    onApply, 
    selectedVariations 
}) => {
    const [updates, setUpdates] = useState<Partial<ProductVariation>>({});

    const handleApply = () => {
        onApply(updates);
        setUpdates({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Bulk Edit ({selectedVariations.length} variations)
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={updates.price || ''}
                            onChange={(e) => setUpdates(prev => ({ ...prev, price: parseFloat(e.target.value) || undefined }))}
                            placeholder="Leave empty to keep current"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Discounted Price (₹)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={updates.discountedPrice || ''}
                            onChange={(e) => setUpdates(prev => ({ ...prev, discountedPrice: parseFloat(e.target.value) || undefined }))}
                            placeholder="Leave empty to keep current"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                        <input
                            type="number"
                            value={updates.stock || ''}
                            onChange={(e) => setUpdates(prev => ({ ...prev, stock: parseInt(e.target.value) || undefined }))}
                            placeholder="Leave empty to keep current"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
                        <select
                            value={updates.stockStatus || ''}
                            onChange={(e) => setUpdates(prev => ({ ...prev, stockStatus: (e.target.value as StockStatus) || undefined }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Keep current</option>
                            <option value="instock">In Stock</option>
                            <option value="outofstock">Out of Stock</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Status</label>
                        <select
                            value={updates.status || ''}
                            onChange={(e) => setUpdates(prev => ({ ...prev, status: (e.target.value as ProductStatus) || undefined }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Keep current</option>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="hidden">Hidden</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleApply}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Apply Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

// Edit Modal Component
const EditVariationModal: React.FC<EditVariationModalProps> = ({
    variation,
    isOpen,
    onClose,
    onSave,
    variationDefs = [],
    variations = [],
    setVariations,
    onChange,
    uploadingImages = false,
    onUploadingChange,
    productId
}) => {
    const [formData, setFormData] = useState<ProductVariation>({
        id: '',
        name: '',
        sku: '',
        price: 0,
        discountedPrice: 0,
        stock: 0,
        stockStatus: 'instock',
        status: 'draft',
        weight: 0,
        length: 0,
        width: 0,
        height: 0,
        defaultImage: '',
        images: [],
        shippingMethod: 'free',
        attributes: {},
        isActive: true
    });
    const [localUploadingImages, setLocalUploadingImages] = useState(false);
    
    // Use parent's uploading state if available
    const isUploading = uploadingImages || localUploadingImages;

    useEffect(() => {
        if (variation) {
            setFormData(variation);
        }
    }, [variation]);

    const handleSave = async (): Promise<void> => {
        // Validate required fields
        if (!formData.name.trim()) {
            alert('Product name is required');
            return;
        }
        if (!formData.sku.trim()) {
            alert('SKU is required');
            return;
        }
        if (formData.price <= 0) {
            alert('Price must be greater than 0');
            return;
        }

        try {
            // If this is a new variation (no existing variation), add it to the list
            if (!variation) {
                if (setVariations && onChange) {
                    const next = [formData, ...variations];
                    setVariations(next);
                    onChange(next);
                    
                    // If we have a productId, save to backend
                    if (productId) {
                        try {
                            await addProductVariations(productId, [formData]);
                            showToast.success("Variation added successfully!");
                        } catch (error: any) {
                            showToast.error(error.message || "Failed to save variation to backend");
                        }
                    }
                }
            } else {
                // If editing existing variation, update it
                onSave(formData);
                
                // If we have a productId, update in backend
                if (productId) {
                    try {
                        await updateProductVariation(productId, variation.id, formData);
                        showToast.success("Variation updated successfully!");
                    } catch (error: any) {
                        showToast.error(error.message || "Failed to update variation in backend");
                    }
                }
            }
            onClose();
        } catch (error: any) {
            console.error("Error saving variation:", error);
            showToast.error(error.message || "Failed to save variation");
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setLocalUploadingImages(true);
            onUploadingChange?.(true);
            try {
                const fileArray = Array.from(files);
                const uploadedUrls = await uploadMultipleImages(fileArray);
                
                    setFormData((prev: ProductVariation) => ({
                        ...prev,
                    images: [...(prev.images || []), ...uploadedUrls],
                    defaultImage: uploadedUrls[0] || prev.defaultImage
                }));
                
                showToast.success(`${uploadedUrls.length} image(s) uploaded successfully!`);
            } catch (error: any) {
                console.error("Error uploading images:", error);
                showToast.error(error.message || "Failed to upload images");
            } finally {
                setLocalUploadingImages(false);
                onUploadingChange?.(false);
            }
        }
    };

    const handleRemoveImage = (index: number): void => {
        setFormData((prev: ProductVariation) => {
            const newImages = [...(prev.images || [])];
            newImages.splice(index, 1);
            return {
                ...prev,
                images: newImages,
                defaultImage: newImages[0] || ''
            };
        });
    };

    const handleSetDefaultImage = (index: number): void => {
        setFormData((prev: ProductVariation) => ({
            ...prev,
            defaultImage: (prev.images || [])[index] || ''
        }));
    };

    const handleVariationAttributeChange = (variationId: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            attributes: {
                ...prev.attributes,
                [variationId]: value
            }
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {variation ? 'Edit Variation' : 'Add Variation'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Variation Images</label>
                        
                        {/* Upload Button */}
                        <div className="mb-4">
                            <label className={`cursor-pointer px-4 py-2 rounded-md flex items-center w-fit ${
                                isUploading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700'
                            } text-white`}>
                                {isUploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                <Upload className="w-4 h-4 mr-2" />
                                        Upload Images
                                    </>
                                )}
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    multiple
                                    onChange={handleImageUpload} 
                                    className="hidden"
                                    disabled={isUploading}
                                />
                            </label>
                            <p className="text-xs text-gray-500 mt-1">
                                {isUploading ? 'Please wait while images are being uploaded...' : 'You can select multiple images at once'}
                            </p>
                        </div>

                        {/* Image Gallery */}
                        {formData.images && formData.images.length > 0 && (
                            <div className="grid grid-cols-4 gap-4">
                                {formData.images.map((image: string, index: number) => (
                                    <div key={index} className="relative group">
                                        <div className={`w-20 h-20 border-2 rounded-lg overflow-hidden cursor-pointer ${
                                            formData.defaultImage === image 
                                                ? 'border-blue-500 ring-2 ring-blue-200' 
                                                : 'border-gray-300'
                                        }`}>
                                            <img 
                                                src={image} 
                                                alt={`Variation ${index + 1}`} 
                                                className="w-full h-full object-cover" 
                                            />
                    </div>

                                        {/* Overlay with actions */}
                                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-1">
                                            <button
                                                type="button"
                                                onClick={() => handleSetDefaultImage(index)}
                                                className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                title="Set as default"
                                            >
                                                <Eye className="w-3 h-3" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(index)}
                                                className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                                                title="Remove image"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                        
                                        {/* Default indicator */}
                                        {formData.defaultImage === image && (
                                            <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs px-1 rounded-full">
                                                Default
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* No images placeholder */}
                        {(!formData.images || formData.images.length === 0) && (
                            <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                                <Package className="w-8 h-8 text-gray-400" />
                            </div>
                        )}
                    </div>

                    {/* SKU */}
                    <div className="grid grid-cols-1 gap-4 w-full">
                        <div className=" w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                            <input
                                type="text"
                                value={formData.sku}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev: ProductVariation) => ({ ...prev, sku: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Active Toggle */}
                    <div className="grid grid-cols-1 gap-4 w-full">
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-gray-700">Active</label>
                                <input
                                type="checkbox"
                                checked={!!formData.isActive}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            </div>
                        </div>

                    {/* Dynamic Variation Attributes */}
                    {variationDefs && variationDefs.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {variationDefs.map(def => (
                                <div key={def.id}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{def.name}</label>
                            <select
                                        value={(formData.attributes || {})[def.id] || ''}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                            const value = e.target.value;
                                            setFormData(prev => {
                                                const nextAttrs = { ...(prev.attributes || {}), [def.id]: value };
                                                // convenience fields for color/size
                                                let color = prev.color;
                                                let colorCode = prev.colorCode;
                                                let size = prev.size;
                                                if (def.type === 'color') {
                                                    const selected = def.options?.find(o => o.value === value || o.name === value);
                                                    color = selected?.name || value;
                                                    colorCode = selected?.value || value;
                                                }
                                                if (def.type === 'size') {
                                                    size = value;
                                                }
                                                return { ...prev, attributes: nextAttrs, color, colorCode, size } as ProductVariation;
                                            });
                                        }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                        <option value="">Select {def.name}</option>
                                        {def.options?.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.name}</option>
                                ))}
                            </select>
                        </div>
                            ))}
                    </div>
                    )}

                    {/* Shipping Information */}
                    <div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg) <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.weight}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev: ProductVariation) => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Length (cm)</label>
                                <input
                                    type="number"
                                    value={formData.length}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev: ProductVariation) => ({ ...prev, length: parseInt(e.target.value) || 0 }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Width (cm)</label>
                                <input
                                    type="number"
                                    value={formData.width}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev: ProductVariation) => ({ ...prev, width: parseInt(e.target.value) || 0 }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                                <input
                                    type="number"
                                    value={formData.height}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev: ProductVariation) => ({ ...prev, height: parseInt(e.target.value) || 0 }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Method</label>
                                <select
                                    value={formData.shippingMethod}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData((prev: ProductVariation) => ({ ...prev, shippingMethod: e.target.value as ShippingMethod }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="free">Free Shipping</option>
                                    <option value="flat_rate">Flat Rate</option>
                                    <option value="express">Express Shipping</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev: ProductVariation) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discounted Price (₹)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.discountedPrice}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev: ProductVariation) => ({ ...prev, discountedPrice: parseFloat(e.target.value) || 0 }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Stock and Status */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                            <input
                                type="number"
                                value={formData.stock}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev: ProductVariation) => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
                            <select
                                value={formData.stockStatus}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData((prev: ProductVariation) => ({ ...prev, stockStatus: e.target.value as StockStatus }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="instock">In Stock</option>
                                <option value="outofstock">Out of Stock</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Status</label>
                            <select
                                value={formData.status}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData((prev: ProductVariation) => ({ ...prev, status: e.target.value as ProductStatus }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="hidden">Hidden</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

// View Modal Component
const ViewVariationModal: React.FC<ViewVariationModalProps> = ({ variation, isOpen, onClose }) => {
    if (!isOpen || !variation) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        View Variation: {variation.name}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded" type="button">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Images */}
                    <div className="text-center">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Product Images</h4>
                        {variation.images && variation.images.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                                {variation.images.map((image: string, index: number) => (
                                    <div key={index} className="relative">
                                        <div className={`w-32 h-32 border-2 rounded-lg overflow-hidden ${
                                            variation.defaultImage === image 
                                                ? 'border-blue-500 ring-2 ring-blue-200' 
                                                : 'border-gray-300'
                                        }`}>
                                            <img 
                                                src={image} 
                                                alt={`Variation ${index + 1}`} 
                                                className="w-full h-full object-cover" 
                                            />
                                        </div>
                                        {variation.defaultImage === image && (
                                            <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs px-1 rounded-full">
                                                Default
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="w-40 h-40 mx-auto border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                                <Package className="w-16 h-16 text-gray-400" />
                            </div>
                            )}
                    </div>

                    {/* Basic Information Card */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-3">Basic Information</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-600">Product Name:</span>
                                <p className="text-gray-900 mt-1">{variation.name}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-600">SKU:</span>
                                <p className="text-gray-900 mt-1">{variation.sku || 'Not set'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Active & Status */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-3">State</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-600">Active:</span>
                                <div className="mt-1">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${variation.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {variation.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <span className="font-medium text-gray-600">Product Status:</span>
                                <div className="mt-1">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${(variation.status || 'draft') === 'published'
                                        ? 'bg-blue-100 text-blue-800'
                                        : (variation.status || 'draft') === 'draft'
                                            ? 'bg-gray-100 text-gray-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {(variation.status || 'draft').charAt(0).toUpperCase() + (variation.status || 'draft').slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Information Card */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                            <span className="font-medium text-gray-600">Weight:</span>
                            <p className="text-gray-900 mt-1">{variation.weight} kg</p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-600">Length:</span>
                            <p className="text-gray-900 mt-1">{variation.length} cm</p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-600">Width:</span>
                            <p className="text-gray-900 mt-1">{variation.width} cm</p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-600">Height:</span>
                            <p className="text-gray-900 mt-1">{variation.height} cm</p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-600">Shipping Method:</span>
                            <p className="text-gray-900 mt-1 capitalize">
                                {(variation.shippingMethod || 'free').replace('_', ' ')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// Main Component
type ProductVariationsEditorProps = {
    variations?: ProductVariation[];
    onChange?: (variations: ProductVariation[]) => void;
    variationDefs?: VariationDef[];
    uploadingImages?: boolean;
    onUploadingChange?: (uploading: boolean) => void;
    productId?: string; // Add productId for API calls
};

const ProductVariationsEditor: React.FC<ProductVariationsEditorProps> = ({ 
    variations: externalVariations, 
    onChange, 
    variationDefs = [],
    uploadingImages = false,
    onUploadingChange,
    productId
}) => {
    const [variations, setVariations] = useState<ProductVariation[]>(externalVariations || []);
    const [editingVariation, setEditingVariation] = useState<ProductVariation | null>(null);
    const [viewingVariation, setViewingVariation] = useState<ProductVariation | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isBulkEditOpen, setIsBulkEditOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedVariations, setSelectedVariations] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<string>('name');
    const [filterBy, setFilterBy] = useState<string>('all');
    const prevExternalVariationsRef = useRef<ProductVariation[]>();

    // Filter and sort variations
    const filteredAndSortedVariations = variations
        .filter((variation: ProductVariation) => {
            // Search filter
            const matchesSearch = variation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                variation.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                Object.entries(variation.attributes || {}).some(([key, value]) => 
                    String(value).toLowerCase().includes(searchTerm.toLowerCase()) ||
                    variationDefs.find(def => def.id === key)?.name.toLowerCase().includes(searchTerm.toLowerCase())
                );

            // Status filter
            const matchesFilter = filterBy === 'all' || 
                (filterBy === 'instock' && variation.stockStatus === 'instock') ||
                (filterBy === 'outofstock' && variation.stockStatus === 'outofstock') ||
                (filterBy === 'published' && variation.status === 'published') ||
                (filterBy === 'draft' && variation.status === 'draft');

            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'sku':
                    return a.sku.localeCompare(b.sku);
                case 'price':
                    return a.price - b.price;
                case 'stock':
                    return b.stock - a.stock;
                default:
                    return 0;
            }
        });

    useEffect(() => {
        // Only update if external variations have actually changed
        if (externalVariations && externalVariations !== prevExternalVariationsRef.current) {
            setVariations(externalVariations);
            prevExternalVariationsRef.current = externalVariations;
        }
    }, [externalVariations]);

    const handleEditVariation = (variation: ProductVariation): void => {
        setEditingVariation(variation);
        setIsModalOpen(true);
    };

    const handleViewVariation = (variation: ProductVariation): void => {
        setViewingVariation(variation);
        setIsViewModalOpen(true);
    };

    const handleSaveVariation = (updatedVariation: ProductVariation): void => {
        setVariations((prev: ProductVariation[]) => {
            const next = prev.map((v: ProductVariation) => v.id === updatedVariation.id ? updatedVariation : v);
            onChange && onChange(next);
            return next;
        });
    };

    const handleDeleteVariation = async (variationId: string): Promise<void> => {
        if (confirm('Are you sure you want to delete this variation?')) {
            try {
                // If we have a productId, delete from backend first
                if (productId) {
                    try {
                        await deleteProductVariation(productId, variationId);
                        showToast.success("Variation deleted successfully!");
                    } catch (error: any) {
                        showToast.error(error.message || "Failed to delete variation from backend");
                        return; // Don't update local state if backend call fails
                    }
                }
                
                // Update local state
                setVariations((prev: ProductVariation[]) => {
                    const next = prev.filter((v: ProductVariation) => v.id !== variationId);
                    onChange && onChange(next);
                    return next;
                });
            } catch (error: any) {
                console.error("Error deleting variation:", error);
                showToast.error(error.message || "Failed to delete variation");
            }
        }
    };

    const handleBulkDelete = (): void => {
        if (selectedVariations.length === 0) return;
        if (confirm(`Are you sure you want to delete ${selectedVariations.length} variations?`)) {
            setVariations((prev: ProductVariation[]) => {
                const next = prev.filter((v: ProductVariation) => !selectedVariations.includes(v.id));
                onChange && onChange(next);
                return next;
            });
            setSelectedVariations([]);
        }
    };

    const handleBulkEdit = (updates: Partial<ProductVariation>): void => {
        if (selectedVariations.length === 0) return;
        
        setVariations((prev: ProductVariation[]) => {
            const next = prev.map((v: ProductVariation) => 
                selectedVariations.includes(v.id) ? { ...v, ...updates } : v
            );
            onChange && onChange(next);
            return next;
        });
        setSelectedVariations([]);
    };

    const handleAddVariation = (): void => {
        const initialAttrs: Record<string, string> = {};
        for (const def of variationDefs) {
            initialAttrs[def.id] = '';
        }

        const newVar: ProductVariation = {
            id: `manual-${Date.now()}`,
            name: 'New Variation',
            sku: `SKU-${Date.now()}`,
            price: 0,
            discountedPrice: 0,
            stock: 0,
            stockStatus: 'instock',
            status: 'draft',
            weight: 0.1,
            length: 1,
            width: 1,
            height: 1,
            defaultImage: '',
            images: [], // Add images array for multiple images
            shippingMethod: 'free',
            attributes: initialAttrs,
            isActive: true
        };
        
        // Don't add to variations until user clicks "Create" button
        setEditingVariation(newVar);
        setIsModalOpen(true);
    };

    const handleSelectVariation = (variationId: string, selected: boolean): void => {
        if (selected) {
            setSelectedVariations(prev => [...prev, variationId]);
        } else {
            setSelectedVariations(prev => prev.filter(id => id !== variationId));
        }
    };

    const handleSelectAll = (selected: boolean): void => {
        if (selected) {
            setSelectedVariations(filteredAndSortedVariations.map(v => v.id));
        } else {
            setSelectedVariations([]);
        }
    };

    const getStockStatusBadge = (status?: StockStatus): JSX.Element => {
        const badges: Record<StockStatus, string> = {
            instock: 'bg-green-100 text-green-800',
            outofstock: 'bg-red-100 text-red-800'
        };
        const labels: Record<StockStatus, string> = {
            instock: 'In Stock',
            outofstock: 'Out of Stock'
        };

        const currentStatus = status || 'instock';
        return (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badges[currentStatus]}`}>
                {labels[currentStatus]}
            </span>
        );
    };

    const getProductStatusBadge = (status?: ProductStatus): JSX.Element => {
        const badges: Record<ProductStatus, string> = {
            draft: 'bg-gray-100 text-gray-800',
            published: 'bg-blue-100 text-blue-800',
            hidden: 'bg-yellow-100 text-yellow-800'
        };
        const labels: Record<ProductStatus, string> = {
            draft: 'Draft',
            published: 'Published',
            hidden: 'Hidden'
        };

        const currentStatus = status || 'draft';
        return (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badges[currentStatus]}`}>
                {labels[currentStatus]}
            </span>
        );
    };

    const getAttributeDisplayValue = (variationId: string, value: string) => {
        const def = variationDefs.find(d => d.id === variationId);
        const option = def?.options.find(opt => opt.value === value);
        return {
            def,
            option,
            displayText: option ? option.name : value
        };
    };

    const isAllSelected = filteredAndSortedVariations.length > 0 && 
        filteredAndSortedVariations.every(v => selectedVariations.includes(v.id));
    const isSomeSelected = selectedVariations.length > 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Product Variations Editor</h2>
                    <p className="text-gray-600">Manage product variations generated from selected category attributes</p>
                </div>
                <div className="flex gap-3">
                    {selectedVariations.length > 0 && (
                        <>
                            <Button
                                onClick={() => setIsBulkEditOpen(true)}
                                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                            >
                                Bulk Edit ({selectedVariations.length})
                            </Button>
                            <Button
                                onClick={handleBulkDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Delete Selected
                            </Button>
                        </>
                    )}
                    <Button
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                        onClick={handleAddVariation}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Variation
                    </Button>
                </div>
            </div>

           
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-lg border p-4">
                    <div className="text-2xl font-bold text-gray-900">{variations.length}</div>
                    <div className="text-sm text-gray-500">Total Variations</div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="text-2xl font-bold text-green-600">
                        {variations.filter(v => v.stockStatus === 'instock').length}
                    </div>
                    <div className="text-sm text-gray-500">In Stock</div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="text-2xl font-bold text-red-600">
                        {variations.filter(v => v.stockStatus === 'outofstock').length}
                    </div>
                    <div className="text-sm text-gray-500">Out of Stock</div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="text-2xl font-bold text-blue-600">
                        {variations.filter(v => v.status === 'published').length}
                    </div>
                    <div className="text-sm text-gray-500">Published</div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="text-2xl font-bold text-purple-600">
                        {variations.reduce((total, v) => total + (v.stock || 0), 0)}
                    </div>
                    <div className="text-sm text-gray-500">Total Stock</div>
                </div>
            </div>

            {/* Variations Table */}
            <div className="bg-white rounded-lg border overflow-hidden">
                {filteredAndSortedVariations.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    {variationDefs.map(def => (
                                        <th key={def.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{def.name}</th>
                                    ))}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                                {filteredAndSortedVariations.map((variation) => (
                                    <tr key={variation.id} className={`hover:bg-gray-50 ${selectedVariations.includes(variation.id) ? 'bg-blue-50' : ''}`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="w-12 h-12 border-2 border-gray-300 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50">
                                            {variation.defaultImage ? (
                                                <img 
                                                    src={variation.defaultImage} 
                                                    alt={variation.name} 
                                                    className="w-full h-full object-cover" 
                                                />
                                            ) : variation.images && variation.images.length > 0 ? (
                                                <img 
                                                    src={variation.images[0]} 
                                                    alt={variation.name} 
                                                    className="w-full h-full object-cover" 
                                                />
                                            ) : (
                                                <Package className="w-6 h-6 text-gray-400" />
                                            )}
                                        </div>
                                        {variation.images && variation.images.length > 1 && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                +{variation.images.length - 1} more
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{variation.name}</div>
                                    </td>
                                        {variationDefs.map(def => {
                                            const value = variation.attributes?.[def.id];
                                            const displayInfo = getAttributeDisplayValue(def.id, value || '');
                                            
                                            if (def.type === 'color' && displayInfo.option) {
                                                return (
                                                    <td key={def.id} className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <div
                                                className="w-4 h-4 rounded-full border border-gray-300"
                                                                style={{ backgroundColor: displayInfo.option.value }} 
                                            />
                                                            <span className="text-sm text-gray-900">{displayInfo.displayText}</span>
                                        </div>
                                    </td>
                                                );
                                            }
                                            return (
                                                <td key={def.id} className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-900">{displayInfo.displayText || 'N/A'}</span>
                                                </td>
                                            );
                                        })}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900 font-mono">{variation.sku}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${variation.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {variation.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm">
                                            <div className="font-medium text-gray-900">₹{variation.price}</div>
                                                {variation.discountedPrice && variation.discountedPrice > 0 && variation.discountedPrice < variation.price && (
                                                <div className="text-green-600">₹{variation.discountedPrice}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{variation.stock} units</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStockStatusBadge(variation.stockStatus)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getProductStatusBadge(variation.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                    type="button"
                                                onClick={() => handleViewVariation(variation)}
                                                className="text-gray-600 hover:text-gray-800 p-1 rounded"
                                                title="View variation"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                    type="button"
                                                onClick={() => handleEditVariation(variation)}
                                                className="text-blue-600 hover:text-blue-800 p-1 rounded"
                                                title="Edit variation"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                    type="button"
                                                onClick={() => handleDeleteVariation(variation.id)}
                                                className="text-red-600 hover:text-red-800 p-1 rounded"
                                                title="Delete variation"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                ) : (
                    <div className="text-center py-12">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchTerm || filterBy !== 'all' ? 'No Matching Variations' : 'No Variations Created'}
                        </h3>
                        <p className="text-gray-500 mb-4">
                            {searchTerm || filterBy !== 'all' 
                                ? 'Try adjusting your search or filter criteria.'
                                : 'Select options in the Basic Info tab to automatically generate product variations.'
                            }
                        </p>
                        {!searchTerm && filterBy === 'all' && (
                            <Button
                                onClick={handleAddVariation}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center mx-auto"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Manual Variation
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Pagination info */}
            {variations.length > 0 && (
                <div className="text-sm text-gray-500 text-center">
                    Showing {filteredAndSortedVariations.length} of {variations.length} variations
                    {selectedVariations.length > 0 && (
                        <span className="ml-2 text-blue-600">({selectedVariations.length} selected)</span>
                    )}
                </div>
            )}

            {/* Modals */}
            <EditVariationModal
                variation={editingVariation}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingVariation(null);
                }}
                onSave={handleSaveVariation}
                variationDefs={variationDefs}
                variations={variations}
                setVariations={setVariations}
                onChange={onChange}
                uploadingImages={uploadingImages}
                onUploadingChange={onUploadingChange}
                productId={productId}
            />

            <ViewVariationModal
                variation={viewingVariation}
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setViewingVariation(null);
                }}
                variationDefs={variationDefs}
            />

            <BulkEditModal
                isOpen={isBulkEditOpen}
                onClose={() => setIsBulkEditOpen(false)}
                onApply={handleBulkEdit}
                selectedVariations={variations.filter(v => selectedVariations.includes(v.id))}
            />
        </div>
    );
};

export default ProductVariationsEditor;