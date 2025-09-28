/* =========================
   Reviews Types
========================= */

export interface Review {
  id: string;
  customerName: string;
  customerAvatar?: string | null;
  productName: string;
  productImage: string;
  rating: number;
  review: string;
  lastUpdated: string;
  createdAt: string;
  helpful: number;
  notHelpful: number;
  orderNumber: string;
  images?: string[];
}

export interface StarRatingProps {
  rating: number;
  showText?: boolean;
}

export interface ReviewsTableProps {
  reviews: Review[];
  formatDate: (dateString: string) => string;
}

export interface EmptyStateProps {
  message: string;
}
