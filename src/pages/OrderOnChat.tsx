import React, { useState, useRef } from "react";
import { Order, Product } from "../types";
import { mockProducts } from "../data/mockData";
import {
  ChatList,
  ChatWindow,
  CreateOrderModal,
  OrderDetailsModal,
  Chat,
  Message,
  OrderForm,
} from "../components/orderonchat";


// Mock chat data with dates
const mockChats: Chat[] = [
  {
    id: "chat-1",
    customerName: "Ali Raza",
    customerPhone: "+92 300 1234567",
    customerEmail: "ali.raza@example.com",
    status: "active",
    lastMessage: "Kya aapke pass wireless headphones available hain?",
    lastMessageTime: "2:30 PM",
    unreadCount: 2,
    assignedStaff: "Alice Brown",
    startDate: "2024-01-15",
    messages: [
      {
        id: "msg-1",
        text: "Assalam-o-alaikum! Kya aapke pass wireless headphones available hain?",
        sender: "customer",
        timestamp: "2:25 PM",
        type: "text",
      },
      {
        id: "msg-2",
        text: "Ji bilkul! Humare pass TechPro wireless headphones available hain. Price ₹1299 hai.",
        sender: "staff",
        timestamp: "2:28 PM",
        type: "text",
      },
      {
        id: "msg-3",
        text: "Kya aapke pass wireless headphones available hain?",
        sender: "customer",
        timestamp: "2:30 PM",
        type: "text",
      },
    ],
  },
  {
    id: "chat-2",
    customerName: "Sara Khan",
    customerPhone: "+92 301 2345678",
    customerEmail: "sara.khan@example.com",
    status: "active",
    lastMessage: "Order confirm ho gaya hai",
    lastMessageTime: "1:45 PM",
    unreadCount: 0,
    assignedStaff: "Bob Smith",
    startDate: "2024-01-14",
    messages: [
      {
        id: "msg-4",
        text: "Mera order kab deliver hoga?",
        sender: "customer",
        timestamp: "1:40 PM",
        type: "text",
      },
      {
        id: "msg-5",
        text: "Aapka order confirm ho gaya hai. 2-3 din me deliver ho jayega.",
        sender: "staff",
        timestamp: "1:45 PM",
        type: "text",
      },
    ],
  },
  {
    id: "chat-3",
    customerName: "Bilal Ahmed",
    customerPhone: "+92 302 3456789",
    customerEmail: "bilal.ahmed@example.com",
    status: "closed",
    lastMessage: "Thank you!",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    assignedStaff: "Carol White",
    startDate: "2024-01-10",
    messages: [
      {
        id: "msg-6",
        text: "Thank you!",
        sender: "customer",
        timestamp: "Yesterday",
        type: "text",
      },
    ],
  },
  {
    id: "chat-4",
    customerName: "Fatima Noor",
    customerPhone: "+92 303 4567890",
    customerEmail: "fatima.noor@example.com",
    status: "closed",
    lastMessage: "Order delivered successfully",
    lastMessageTime: "2 days ago",
    unreadCount: 0,
    assignedStaff: "David Lee",
    startDate: "2024-01-08",
    messages: [
      {
        id: "msg-7",
        text: "Order delivered successfully",
        sender: "staff",
        timestamp: "2 days ago",
        type: "text",
      },
    ],
  },
];

