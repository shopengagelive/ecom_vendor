/* =========================
   LiveStream Types
========================= */

export interface TaggedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface StreamData {
  id: string;
  broadcastTitle: string;
  startedOn: string;
  duration: string;
  completedOn: string;
  broadcasterType: string;
  recording: boolean;
  restream: boolean;
  restreamPlatforms: string[];
  taggedProducts: TaggedProduct[];
  sales: number;
  status: "ongoing" | "upcoming" | "completed";
}

export interface ReelData {
  id: string;
  caption: string;
  video: string;
  publishedDate: string;
  category: string;
  taggedProducts: TaggedProduct[];
  views: number;
  sales: number;
}

export interface Tab {
  id: "ongoing" | "upcoming" | "completed" | "reels";
  name: string;
}

export interface TabNavigationProps {
  activeTab: "ongoing" | "upcoming" | "completed" | "reels";
  onTabChange: (tab: "ongoing" | "upcoming" | "completed" | "reels") => void;
  tabs: Tab[];
}

export interface StreamsTableProps {
  streams: StreamData[];
  onProductClick: (stream: StreamData) => void;
  onDeleteStream: (streamId: string) => void;
  formatDuration: (duration: string) => string;
}

export interface ReelsTableProps {
  reels: ReelData[];
  onProductClick: (reel: ReelData) => void;
  onEditReel: (reel: ReelData) => void;
  onDeleteReel: (reelId: string) => void;
}

export interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStream: StreamData | null;
  selectedReel: ReelData | null;
  onAddProduct: () => void;
  onRemoveProduct: (productId: string) => void;
}

export interface ReelEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedReel: ReelData | null;
  onSave: (reelData: Partial<ReelData>) => void;
}

export interface EmptyStateProps {
  activeTab: "ongoing" | "upcoming" | "completed" | "reels";
  reelsCount: number;
}
