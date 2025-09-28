import React from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "6xl" | "full";
}

export default function Modal({
  isOpen,
  onClose,
  title = "",
  children,
  size = "md",
}: ModalProps) {
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-5xl",
    "6xl": "max-w-8xl",
    full: "w-full h-full max-w-none max-h-none",
  };

  // Padding based on modal size
  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
    "6xl": "p-12",
    full: "p-6",
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className={`fixed inset-0 flex items-center justify-center ${size === "full" ? "p-0" : "p-4 my-8"}`}>
        <Dialog.Panel
          className={`mx-auto ${sizeClasses[size]} ${size === "full" ? "w-full h-full" : "w-full"} bg-white ${size === "full" ? "rounded-none" : "rounded-lg"} shadow-2xl ${size === "full" ? "max-h-none" : "max-h-[90vh]"} flex flex-col`}
        >
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <Dialog.Title className="text-xl font-bold text-gray-900">
                {title}
              </Dialog.Title>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className={`flex-1 overflow-y-auto ${paddingClasses[size]}`}>
            {children}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
