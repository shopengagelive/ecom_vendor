import React from "react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { Phone, Mail, Plus, Send, Paperclip, FileText, MessageCircle } from "lucide-react";
import { ChatWindowProps } from "./types";

export default function ChatWindow({
  selectedChat,
  newMessage,
  onMessageChange,
  onSendMessage,
  onFileUpload,
  onEndChat,
  onCreateOrder,
  onOrderClick,
  fileInputRef,
}: ChatWindowProps) {
  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No chat selected
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Select a chat from the list to start messaging.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {selectedChat.customerName.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedChat.customerName}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {selectedChat.customerPhone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {selectedChat.customerEmail}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant={
                selectedChat.status === "active" ? "success" : "default"
              }
            >
              {selectedChat.status === "active" ? "Active" : "Closed"}
            </Badge>
            {selectedChat.status === "active" && (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onCreateOrder}
                  icon={Plus}
                >
                  Create Order
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={onEndChat}
                >
                  End Chat
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {selectedChat.messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "customer"
                ? "justify-start"
                : "justify-end"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === "customer"
                  ? "bg-white border border-gray-200"
                  : "bg-blue-500 text-white"
              }`}
            >
              {message.type === "order" && message.orderData ? (
                <div className="space-y-2">
                  <div className="font-semibold">Order Created</div>
                  <div className="text-sm opacity-90">
                    <div>Order ID: {message.orderData.id}</div>
                    <div>
                      Total: ₹{message.orderData.total.toFixed(2)}
                    </div>
                    <div>Status: {message.orderData.status}</div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onOrderClick(message.orderData!)}
                    className="mt-2"
                  >
                    View Order
                  </Button>
                </div>
              ) : message.type === "image" ? (
                <div className="space-y-2">
                  <img
                    src={message.fileUrl}
                    alt={message.fileName}
                    className="max-w-full rounded"
                  />
                  <div className="text-xs opacity-90">
                    {message.fileName}
                  </div>
                </div>
              ) : message.type === "document" ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">{message.fileName}</span>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => window.open(message.fileUrl, "_blank")}
                  >
                    Download
                  </Button>
                </div>
              ) : (
                <div>{message.text}</div>
              )}
              <div
                className={`text-xs mt-1 ${
                  message.sender === "customer"
                    ? "text-gray-500"
                    : "text-blue-100"
                }`}
              >
                {message.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
          <input
            ref={fileInputRef}
            type="file"
            onChange={onFileUpload}
            accept="image/*,.pdf,.doc,.docx"
            className="hidden"
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            icon={Paperclip}
          >
            {""}
          </Button>
          <Button
            onClick={onSendMessage}
            disabled={!newMessage.trim()}
            icon={Send}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
