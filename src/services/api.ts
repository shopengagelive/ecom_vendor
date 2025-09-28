import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { getCookie, removeCookie } from '../utils/cookies';

// Create axios instance with base URL from environment variable
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://multi-vendor-backend-production.up.railway.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token from cookie
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getCookie('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear all auth data
      removeCookie('authToken');
      removeCookie('userData');

      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API functions
export const registerVendor = async (vendorData: any) => {
  try {
    const response = await apiClient.post('/vendor/register', vendorData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchVendorStatus = async (vendorId: string) => {
  try {
    const response = await apiClient.get(`/vendor/status/${vendorId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// // Variations API functions
// export const fetchVariations = async (page: number = 1, limit: number = 10) => {
//   try {
//     const response = await apiClient.get(`/vendor/variations?page=${page}&limit=${limit}`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };
// Variations API functions
export const fetchVariations = async (page: number = 1, limit: number = 5) => {
  try {
    const response = await apiClient.get(`/vendor/variations?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const fetchVariationById = async (id: string) => {
  try {
    const response = await apiClient.get(`/vendor/variations/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createVariation = async (variationData: any) => {
  try {
    const response = await apiClient.post('/vendor/variations', variationData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateVariation = async (id: string, variationData: any) => {
  try {
    const response = await apiClient.put(`/vendor/variations/${id}`, variationData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteVariation = async (id: string) => {
  try {
    const response = await apiClient.delete(`/vendor/variations/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const linkVariationCategories = async (id: string, categories: string[]) => {
  try {
    const response = await apiClient.patch(`/vendor/variations/${id}/categories`, {
      categories: categories
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Categories API functions
export const fetchActiveCategories = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await apiClient.get(`/vendor/categories/active?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchCategoryById = async (id: string) => {
  try {
    const response = await apiClient.get(`/vendor/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Product APIs
export const createProduct = async (productData: any) => {
  try {
    const response = await apiClient.post('/vendor/products', productData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create product');
  }
};

export const updateProductById = async (id: string, productData: any) => {
  try {
    const response = await apiClient.put(`/vendor/products/${id}`, productData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update product');
  }
};

// Image upload API
export const uploadImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/user/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data?.success && response.data?.data?.url) {
      return response.data.data.url;
    } else {
      throw new Error(response.data?.message || 'Image upload failed');
    }
  } catch (error: any) {
    console.error('Image upload error:', error);
    throw new Error(error.response?.data?.message || 'Failed to upload image');
  }
};

// Document upload API
export const uploadDocument = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/user/upload/document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data?.success && response.data?.data?.url) {
      return response.data.data.url;
    } else {
      throw new Error(response.data?.message || 'Document upload failed');
    }
  } catch (error: any) {
    console.error('Document upload error:', error);
    throw new Error(error.response?.data?.message || 'Failed to upload Document');
  }
};

// Multiple images upload API
export const uploadMultipleImages = async (files: File[]): Promise<string[]> => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file); // Remove template literal, use direct string
    });

    console.log('Uploading multiple images:', files.length, 'files');

    const response = await apiClient.post('/user/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Upload response:', response.data);

    if (response.data?.success && response.data?.data?.urls) {
      return response.data.data.urls;
    } else {
      throw new Error(response.data?.message || 'Images upload failed');
    }
  } catch (error: any) {
    console.error('Multiple images upload error:', error);
    console.error('Error response:', error.response?.data);

    // Fallback: Upload images one by one
    console.log('Falling back to individual uploads...');
    try {
      const urls: string[] = [];
      for (const file of files) {
        const url = await uploadImage(file);
        urls.push(url);
      }
      console.log('Fallback upload successful:', urls.length, 'images');
      return urls;
    } catch (fallbackError: any) {
      console.error('Fallback upload also failed:', fallbackError);
      throw new Error(error.response?.data?.message || 'Failed to upload images');
    }
  }
};


export const getProducts = async (params: {
  page?: number;
  limit?: number;
  status?: string;
  categoryId?: string;
  search?: string;
  visibility?: string;
  minPrice?: number;
  maxPrice?: number;
  minStock?: number;
  maxStock?: number;
  minWeight?: number;
  maxWeight?: number;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: string;
} = {}) => {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });

    const response = await apiClient.get(`/vendor/products?${queryParams.toString()}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
};

export const getProduct = async (id: string) => {
  try {
    const response = await apiClient.get(`/vendor/products/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch product');
  }
};

export const getProductById = async (productId: string) => {
  try {
    const response = await apiClient.get(`/vendor/products/${productId}?includeInactive=true`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch product');
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const response = await apiClient.delete(`/vendor/products/${productId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete product');
  }
};

// Bulk operations
export const bulkUpdateProductStatus = async (productIds: string[], status: string) => {
  try {
    const response = await apiClient.patch('/vendor/products/bulk/status', {
      productIds,
      status
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update product status');
  }
};

export const bulkToggleProductVisibility = async (productIds: string[]) => {
  try {
    const response = await apiClient.patch('/vendor/products/bulk/visibility', {
      productIds
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to toggle product visibility');
  }
};

export const bulkDeleteProducts = async (productIds: string[]) => {
  try {
    const response = await apiClient.delete('/vendor/products/bulk', {
      data: { productIds }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete products');
  }
};

// Product Variation APIs
export const addProductVariations = async (productId: string, variations: any[]) => {
  try {
    const response = await apiClient.post(`/vendor/products/${productId}/variations`, { variations });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to add product variations');
  }
};

export const updateProductVariation = async (productId: string, variationId: string, data: any) => {
  try {
    const response = await apiClient.put(`/vendor/products/${productId}/variations/${variationId}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update product variation');
  }
};

export const deleteProductVariation = async (productId: string, variationId: string) => {
  try {
    const response = await apiClient.delete(`/vendor/products/${productId}/variations/${variationId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete product variation');
  }
};

export const updateProductStatus = async (productId: string, status: string) => {
  try {
    const response = await apiClient.patch(`/vendor/products/${productId}/status`, { status });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update product status');
  }
};

export const toggleProductVisibility = async (productId: string, status: string) => {
  try {
    const response = await apiClient.patch(`/vendor/products/${productId}/visibility`, { status });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to toggle product visibility');
  }
};

export const getCategoryVariations = async (categoryId: string) => {
  try {
    const response = await apiClient.get(`/vendor/categories/${categoryId}/variations`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch category variations');
  }
};

export const getActiveCategories = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await apiClient.get(`/vendor/categories/active?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch active categories');
  }
};

export const getAllCategories = async () => {
  try {
    const response = await apiClient.get(`/vendor/categories/all`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch active categories');
  }
};


export const createStore = async (storeData: any) => {
  try {
    const response = await apiClient.post("/vendor/store", storeData);
    return response.data; // backend se jo bhi response mile
  } catch (error: any) {
    throw error.response?.data || error.message || "Failed to create store";
  }
};

export const createMethod = async (data: any) => {
  try {
    const response = await apiClient.post("/vendor/shipping-methods", data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message || "Failed to create method";
  }
};

export const deleteMethod = async (methodId: string) => {
  try {
    const response = await apiClient.delete(`/vendor/shipping-methods/${methodId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete method');
  }
};

export const updateZoneMethod = async (
  methodId: string,
  data: any
) => {
  try {
    const response = await apiClient.put(`/vendor/shipping-methods/${methodId}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update method');
  }
};

export const getSingleMethod = async (id: string) => {
  try {
    const response = await apiClient.get(`/vendor/zones/${id}/shipping-methods`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message || "Failed to get method";
  }
};

export const getZoneMethods = async (id: string) => {
  try {
    const response = await apiClient.get(`/vendor/shipping-methods/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message || "Failed to get methods";
  }
};



export const getStore = async () => {
  try {
    const response = await apiClient.get("/vendor/store");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message || "Failed to get store";
  }
};

export const checkUserNameAvailbility = async (username: string) => {
  try {
    const response = await apiClient.get(`/vendor/store/username/availability?userName=${username}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message || "Failed to check username availbility";
  }
};

export const updateStore = async (
  storeId: string,
  data: any
) => {
  try {
    const response = await apiClient.put(`/vendor/store/${storeId}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update store');
  }
};



export const deleteStore = async (storeId: string) => {
  try {
    const response = await apiClient.delete(`/vendor/store/${storeId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete store');
  }
};

// Warehouses API
export const fetchWarehouses = async () => {
  try {
    const response = await apiClient.get('/vendor/warehouses');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch warehouses');
  }
};

export const createWarehouse = async (data: {
  name: string;
  address: string;
  postCode: string;
  city: string;
  state: string;
}) => {
  try {
    const response = await apiClient.post('/vendor/warehouses', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create warehouse');
  }
};

export const updateWarehouse = async (
  warehouseId: string,
  data: {
    name?: string;
    address?: string;
    postCode?: string;
    city?: string;
    state?: string;
  }
) => {
  try {
    const response = await apiClient.put(`/vendor/warehouses/${warehouseId}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update warehouse');
  }
};

export const deleteWarehouse = async (warehouseId: string) => {
  try {
    const response = await apiClient.delete(`/vendor/warehouses/${warehouseId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete warehouse');
  }
};


export const getShippingSetups = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await apiClient.get(`/vendor/shipping-providers?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch active Shiping setups');
  }
};

export const getShippingSetupsMinimals = async () => {
  try {
    const response = await apiClient.get(`/vendor/shipping-providers`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch Shiping setups');
  }
};

export const toggleShippingSetup = async (id: string) => {
  try {
    const response = await apiClient.patch(`/vendor/shipping-providers/${id}/toggle-status`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to udpate the status');
  }
};

export const deleteShippingSetup = async (id: string) => {
  try {
    const response = await apiClient.delete(`/vendor/shipping-providers/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete the status');
  }
};

export const createShippingSetup = async (data: {
  providerName: string;
  trackingUrl: string;
  prefix: string;
}) => {
  try {
    const response = await apiClient.post('/vendor/shipping-providers', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create ShippingSetup');
  }
};

export const updateShippingSetup = async (id: string, data: {
  providerName?: string;
  trackingUrl?: string;
  prefix?: string;
}) => {
  try {
    const response = await apiClient.put(`/vendor/shipping-providers/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update ShippingSetup');
  }
};

export const getShippingSetup = async () => {
  try {
    const response = await apiClient.get(`/vendor/shipping-type`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch Shiping type');
  }
};

export const createShippingInformation = async (data: {
  policy: string;
  isCheck: boolean;
}) => {
  try {
    const response = await apiClient.post('/vendor/shipping-policies', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create Shipping Information');
  }
};

export const deleteShippingInformation = async (id: string) => {
  try {
    const response = await apiClient.delete(`/vendor/shipping-policies/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete the Shipping Information');
  }
};

export const updateShippingInformation = async (id: string, data: {
  policy?: string;
  isCheck: boolean;
}) => {
  try {
    const response = await apiClient.put(`/vendor/shipping-policies/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update Shipping Information');
  }
};

export const getShippingInformation = async () => {
  try {
    const response = await apiClient.get(`/vendor/shipping-policies`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch Shiping information');
  }
};

export const updateShippingMode = async (data: {
  shippingType?: string;
}) => {
  try {
    const response = await apiClient.put(`/vendor/shipping-type`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update Shipping Mode');
  }
};


export const createShippingZone = async (data: {
  zoneName: string;
  country: string;
  state: string[];
  restrictedPin: string[];
}) => {
  try {
    const response = await apiClient.post('/vendor/zones', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create Shipping zone');
  }
};

export const updateShippingZone = async (id: string, data: {
  zoneName?: string;
  country?: string;
  state?: string[];
  restrictedPin?: string[];
}) => {
  try {
    const response = await apiClient.put(`/vendor/zones/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update Shipping zone');
  }
};

export const getShippingZone = async () => {
  try {
    const response = await apiClient.get(`/vendor/zones`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch Shiping zones');
  }
};

export const getSingleShippingZone = async (id: string) => {
  try {
    const response = await apiClient.get(`/vendor/zones/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch Shiping zone');
  }
};

export const deleteShippingZone = async (id: string) => {
  try {
    const response = await apiClient.delete(`/vendor/zones/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete the zones');
  }
};


export const getShippingMethods = async (id: string) => {
  try {
    const response = await apiClient.get(`/vendor/zones/${id}/shipping-methods`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch Shiping mthods');
  }
};



export const getVerificationDocumnets = async () => {
  try {
    const response = await apiClient.get(`/vendor/store-documents`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch Verification Documnets');
  }
};

export const createVerificationDocumnet = async (data: {
  documentType: string;
  fileUrl: string;
}) => {
  try {
    const response = await apiClient.post('/vendor/store-documents', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create Verification Documnet');
  }
};

export const updateVerificationDocumnet = async (id: string, data: {
  documentType?: string;
  fileUrl?: string;
}) => {
  try {
    const response = await apiClient.put(`/vendor/store-documents/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update Verification Documnet');
  }
};

export const deleteVerificationDocumnet = async (id: string) => {
  try {
    const response = await apiClient.delete(`/vendor/store-documents/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete the Verification Documnet');
  }
};

export const getSingleVerificationDocumnet = async (id: string) => {
  try {
    const response = await apiClient.get(`/vendor/store-documents/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch Verification Documnet');
  }
};

export { apiClient };

// Reviews API
export const fetchVendorReviews = async (params: {
  page?: number;
  limit?: number;
  minRating?: number;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: string;
} = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });
    const response = await apiClient.get(`/vendor/reviews?${queryParams.toString()}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
  }
};
