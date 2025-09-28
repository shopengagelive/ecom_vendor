export interface CourierCompany {
  id: string;
  providerName: string;
  trackingUrl: string;
  prefix: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourierFormData {
  name: string;
  trackingUrl: string;
  trackingIdPrefix: string;
}

export interface ShippingSetupTableProps {
  couriers: CourierCompany[];
  onEdit: (courier: CourierCompany) => void;
  onDelete: (courier: CourierCompany) => void;
  onToggleStatus: (courierId: string) => void;
}

export interface CourierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CourierFormData) => void;
  courier?: CourierCompany | null;
  isEditing: boolean;
  isSubmitting?: boolean;
}

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  courierName: string;
}
