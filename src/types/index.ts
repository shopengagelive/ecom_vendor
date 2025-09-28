export interface Product {
  id: string;
  name: string;
  images: (string | File)[]; // Changed from single image to array of images
  stock: number;
  price: number;
  discountedPrice?: number;
  status: "Online" | "Draft";
  visibility: "Visible" | "Hidden";
  category: string;
  brand?: string;
  tags?: string[];
  publishedDate?: string;
  createdDate: string;
  updatedDate: string;
  attributes?: ProductAttribute[];
  variations?: ProductVariation[];
  sku?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  description?: string;
  specifications?: Record<string, string>;
}

export interface ProductAttribute {
  id: string;
  name: string;
  value: string;
  type: "text" | "number" | "select" | "boolean" | "color" | "size";
  required: boolean;
  options?: string[];
}

export interface ProductVariation {
  id: string;
  name: string;
  sku: string;
  price: number;
  discountedPrice?: number;
  stock: number;
  attributes: Record<string, string>;
  image?: string;
  images?: string[]; // Added for multiple images support
  weight?: number;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  attributes: ProductAttribute[];
  variations: {
    name: string;
    type: "color" | "size" | "material" | "style" | "custom";
    options: string[];
  }[];
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerIP?: string;
  status:
    | "Pending"
    | "Processing"
    | "Shipped"
    | "Delivered"
    | "Cancelled"
    | "Failed"
    | "Refund";
  date: string;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  refunded: number;
  earning: number;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
    tax: number;
    image?: string;
  }>;
  billingAddress?: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  shippingAddress?: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  notes?: Array<{
    id: string;
    text: string;
    date: string;
    isCustomerNote?: boolean;
  }>;
  shipments?: Array<{
    id: string;
    trackingNumber?: string;
    status: string;
    date: string;
  }>;
}

export interface PayoutRecord {
  id: string;
  date: string;
  amount: number;
  status: "Completed" | "Pending" | "Failed";
  method: string;
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
}

export interface VendorProfile {
  name: string;
  email: string;
  storeName: string;
  address: string;
  phone: string;
  description: string;
  logo?: string;
}

export interface Stream {
  id: string;
  title: string;
  streamer: string;
  viewers: number;
  status: "Live" | "Ended";
  thumbnail: string;
  startTime: string;
  endTime: string | null;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
  avatar?: string;
}

export interface Follower {
  id: string;
  name: string;
  email: string;
  followDate: string;
  profilePic: string;
  mobileNumber?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  storeOrdersCount: number;
  totalOrdersCount: number;
}
