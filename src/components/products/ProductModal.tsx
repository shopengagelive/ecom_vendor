import React, { useState, useEffect, useMemo, useRef } from "react";
import Button from "../ui/Button";
import {
  Product,
  ProductAttribute,
  ProductVariation,
} from "../../types";
import { X, Plus, Loader2 } from "lucide-react";
import { getCategoryVariations, createProduct, updateProductById, uploadImage, fetchWarehouses } from "../../services/api";
import { showToast } from "../../utils/toast";
import { useNavigate } from "react-router-dom";
import ProductVariations from "./ProductVariations";
import ProductImageUpload from "./productModal/ProductImageUpload";
import ProductBasicInfo from "./productModal/ProductBasicInfo";
import ProductInventoryShipping from "./productModal/ProductInventoryShipping";

interface ProductModalProps {
  product?: Product;
  categories?: any[];
}

interface VariationDef {
  id: string;
  name: string;
  type: string;
  required: boolean;
  options: { name: string; value: string }[];
}

export default function ProductModal({
  product,
  categories = [],
}: ProductModalProps) {
  const navigate = useNavigate();

  type ProductFormData = {
    name: string;
    images: (string | File)[];
    stock: string; // store as string in form
    price: string; // store as string in form
    discountedPrice: string; // store as string in form
    stockStatus?: string;
    productStatus?: string;
    status: Product["status"];
    visibility: Product["visibility"];
    category: string;
    tags: string[];
    publishedDate: string;
    createdDate: string;
    updatedDate: string;
    sku: string;
    weight: string; // store as string
    shipping?: string;
    warehouseId?: string;
    rmaOption?: string;
    dimensions: {
      length: string; // store as string
      width: string; // store as string
      height: string; // store as string
    };
    description: string;
    specifications: Record<string, string>;
    attributes: ProductAttribute[];
    variations: ProductVariation[];
    [key: string]: any;
  };

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    images: [],
    stock: "0",
    price: "0",
    discountedPrice: "0",
    stockStatus: "",
    productStatus: "",
    status: "Draft",
    visibility: "Visible",
    category: "",
    tags: [],
    publishedDate: "",
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
    sku: "",
    weight: "0.1",
    shipping: "free",
    warehouseId: "",
    rmaOption: "",
    dimensions: { length: "1", width: "1", height: "1" },
    description: "",
    specifications: {},
    attributes: [],
    variations: [],
  });

  const [tagInput, setTagInput] = useState("");
  const [activeTab, setActiveTab] = useState<"basic" | "variations" | "specifications">("basic");
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");
  const [loadingVariations, setLoadingVariations] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVariationImages, setUploadingVariationImages] = useState(false);
  const [categoryVariations, setCategoryVariations] = useState<VariationDef[]>([]);
  const [variationToggles, setVariationToggles] = useState<Record<string, boolean>>({});
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const formDataRef = useRef(formData);

  // Update formDataRef whenever formData changes
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Initialize form data when product prop changes (basic fields only)
  useEffect(() => {
    if (product) {
      // derive stock status if not present on product
      const derivedStockStatus = (product as any).stockStatus
        ? String((product as any).stockStatus)
        : (product.stock <= 0 ? "out-of-stock" : "in-stock");
      // map product.status + visibility to productStatus dropdown values
      const derivedProductStatus = product.visibility === "Hidden"
        ? "hidden"
        : (product.status === "Online" ? "published" : "draft");

      setFormData(prev => ({
        ...prev,
        name: product.name,
        images: product.images || [],
        stock: String(product.stock ?? 0),
        price: String(product.price ?? 0),
        discountedPrice: String(product.discountedPrice ?? 0),
        stockStatus: derivedStockStatus,
        productStatus: derivedProductStatus,
        status: product.status,
        visibility: product.visibility,
        // category will be normalized to id once categories load
        category: product.category,
        tags: product.tags || [],
        publishedDate: product.publishedDate || "",
        createdDate: product.createdDate,
        updatedDate: new Date().toISOString(),
        sku: product.sku || "",
        weight: String(product.weight ?? 0.1),
        shipping: (product as any).shipping || "free",
        warehouseId: (product as any).warehouseId || "",
        rmaOption: (product as any).rmaOption || "",
        dimensions: product.dimensions
          ? {
              length: String((product.dimensions as any).length ?? 1),
              width: String((product.dimensions as any).width ?? 1),
              height: String((product.dimensions as any).height ?? 1),
            }
          : { length: "1", width: "1", height: "1" },
        description: product.description || "",
        specifications: product.specifications || {},
        attributes: product.attributes || [],
        variations: product.variations || [],
      }));
    } else {
      setFormData({
        name: "",
        images: [],
        stock: "0",
        price: "0",
        discountedPrice: "0",
        status: "Draft",
        visibility: "Visible",
        category: "",
        tags: [],
        publishedDate: "",
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        sku: "",
        weight: "0.1",
        dimensions: { length: "1", width: "1", height: "1" },
        description: "",
        specifications: {},
        attributes: [],
        variations: [],
      });
      setVariationToggles({});
    }
  }, [product]);

  // Normalize category to ID after categories load
  useEffect(() => {
    if (!product || !categories || categories.length === 0) return;
    setFormData(prev => {
      // If already an id from categories list, keep
      const existsAsId = categories.some((c: any) => c.id === prev.category);
      if (existsAsId) return prev;

      // Try map by name
      const match = categories.find((c: any) => c.name === product.category || c.id === product.category);
      if (match) {
        return { ...prev, category: match.id };
      }
      return prev;
    });
  }, [categories, product]);

  // Load warehouses for selection
  useEffect(() => {
    (async () => {
      try {
        const res: any = await fetchWarehouses();
        const list = Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        setWarehouses(list);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  // Handle category changes and fetch variations
  useEffect(() => {
    if (formData.category) {
      const category = categories.find((cat) => cat.name === formData.category);
      if (category) {
        fetchCategoryVariations(category.id);
      }
    }
  }, [formData.category, product, categories]);

  // After category variations are fetched, populate dropdown selections from existing product variations
  useEffect(() => {
    if (!product || categoryVariations.length === 0) return;
    // Build selected option arrays from existing variation attributes
    const updates: Record<string, any[]> = {};
    categoryVariations.forEach((def) => {
      const values = new Set<string>();
      (product.variations || []).forEach((v: any) => {
        const val = v.attributes?.[def.id];
        if (val) values.add(String(val));
      });
      updates[def.id] = Array.from(values);
    });
    // Only apply if there is at least one selection
    const hasAny = Object.values(updates).some(arr => Array.isArray(arr) && arr.length > 0);
    if (hasAny) {
      setFormData(prev => ({ ...prev, ...updates }));
    }
  }, [categoryVariations, product]);

  // Generate variations function
  const generateAutoVariations = (variations: VariationDef[]) => {
    // Use the latest form data from ref to avoid stale state
    const currentFormData = formDataRef.current;
    
    console.log('=== GENERATING VARIATIONS ===');
    console.log('All variations:', variations);
    console.log('Variation toggles:', variationToggles);
    console.log('Form data variation selections:', Object.keys(currentFormData).filter(key => Array.isArray(currentFormData[key])).map(key => ({ [key]: currentFormData[key] })));
    
    if (variations.length === 0) return;

    const enabledVariations = variations.filter((variation: VariationDef) =>
      variationToggles[variation.id] && currentFormData[variation.id] && currentFormData[variation.id].length > 0
    );

    console.log('Enabled variations:', enabledVariations);
    console.log('Selected options for each enabled variation:', enabledVariations.map(v => ({ 
      id: v.id, 
      name: v.name, 
      selectedOptions: currentFormData[v.id],
      totalOptions: v.options.length 
    })));

    if (enabledVariations.length === 0) {
      setFormData((prev) => ({ ...prev, variations: [] }));
      return;
    }

    const defaultPrice = parseFloat(currentFormData.price || "0");
    if (defaultPrice <= 0) {
      console.warn('Cannot generate variations: Product price must be greater than 0');
      return;
    }

    // Generate all possible combinations
    const generateCombinations = (
      variations: VariationDef[],
      index = 0,
      currentCombination: Record<string, string> = {}
    ): Record<string, string>[] => {
      if (index === variations.length) {
        return [currentCombination];
      }

      const variation = variations[index];
      const selectedOptions = currentFormData[variation.id] || [];
      const combinations: Record<string, string>[] = [];

      console.log(`Processing variation ${variation.name} (${variation.id}):`, {
        selectedOptions,
        currentCombination
      });

      for (const optionValue of selectedOptions) {
        const newCombination = {
          ...currentCombination,
          [variation.id]: optionValue
        };
        combinations.push(...generateCombinations(variations, index + 1, newCombination));
      }

      return combinations;
    };

    const combinations = generateCombinations(enabledVariations);
    console.log('Generated combinations:', combinations);
    console.log('Total combinations:', combinations.length);

    const newVariations: ProductVariation[] = combinations.map((combination: Record<string, string>, index: number) => {
      // Create a readable name from the combination
      const nameComponents = [currentFormData.name];
      const skuComponents = [currentFormData.sku || 'VAR'];
      
      Object.entries(combination).forEach(([variationId, optionValue]) => {
        const variation = enabledVariations.find(v => v.id === variationId);
        const option = variation?.options.find(opt => opt.value === optionValue);
        if (option) {
          nameComponents.push(option.name);
          skuComponents.push(option.name.toUpperCase().slice(0, 3));
        }
      });

      // Extract color and size from combination for convenience fields
      const colorAttr = Object.entries(combination).find(([variationId, _]) => {
        const variation = enabledVariations.find(v => v.id === variationId);
        return variation?.type === 'color';
      });
      const sizeAttr = Object.entries(combination).find(([variationId, _]) => {
        const variation = enabledVariations.find(v => v.id === variationId);
        return variation?.type === 'size';
      });
      
      const colorValue = colorAttr?.[1] || '';
      const sizeValue = sizeAttr?.[1] || '';
      
      // Get color code for color variations
      const colorVariation = enabledVariations.find(v => v.type === 'color');
      const colorOption = colorVariation?.options.find(opt => opt.value === colorValue);
      const colorCode = colorOption?.value || getColorCode(colorValue);

      return {
        id: `var-${Date.now()}-${index}`,
        name: nameComponents.join(' - '),
        sku: skuComponents.join('-'),
        price: defaultPrice,
        discountedPrice: parseFloat(currentFormData.discountedPrice || "0"),
        stock: 1,
        weight: parseFloat(currentFormData.weight || "0"),
        attributes: {
          ...combination,
          color: colorValue,
          colorCode: colorCode,
          size: sizeValue,
          stockStatus: 'instock',
          status: 'draft',
          length: currentFormData.dimensions.length,
          width: currentFormData.dimensions.width,
          height: currentFormData.dimensions.height,
          shippingMethod: 'free'
        },
        image: '',
        images: (currentFormData.images || []).filter(img => typeof img === 'string') as string[], // Use main product images as default
        defaultImage: (currentFormData.images || []).find(img => typeof img === 'string') as string || '', // Set first main product image as default
        isActive: true,
      };
    });

    console.log('Final variations generated:', newVariations.length);
    console.log('Variation names:', newVariations.map(v => v.name));
    setFormData((prev) => ({ ...prev, variations: newVariations }));
  };

  // Function to trigger variation generation when options are selected
  const triggerVariationGeneration = () => {
    // Use setTimeout to ensure we get the latest state after setFormData completes
    setTimeout(() => {
      const currentFormData = formDataRef.current;
      if (Object.keys(variationToggles).length > 0 && categoryVariations.length > 0 && parseFloat(currentFormData.price || "0") > 0) {
        const hasSelectedOptions = categoryVariations.some(variation => 
          variationToggles[variation.id] && currentFormData[variation.id] && currentFormData[variation.id].length > 0
        );
        
        if (hasSelectedOptions) {
          generateAutoVariations(categoryVariations);
        }
      }
    }, 50); // Increased delay to ensure state is updated
  };

  // Auto-generate variations when toggles or price change
  useEffect(() => {
    if (Object.keys(variationToggles).length > 0 && categoryVariations.length > 0 && parseFloat(formData.price || "0") > 0) {
      // Check if any variation options are selected
      const hasSelectedOptions = categoryVariations.some(variation => 
        variationToggles[variation.id] && formData[variation.id] && formData[variation.id].length > 0
      );
      
      if (hasSelectedOptions) {
        generateAutoVariations(categoryVariations);
      }
    }
  }, [variationToggles, categoryVariations, formData.price]);


  const fetchCategoryVariations = async (categoryId: string) => {
    try {
      setLoadingVariations(true);
      const response = await getCategoryVariations(categoryId);

      if (response.success) {
        // Transform API response to our VariationDef format
        const variationDefs = response.data.map((variation: any) => ({
          id: variation.id,
          name: variation.name,
          type: variation.type,
          required: variation.isRequire === "true" || variation.isRequire === true,
          options: (variation.variationOptions || []).map((opt: any) => ({
            name: opt.name,
            value: opt.value,
          })),
        }));

        setCategoryVariations(variationDefs);

        // Initialize toggles - all variations enabled by default
        const initialToggles: Record<string, boolean> = {};
        variationDefs.forEach((variation: VariationDef) => {
          initialToggles[variation.id] = true;
        });
        setVariationToggles(initialToggles);

        // Initialize form data for each variation with empty arrays
        const updates: Record<string, any[]> = {};
        variationDefs.forEach((variation: VariationDef) => {
          updates[variation.id] = [];
        });
        setFormData(prev => ({ ...prev, ...updates }));

        if (!product) {
          // Don't auto-generate until user selects options
        }
      }
    } catch (error) {
      console.error("Error fetching category variations:", error);
      showToast.error("Failed to load category variations");
    } finally {
      setLoadingVariations(false);
    }
  };

  // Helper function to get color code for named colors
  const getColorCode = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      'red': '#FF0000',
      'blue': '#0000FF',
      'green': '#00FF00',
      'yellow': '#FFFF00',
      'orange': '#FFA500',
      'purple': '#800080',
      'pink': '#FFC0CB',
      'black': '#000000',
      'white': '#FFFFFF',
      'gray': '#808080',
      'grey': '#808080',
      'brown': '#A52A2A',
      'navy': '#000080',
      'maroon': '#800000',
      'olive': '#808000',
      'lime': '#00FF00',
      'aqua': '#00FFFF',
      'teal': '#008080',
      'silver': '#C0C0C0',
      'fuchsia': '#FF00FF',
    };
    return colorMap[colorName.toLowerCase()] || '#000000';
  };


  // Form update handlers
  const handleFormChange = (updates: any) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      fetchCategoryVariations(category.id);
    setFormData(prev => ({
      ...prev,
      category: categoryId,
      variations: [],
      attributes: [],
    }));
      setVariationToggles({});
    }
  };

  const handleImageChange = async (file: File) => {
    setUploadingImages(true);
    try {
      const uploadedUrl = await uploadImage(file);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, uploadedUrl]
      }));
      showToast.success("Image uploaded successfully!");
    } catch (error: any) {
      console.error("Error uploading image:", error);
      showToast.error(error.message || "Failed to upload image");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Tag management
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag)
    }));
  };

  // Specification management
  const addSpecification = () => {
    if (specKey.trim() && specValue.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specKey.trim()]: specValue.trim(),
        },
      }));
      setSpecKey("");
      setSpecValue("");
    }
  };

  const removeSpecification = (key: string) => {
    setFormData(prev => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return { ...prev, specifications: newSpecs };
    });
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    coreSaveProduct(true);
  };

  const coreSaveProduct = async (shouldRedirect: boolean) => {
    const validationErrors: string[] = [];

    // Basic validations
    if (!formData.name.trim()) validationErrors.push("Product name is required");
    if (!formData.category) validationErrors.push("Category is required");
    const priceNum = parseFloat(formData.price || "0");
    const discountedNum = parseFloat(formData.discountedPrice || "0");
    const stockNum = parseInt(formData.stock || "0", 10);
    const weightNum = parseFloat(formData.weight || "0");
    const lengthNum = parseFloat(formData.dimensions.length || "0");
    const widthNum = parseFloat(formData.dimensions.width || "0");
    const heightNum = parseFloat(formData.dimensions.height || "0");

    if (priceNum <= 0) validationErrors.push("Price must be greater than 0");
    if (stockNum <= 0) validationErrors.push("Stock must be greater than 0");
    if (formData.images.length === 0) validationErrors.push("At least one product image is required");
    if (!formData.description.trim()) validationErrors.push("Product description is required");
    if (weightNum <= 0) validationErrors.push("Weight must be greater than 0");
    if (lengthNum <= 0) validationErrors.push("Product length must be greater than 0");
    if (widthNum <= 0) validationErrors.push("Product width must be greater than 0");
    if (heightNum <= 0) validationErrors.push("Product height must be greater than 0");

    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => showToast.error(error));
      return;
    }

    setSubmitting(true);

    try {
      // Process images: upload new files and collect all image URLs
      const imageUrls: string[] = [];
      for (const image of formData.images) {
        if (typeof image === "string") {
          imageUrls.push(image);
        } else if (image instanceof File) {
          try {
            const uploadedUrl = await uploadImage(image);
            imageUrls.push(uploadedUrl);
          } catch (uploadError) {
            console.error("Error uploading image:", uploadError);
            showToast.error(`Failed to upload image: ${(uploadError as Error).message}`);
            setSubmitting(false);
            return;
          }
        }
      }

      // Build product variations for backend API
      const productVeriations: any[] = [];

      formData.variations.forEach((variation: any) => {
        // Create variation attributes array
        const productVeriationsAttribute: any[] = [];
        
        // Process each attribute in the variation
        Object.entries(variation.attributes || {}).forEach(([variationId, optionValue]) => {
          // Skip convenience fields that are not actual variation attributes
          if (['color', 'colorCode', 'size', 'stockStatus', 'status', 'length', 'width', 'height', 'shippingMethod'].includes(variationId)) {
            return;
          }
          
          productVeriationsAttribute.push({
            veriationId: variationId,
            key: String(optionValue),
            value: String(optionValue),
          });
        });

        // Create the variation object
        const variationData = {
          name: variation.name,
          sku: variation.sku,
          price: Number(variation.price),
          stock: variation.stock,
          discountedPrice: Number(variation.discountedPrice || 0),
          stockStatus: variation.attributes?.stockStatus || 'instock',
          status: variation.attributes?.status || 'draft',
          weight: Number(variation.weight),
          height: String(variation.attributes?.height || ''),
          width: String(variation.attributes?.width || ''),
          length: String(variation.attributes?.length || ''),
          shippingMethod: variation.attributes?.shippingMethod || 'free',
          images: variation.images || [],
          productVeriationsAttribute: productVeriationsAttribute,
        };

        productVeriations.push(variationData);
      });

      // Build specifications array
      const specification = formData.specifications
        ? Object.entries(formData.specifications).map(([key, value]) => ({
            name: key,
            value: String(value)
          }))
        : [];

      // Build the complete payload for the backend API
      const payload = {
        categoryId: formData.category,
        name: formData.name,
        description: formData.description,
        price: priceNum,
        discountedPrice: discountedNum || 0,
        sku: formData.sku || '',
        stock: stockNum,
        images: imageUrls,
        brand: formData.brand || '',
        tags: formData.tags || [],
        weight: weightNum,
        height: String(lengthNum ? formData.dimensions.height : heightNum),
        width: String(widthNum ? formData.dimensions.width : widthNum),
        length: String(lengthNum ? formData.dimensions.length : lengthNum),
        status: (formData.status || "DRAFT").toUpperCase(),
        productVeriations: productVeriations,
        specification: specification,
        warehouseId: formData.warehouseId || undefined,
      };

      console.log('Sending product data to API:', payload);
      
      if (product?.id) {
        // Update existing product
        await updateProductById(product.id, payload);
        showToast.success("Product updated successfully!");
      } else {
        // Create new product
        await createProduct(payload);
        showToast.success("Product created successfully!");
      }
      
      if (shouldRedirect) {
        navigate('/products');
      }
    } catch (error: any) {
      console.error("Error saving product:", error);
      showToast.error(error.message || "Failed to save product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Memoize the variations mapping to prevent infinite re-renders
  const mappedVariations = useMemo(() => {
    return formData.variations.map(v => ({
      ...v,
      color: v.attributes?.color || '',
      colorCode: v.attributes?.colorCode || '#000000',
      size: v.attributes?.size || '',
      stockStatus: v.attributes?.stockStatus as 'instock' | 'outofstock' || 'instock',
      status: v.attributes?.status as 'draft' | 'published' | 'hidden' || 'draft',
      length: v.attributes?.length ? parseInt(v.attributes.length) : 0,
      width: v.attributes?.width ? parseInt(v.attributes.width) : 0,
      height: v.attributes?.height ? parseInt(v.attributes.height) : 0,
      defaultImage: v.image || '',
      shippingMethod: v.attributes?.shippingMethod as 'free' | 'flat_rate' | 'express' || 'free'
    }));
  }, [formData.variations]);

  // Memoize the variation definitions to prevent unnecessary re-renders
  const enabledVariationDefs = useMemo(() => {
    return categoryVariations.filter(def => variationToggles[def.id]);
  }, [categoryVariations, variationToggles]);

  const tabs = [
    { id: "basic", name: "Basic Info" },
    { id: "variations", name: "Variations" },
    { id: "specifications", name: "Specifications" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-4">
      <div className=" mx-auto">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "basic" | "variations" | "specifications")}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {activeTab === "basic" && (
            <div className="space-y-6">
              {/* Product Images & Basic Info */}
              <div className="flex items-stretch h-full lg:flex-row flex-col  gap-6">
                {/* Product Images - Left Side */}
                <div className="xl:w-[20%] lg:w-[30%]  w-full">
                  <ProductImageUpload
                    images={formData.images}
                    onImageChange={handleImageChange}
                    onRemoveImage={handleRemoveImage}
                    uploading={uploadingImages}
                  />
                </div>

                {/* Basic Information - Right Side */}
                <div className="xl:w-[80%] lg:w-[70%] w-full">
                  <ProductBasicInfo
                    formData={formData}
                    categories={categories}
                    onFormChange={handleFormChange}
                    onCategoryChange={handleCategoryChange}
                  />
                </div>
              </div>

              {/* Category Variations */}
              {loadingVariations && (
                <div className="bg-white rounded-lg shadow-sm border p-6 flex items-center gap-2 text-gray-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading category variations...
                </div>
              )}
              
              {!loadingVariations && categoryVariations && categoryVariations.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Variations</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Select the variation options you want to create for this product. Variations will be automatically generated based on your selections.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryVariations.map((variation) => (
                      <div key={variation.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-medium text-gray-900">{variation.name}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={variationToggles[variation.id] || false}
                              onChange={() =>
                                setVariationToggles((prev) => ({
                                  ...prev,
                                  [variation.id]: !prev[variation.id],
                                }))
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        {variationToggles[variation.id] && variation.options?.length > 0 && (
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData[variation.id]?.length === variation.options.length}
                                onChange={() => {
                                  const allSelected = formData[variation.id]?.length === variation.options.length;
                                  if (allSelected) {
                                    setFormData((prev) => ({ ...prev, [variation.id]: [] }));
                                  } else {
                                    const allValues = variation.options.map((opt: { value: string }) => opt.value);
                                    setFormData((prev) => ({ ...prev, [variation.id]: allValues }));
                                  }
                                  // Trigger variation generation after a short delay to allow state update
                                  setTimeout(() => triggerVariationGeneration(), 100);
                                }}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <label className="ml-2 text-sm font-medium text-gray-700">
                                Select All
                              </label>
                            </div>

                            <div className="max-h-48 overflow-y-auto">
                              <div className="grid grid-cols-1 gap-2">
                              {variation.options.map((opt: { name: string; value: string }, index: number) => {
                                  const val = opt.value;
                                const isSelected = formData[variation.id]?.includes(val);

                                return (
                                  <div
                                    key={index}
                                      className={`p-2 border rounded cursor-pointer transition-all ${isSelected
                                        ? "bg-blue-100 border-blue-500 text-blue-700"
                                        : "border-gray-300 hover:border-gray-400"
                                      }`}
                                    onClick={() => {
                                      const current = formData[variation.id] || [];
                                      setFormData((prev) => ({
                                        ...prev,
                                        [variation.id]: current.includes(val)
                                          ? current.filter((v: string) => v !== val)
                                          : [...current, val],
                                      }));
                                      // Trigger variation generation after a short delay to allow state update
                                      setTimeout(() => triggerVariationGeneration(), 100);
                                    }}
                                  >
                                    {variation.type === "color" ? (
                                        <div className="flex items-center space-x-2">
                                        <div
                                            className="w-5 h-5 rounded-full border-2 border-gray-300"
                                          style={{ backgroundColor: opt.value }}
                                        />
                                          <span className="text-sm">{opt.name}</span>
                                      </div>
                                    ) : (
                                        <div className="text-center">
                                      <span className="text-sm">{opt.name}</span>
                                        </div>
                                    )}
                                  </div>
                                );
                              })}
                              </div>
                            </div>

                            {/* Show selection count */}
                            <div className="text-xs text-gray-500 mt-2">
                              {formData[variation.id]?.length || 0} of {variation.options.length} selected
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Show variation count preview */}
                  {Object.keys(variationToggles).some(key => variationToggles[key] && formData[key]?.length > 0) && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Variation Preview</h4>
                      <p className="text-sm text-blue-700">
                        {categoryVariations
                          .filter(v => variationToggles[v.id] && formData[v.id]?.length > 0)
                          .reduce((total, variation) => total * (formData[variation.id]?.length || 0), 1)} 
                        {" "}variations will be created based on your current selection.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Inventory & Shipping */}
              <ProductInventoryShipping
                formData={formData}
                onFormChange={handleFormChange}
                warehouses={warehouses}
              />

              {/* Tags */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
                <div className="space-y-3">
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          {tag}
                          <button
                            type="button"
                            className="ml-2 text-blue-600 hover:text-blue-800"
                            onClick={() => removeTag(tag)}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Type tags and press Enter to add"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "variations" && (
            <ProductVariations 
              variations={mappedVariations}
              onChange={(variations) => setFormData(prev => ({ 
                ...prev, 
                variations: variations.map(v => ({
                  id: v.id,
                  name: v.name,
                  sku: v.sku,
                  price: v.price,
                  discountedPrice: v.discountedPrice,
                  stock: v.stock,
                  weight: v.weight,
                  attributes: {
                    ...v.attributes,
                    color: v.color || '',
                    colorCode: v.colorCode || '',
                    size: v.size || '',
                    stockStatus: v.stockStatus || 'instock',
                    status: v.status || 'draft',
                    length: v.length?.toString() || '0',
                    width: v.width?.toString() || '0',
                    height: v.height?.toString() || '0',
                    shippingMethod: v.shippingMethod || 'free'
                  },
                  image: v.defaultImage,
                  isActive: v.isActive
                }))
              }))}
              variationDefs={enabledVariationDefs}
              uploadingImages={uploadingVariationImages}
              onUploadingChange={setUploadingVariationImages}
              productId={product?.id}
            />
          )}

          {activeTab === "specifications" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Product Specifications
                </h3>

                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Specification name"
                    value={specKey}
                    onChange={(e) => setSpecKey(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white shadow-sm"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={specValue}
                    onChange={(e) => setSpecValue(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white shadow-sm"
                  />
                  <Button
                    type="button"
                    onClick={addSpecification}
                    icon={Plus}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Add
                  </Button>
                </div>

                <div className="space-y-2">
                  {Object.entries(formData.specifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                    >
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">{key}:</span>
                        <span className="ml-2 text-gray-600">{value}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        icon={X}
                        onClick={() => removeSpecification(key)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>

                {Object.keys(formData.specifications).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>
                      No specifications added yet. Add some to provide more product details.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/products")}
                disabled={submitting}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={submitting}
                onClick={() => coreSaveProduct(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Save & Add Another
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Product"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}