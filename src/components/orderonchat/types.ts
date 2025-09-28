/* =========================
   OrderOnChat Types
========================= */

export interface Chat {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  status: "active" | "closed";
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  assignedStaff?: string;
  messages: Message[];
  startDate: string;
}

export interface Message {
  id: string;
  text: string;
  sender: "customer" | "staff";
  timestamp: string;
  type: "text" | "order" | "image" | "document";
  orderData?: any; // Order type
  fileUrl?: string;
  fileName?: string;
}

export interface OrderForm {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  selectedProducts: Array<{ product: any; quantity: number }>; // Product type
}

export interface ChatListProps {
  chats: Chat[];
  selectedChat: Chat | null;
  activeTab: "active" | "closed";
  searchTerm: string;
  startDate: string;
  endDate: string;
  onChatSelect: (chat: Chat) => void;
  onTabChange: (tab: "active" | "closed") => void;
  onSearchChange: (term: string) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export interface ChatWindowProps {
  selectedChat: Chat | null;
  newMessage: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEndChat: () => void;
  onCreateOrder: () => void;
  onOrderClick: (order: any) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderForm: OrderForm;
  onOrderFormChange: (form: OrderForm) => void;
  onAddProduct: (product: any) => void;
  onRemoveProduct: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onPlaceOrder: () => void;
  products: any[];
}

export interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOrder: any | null;
  onProcessOrder: () => void;
}
