export interface CreateOrderFormData {
  // Customer Details
  mobileNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  
  // Addresses
  shippingAddress: Address;
  billingAddress: Address;
  copyBillingToShipping: boolean;
  
  // Products
  products: OrderProduct[];
  
  // Pricing
  couponCode: string;
  totalDiscount: number;
  shippingCharges: number;
  bankDiscount: number;
  couponDiscount: number;
  
  // Payment
  paymentMode: 'cod' | 'payment-link' | 'qr';
}

export interface Address {
  address: string;
  city?: string;
  state?: string;
  country?: string;
  pinCode?: string;
}

export interface OrderProduct {
  id: string;
  productCode: string;
  productName: string;
  price: number;
  quantity: number;
  total: number;
}

export interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (orderData: CreateOrderFormData) => void;
}

export interface ProductSearchProps {
  onAddProduct: (product: OrderProduct) => void;
}

export interface ProductQuantityProps {
  product: OrderProduct;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveProduct: (productId: string) => void;
}

