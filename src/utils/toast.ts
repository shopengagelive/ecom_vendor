import toast from "react-hot-toast";

// Custom toast functions that use the centralized configuration from App.tsx
export const showToast = {
  success: (message: string, options?: any) => {
    toast.success(message, {
      duration: 4000,
      position: "top-right",
      ...options,
    });
  },

  error: (message: string, options?: any) => {
    toast.error(message, {
      duration: 4000,
      position: "top-right",
      ...options,
    });
  },

  info: (message: string, options?: any) => {
    toast(message, {
      duration: 4000,
      position: "top-right",
      ...options,
    });
  },

  loading: (message: string, options?: any) => {
    return toast.loading(message, {
      position: "top-right",
      ...options,
    });
  },

  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  },
};

// Export the original toast for advanced use cases
export { toast };
