/* =========================
   Settings Types
========================= */

export interface StoreSettings {
  id: string;
  storeName: string;
  storeUsername: string;
  coverImage: string | null;
  profileImage: string | null;
  // returnPolicy: string;
  shippingDays: number;
  street: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  address: string;
}

export interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
}

export interface KYCDocument {
  id: string;
  type: string;
  fileUrl?: string;
  fileName?: string;
  documentType?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  states: string[];
  cities: string[];
  restrictedPinCodes: string[];
  shippingMethods: ShippingMethod[];
}

export type FreeShippingRequirement =
  | "none"
  | "min_amount"
  | "coupon"
  | "min_or_coupon"
  | "min_and_coupon";

export interface ShippingMethod {
  id: string;
  name: string; // "Flat Rate" | "Local Pickup" | "Free Shipping"
  cost: number;
  deliveryDays: number;
  isFree: boolean;
  // Optional fields for "Free Shipping"
  freeShippingRequirement?: FreeShippingRequirement;
  minOrderAmount?: number;
  applyMinBeforeCoupon?: boolean;
}

export interface ShippingPolicy {
  id?: string;
  policy: string
  isCheck: boolean
}

export interface Tab {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface ZoneFormData {
  name: string;
  countries: string[];
  states: string[];
}

export interface MethodFormData {
  name: "Flat Rate" | "Local Pickup" | "Free Shipping" | "";
  cost: number;
  deliveryDays: number;
  isFree: boolean;
  freeShippingRequirement: FreeShippingRequirement;
  minOrderAmount: number;
  applyMinBeforeCoupon: boolean;
}

export type MethodOption = "Flat Rate" | "Local Pickup" | "Free Shipping";

export interface CountryStateMap {
  [key: string]: string[];
}

export interface Warehouse {
  id: string;
  name: string;
  address: string;
  postCode: string;
  city: string;
  state: string;
  createdAt?: string;
  updatedAt?: string;
}