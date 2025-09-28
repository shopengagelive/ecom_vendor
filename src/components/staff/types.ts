/* =========================
   Staff Types
========================= */

export interface Permissions {
  orders: boolean;
  products: boolean;
  analytics: boolean;
  customers: boolean;
  payments: boolean;
  settings: boolean;
  staff: boolean;
  reports: boolean;
}

export interface StaffFormData {
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
  avatar: string | File;
}

export interface StaffTableProps {
  staffList: any[];
  onEditStaff: (staff: any) => void;
  onDeleteStaff: (staff: any) => void;
  onManagePermissions: (staff: any) => void;
}

export interface StaffFormProps {
  isOpen: boolean;
  onClose: () => void;
  formData: StaffFormData;
  onFormDataChange: (data: StaffFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  editStaffId: string | null;
  avatarPreview: string | null;
  onImageChange: (file: File) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onRemoveImage: (e: React.MouseEvent) => void;
  dragActive: boolean;
}

export interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStaff: any | null;
  permissions: Permissions;
  onPermissionsChange: (permissions: Permissions) => void;
  onSave: () => void;
}

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffToDelete: any | null;
  onConfirm: () => void;
}
