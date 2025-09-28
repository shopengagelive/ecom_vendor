import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import ProductModal from "../components/products/ProductModal";
import { Product } from "../types";
import { createProduct, updateProductById, getActiveCategories, uploadImage, getProduct, getAllCategories } from "../services/api";
import { showToast } from "../utils/toast";
import { useState, useEffect } from "react";
import Button from "../components/ui/Button"; // Import Button component

export default function AddEditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const productId = id || searchParams.get('id');

    if (productId) {
      // Fetch existing product for editing
      fetchProduct(productId);
    } else {
      setProduct(undefined); // For adding a new product
    }

    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        console.log(res)
        if (res.success) {
          setCategories(res.data); // Corrected to access the 'data' property
        } else {
          showToast.error("Failed to fetch categories.");
        }
      } catch (error: any) {
        console.error("Error fetching categories:", error);
        showToast.error(error.message || "Failed to fetch categories.");
      }
    };
    fetchCategories();
  }, [id, searchParams]);

  const fetchProduct = async (productId: string) => {
    setLoading(true);
    try {
      const response = await getProduct(productId);
      if (response.success) {
        const productData = response.data;

        // Transform the API response to match our Product interface
        const transformedProduct: Product = {
          id: productData.id,
          name: productData.name,
          images: productData.images || [],
          stock: productData.stock || 0,
          price: productData.price || 0,
          discountedPrice: productData.discountedPrice || 0,
          status: productData.status === 'ACTIVE' ? 'Online' : 'Draft',
          visibility: productData.isVisible ? 'Visible' : 'Hidden',
          category: productData.category?.name || productData.categoryId || '',
          tags: productData.tags || [],
          publishedDate: productData.publishedDate || productData.createdAt,
          createdDate: productData.createdAt,
          updatedDate: productData.updatedAt,
          sku: productData.sku || '',
          weight: productData.weight || 0.1,
          dimensions: {
            length: productData.length ? parseFloat(productData.length) : 1,
            width: productData.width ? parseFloat(productData.width) : 1,
            height: productData.height ? parseFloat(productData.height) : 1,
          },
          description: productData.description || '',
          specifications: productData.specification?.reduce((acc: any, spec: any) => {
            acc[spec.name] = spec.value;
            return acc;
          }, {}) || {},
          attributes: productData.attributes || [],
          variations: productData.productVeriations?.map((variation: any) => ({
            id: variation.id,
            name: variation.name,
            sku: variation.sku,
            price: variation.price,
            discountedPrice: variation.discountedPrice || 0,
            stock: variation.stock,
            weight: variation.weight,
            attributes: variation.productVeriationAttributes?.reduce((acc: any, attr: any) => {
              acc[attr.veriationId] = attr.value;
              return acc;
            }, {}) || {},
            image: variation.images?.[0] || '',
            isActive: variation.status === 'ACTIVE'
          })) || [],
        };

        setProduct(transformedProduct);
      } else {
        showToast.error("Failed to fetch product details.");
        navigate('/products');
      }
    } catch (error: any) {
      console.error("Error fetching product:", error);
      showToast.error(error.message || "Failed to fetch product details.");
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (
    productData: Omit<Product, "id"> & { categoryVariations?: any[] }
  ) => {
    try {
      const imagesToUpload = productData.images.filter(
        (image) => typeof image !== "string"
      );
      const imageUrls: string[] = [];

      for (const imageFile of imagesToUpload) {
        const uploadRes = await uploadImage(imageFile as File);
        imageUrls.push(uploadRes);
      }

      const finalImages = [
        ...productData.images.filter((image) => typeof image === "string"),
        ...imageUrls,
      ];

      const payload = {
        ...productData,
        images: finalImages,
      };

      if (id) {
        await updateProductById(id, payload);
        showToast.success("Product updated successfully!");
      } else {
        await createProduct(payload);
        showToast.success("Product created successfully!");
      }
      navigate("/products"); // Navigate back to product list after save
    } catch (error: any) {
      console.error("Error saving product:", error);
      showToast.error(error.message || "Failed to save product.");
    }
  };

  const handleCloseModal = () => {
    navigate("/products"); // Navigate back to product list if modal is "closed"
  };

  if (loading) {
    return (
      <div className="container mx-auto py-2">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-2">
      <div className="flex justify-between items-center ">
        <h1 className="text-3xl font-bold text-gray-900">
          {(id || searchParams.get('id')) ? "Edit Product" : "Add Product"}
        </h1>
        <div className=" flex justify-center items-center gap-4">

          <Button variant="secondary" onClick={handleCloseModal}>
            Back
          </Button>
        </div>
      </div>
      <ProductModal
        product={product}
        categories={categories}
      />
    </div>
  );
}
