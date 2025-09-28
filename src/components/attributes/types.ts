/* =========================
   Attributes Types
========================= */

export interface VariationOption {
  id?: string;
  variationId?: string;
  name: string;
  value: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  commission: number;
  slug: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Attribute {
  id: string;
  name: string;
  type: "text" | "color" | "number" | "select";
  options: string[];
  values: string[];
  optionIds: (string | undefined)[];
  group: string;
  isRequired: boolean;
  sortOrder: number;
  linkedCategories: string[];
}

export interface AttributeFormData {
  name: string;
  type: "text" | "color" | "number" | "select";
  options: string[];
  values: string[];
  optionIds: (string | undefined)[];
  deleteOptionIds: string[];
  group: string;
  isRequired: boolean;
  sortOrder: number;
  linkedCategories: string[];
}

export interface Pagination {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}

export interface AttributesTableProps {
  attributes: Attribute[];
  categories: Category[];
  onEditAttribute: (attribute: Attribute) => void;
  onDeleteAttribute: (attribute: Attribute) => void;
  onLinkCategories: (attribute: Attribute) => void;
  linkingCategories: boolean;
  submitting: boolean;
  deleting: boolean;
  getCategoryName: (categoryId: string) => string;
}

export interface AttributeFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingAttribute: Attribute | null;
  formData: AttributeFormData;
  onFormDataChange: (data: AttributeFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
  onOptionChange: (index: number, value: string) => void;
  onValueChange: (index: number, value: string) => void;
  onCategoryToggle: (categoryId: string) => void;
  categories: Category[];
  submitting: boolean;
}

export interface CategoryLinkingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAttribute: Attribute | null;
  formData: AttributeFormData;
  onFormDataChange: (data: AttributeFormData) => void;
  onCategoryToggle: (categoryId: string) => void;
  onSave: () => void;
  categories: Category[];
  savingCategories: boolean;
}

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  attributeToDelete: Attribute | null;
  onConfirm: () => void;
  deleting: boolean;
}