export default function OrderOnChat() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(mockChats[0]);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"active" | "closed">("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);
  const [orderForm, setOrderForm] = useState<OrderForm>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Pakistan",
    },
    selectedProducts: [],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter chats based on tab, search, and date
  const filteredChats = mockChats.filter((chat) => {
    const matchesTab = chat.status === activeTab;
    const matchesSearch =
      chat.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const chatDate = new Date(chat.startDate);
    const matchesStartDate = !startDate || chatDate >= new Date(startDate);
    const matchesEndDate = !endDate || chatDate <= new Date(endDate);

    return matchesTab && matchesSearch && matchesStartDate && matchesEndDate;
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "staff",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "text",
    };

    selectedChat.messages.push(message);
    selectedChat.lastMessage = newMessage;
    selectedChat.lastMessageTime = message.timestamp;
    selectedChat.unreadCount = 0;

    setNewMessage("");
    setSelectedChat({ ...selectedChat });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedChat) return;

    const message: Message = {
      id: Date.now().toString(),
      text: `Sent ${file.name}`,
      sender: "staff",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: file.type.startsWith("image/") ? "image" : "document",
      fileUrl: URL.createObjectURL(file),
      fileName: file.name,
    };

    selectedChat.messages.push(message);
    selectedChat.lastMessage = `Sent ${file.name}`;
    selectedChat.lastMessageTime = message.timestamp;

    setSelectedChat({ ...selectedChat });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEndChat = () => {
    if (!selectedChat) return;

    selectedChat.status = "closed";
    selectedChat.lastMessage = "Chat ended by staff";
    selectedChat.lastMessageTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setSelectedChat({ ...selectedChat });
  };

  const handleCreateOrder = () => {
    if (!selectedChat) return;

    setOrderForm({
      customerName: selectedChat.customerName,
      customerEmail: selectedChat.customerEmail,
      customerPhone: selectedChat.customerPhone,
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "Pakistan",
      },
      selectedProducts: [],
    });
    setShowCreateOrderModal(true);
  };

  const handleAddProduct = (product: Product) => {
    const existingProduct = orderForm.selectedProducts.find(
      (p) => p.product.id === product.id
    );

    if (existingProduct) {
      setOrderForm({
        ...orderForm,
        selectedProducts: orderForm.selectedProducts.map((p) =>
          p.product.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        ),
      });
    } else {
      setOrderForm({
        ...orderForm,
        selectedProducts: [
          ...orderForm.selectedProducts,
          { product, quantity: 1 },
        ],
      });
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setOrderForm({
      ...orderForm,
      selectedProducts: orderForm.selectedProducts.filter(
        (p) => p.product.id !== productId
      ),
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveProduct(productId);
      return;
    }

    setOrderForm({
      ...orderForm,
      selectedProducts: orderForm.selectedProducts.map((p) =>
        p.product.id === productId ? { ...p, quantity } : p
      ),
    });
  };

  const handlePlaceOrder = () => {
    if (orderForm.selectedProducts.length === 0) return;

    const total = orderForm.selectedProducts.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      customerName: orderForm.customerName,
      customerEmail: orderForm.customerEmail,
      customerPhone: orderForm.customerPhone,
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
      total: total,
      subtotal: total,
      shipping: 0,
      tax: 0,
      discount: 0,
      refunded: 0,
      earning: total,
      items: orderForm.selectedProducts.map((item) => ({
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        tax: 0,
        image: typeof item.product.image === "string" ? item.product.image : "",
      })),
      billingAddress: {
        name: orderForm.customerName,
        address: orderForm.address.street,
        city: orderForm.address.city,
        state: orderForm.address.state,
        zipCode: orderForm.address.zipCode,
        country: orderForm.address.country,
        phone: orderForm.customerPhone,
      },
      shippingAddress: {
        name: orderForm.customerName,
        address: orderForm.address.street,
        city: orderForm.address.city,
        state: orderForm.address.state,
        zipCode: orderForm.address.zipCode,
        country: orderForm.address.country,
        phone: orderForm.customerPhone,
      },
    };

    // Add order message to chat
    const orderMessage: Message = {
      id: Date.now().toString(),
      text: `Order created: ${newOrder.id}`,
      sender: "staff",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "order",
      orderData: newOrder,
    };

    selectedChat!.messages.push(orderMessage);
    selectedChat!.lastMessage = `Order created: ${newOrder.id}`;
    selectedChat!.lastMessageTime = orderMessage.timestamp;

    setSelectedOrder(newOrder);
    setShowOrderModal(true);
    setShowCreateOrderModal(false);
    setSelectedChat({ ...selectedChat! });
  };


  return (
    <div className="h-screen flex overflow-hidden">
      <ChatList
        chats={filteredChats}
        selectedChat={selectedChat}
        activeTab={activeTab}
        searchTerm={searchTerm}
        startDate={startDate}
        endDate={endDate}
        onChatSelect={setSelectedChat}
        onTabChange={setActiveTab}
        onSearchChange={setSearchTerm}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />

      <ChatWindow
        selectedChat={selectedChat}
        newMessage={newMessage}
        onMessageChange={setNewMessage}
        onSendMessage={handleSendMessage}
        onFileUpload={handleFileUpload}
        onEndChat={handleEndChat}
        onCreateOrder={handleCreateOrder}
        onOrderClick={(order) => {
          setSelectedOrder(order);
          setShowOrderModal(true);
        }}
        fileInputRef={fileInputRef}
      />

      <CreateOrderModal
        isOpen={showCreateOrderModal}
        onClose={() => setShowCreateOrderModal(false)}
        orderForm={orderForm}
        onOrderFormChange={setOrderForm}
        onAddProduct={handleAddProduct}
        onRemoveProduct={handleRemoveProduct}
        onUpdateQuantity={handleUpdateQuantity}
        onPlaceOrder={handlePlaceOrder}
        products={mockProducts}
      />

      <OrderDetailsModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        selectedOrder={selectedOrder}
        onProcessOrder={() => console.log("Process order")}
      />
    </div>
  );
}
