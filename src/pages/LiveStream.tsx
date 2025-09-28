import { useState } from "react";
import {
  TabNavigation,
  StreamsTable,
  ReelsTable,
  ProductModal,
  ReelEditModal,
  EmptyState,
  StreamData,
  ReelData,
  Tab,
} from "../components/livestream";

// Mock data for the table format
const mockStreamData: StreamData[] = [
  {
    id: "1",
    broadcastTitle: "Summer Collection Launch",
    startedOn: "Jul 24, 2025 03:29:10 PM",
    duration: "2 Minutes",
    completedOn: "Jul 24, 2025 03:30:10 PM",
    broadcasterType: "N/A",
    recording: false,
    restream: false,
    restreamPlatforms: [],
    taggedProducts: [
      { id: "1", name: "Summer Dress", price: 2999, image: "/product1.jpg" },
      { id: "2", name: "Beach Hat", price: 599, image: "/product2.jpg" },
      { id: "3", name: "Sunglasses", price: 899, image: "/product3.jpg" },
    ],
    sales: 0,
    status: "completed",
  },
  {
    id: "2",
    broadcastTitle: "Fashion Tips & Tricks",
    startedOn: "Jul 24, 2025 12:03:26 PM",
    duration: "20 Minutes, 41 Seconds",
    completedOn: "Jul 24, 2025 12:13:47 PM",
    broadcasterType: "N/A",
    recording: false,
    restream: false,
    restreamPlatforms: [],
    taggedProducts: [
      { id: "4", name: "Styling Kit", price: 1499, image: "/product4.jpg" },
    ],
    sales: 0,
    status: "completed",
  },
  {
    id: "3",
    broadcastTitle: "Influencer Collaboration Live",
    startedOn: "Jul 25, 2025 10:00:00 AM",
    duration: "45 Minutes",
    completedOn: "Jul 25, 2025 10:45:00 AM",
    broadcasterType: "Influencer",
    recording: true,
    restream: true,
    restreamPlatforms: ["YouTube", "Facebook", "Instagram"],
    taggedProducts: [
      { id: "5", name: "Makeup Kit", price: 2499, image: "/product5.jpg" },
      { id: "6", name: "Skincare Set", price: 1899, image: "/product6.jpg" },
      { id: "7", name: "Hair Care", price: 1299, image: "/product7.jpg" },
      { id: "8", name: "Accessories", price: 799, image: "/product8.jpg" },
      { id: "9", name: "Jewelry Set", price: 1599, image: "/product9.jpg" },
    ],
    sales: 12,
    status: "completed",
  },
  {
    id: "4",
    broadcastTitle: "Brand Showcase Event",
    startedOn: "Jul 26, 2025 02:00:00 PM",
    duration: "1 Hour, 15 Minutes",
    completedOn: "Jul 26, 2025 03:15:00 PM",
    broadcasterType: "Brand",
    recording: true,
    restream: true,
    restreamPlatforms: ["YouTube", "Instagram"],
    taggedProducts: [
      {
        id: "10",
        name: "Premium Watch",
        price: 15999,
        image: "/product10.jpg",
      },
      { id: "11", name: "Leather Bag", price: 8999, image: "/product11.jpg" },
      { id: "12", name: "Sneakers", price: 5999, image: "/product12.jpg" },
      { id: "13", name: "Denim Jacket", price: 3999, image: "/product13.jpg" },
      { id: "14", name: "T-Shirt", price: 1499, image: "/product14.jpg" },
      { id: "15", name: "Jeans", price: 2499, image: "/product15.jpg" },
      { id: "16", name: "Cap", price: 899, image: "/product16.jpg" },
      { id: "17", name: "Wallet", price: 1999, image: "/product17.jpg" },
    ],
    sales: 25,
    status: "completed",
  },
];

// Mock data for reels
const mockReelsData: ReelData[] = [
  {
    id: "1",
    caption:
      "Amazing summer collection! Check out these trendy outfits #fashion #summer",
    video: "/reel1.mp4",
    publishedDate: "Jul 24, 2025",
    category: "Fashion",
    taggedProducts: [
      { id: "1", name: "Summer Dress", price: 2999, image: "/product1.jpg" },
      { id: "2", name: "Beach Hat", price: 599, image: "/product2.jpg" },
    ],
    views: 15420,
    sales: 8,
  },
  {
    id: "2",
    caption: "Quick makeup tutorial using our new collection #makeup #tutorial",
    video: "/reel2.mp4",
    publishedDate: "Jul 25, 2025",
    category: "Beauty",
    taggedProducts: [
      { id: "5", name: "Makeup Kit", price: 2499, image: "/product5.jpg" },
      { id: "6", name: "Skincare Set", price: 1899, image: "/product6.jpg" },
    ],
    views: 8920,
    sales: 15,
  },
];

export default function LiveStream() {
  const [activeTab, setActiveTab] = useState<
    "ongoing" | "upcoming" | "completed" | "reels"
  >("completed");
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedStream, setSelectedStream] = useState<StreamData | null>(null);
  const [showReelModal, setShowReelModal] = useState(false);
  const [selectedReel, setSelectedReel] = useState<ReelData | null>(null);

  const getFilteredStreams = () => {
    return mockStreamData.filter((stream) => stream.status === activeTab);
  };

  const formatDuration = (duration: string) => {
    return duration;
  };

  const handleProductClick = (stream: StreamData) => {
    setSelectedStream(stream);
    setShowProductModal(true);
  };

  const handleReelEdit = (reel: ReelData) => {
    setSelectedReel(reel);
    setShowReelModal(true);
  };

  const handleDeleteStream = (streamId: string) => {
    // Handle delete logic here
    console.log("Deleting stream:", streamId);
  };

  const handleDeleteReel = (reelId: string) => {
    // Handle delete logic here
    console.log("Deleting reel:", reelId);
  };

  const tabs: Tab[] = [
    { id: "ongoing", name: "On-Going" },
    { id: "upcoming", name: "Upcoming" },
    { id: "completed", name: "Completed" },
    { id: "reels", name: "Reels" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Live Streams</h1>
        <p className="text-gray-600">
          Manage your live streaming events and broadcasts.
        </p>
      </div>

      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
      />

      {/* Streams Table */}
      {activeTab !== "reels" && (
        <StreamsTable
          streams={getFilteredStreams()}
          onProductClick={handleProductClick}
          onDeleteStream={handleDeleteStream}
          formatDuration={formatDuration}
        />
      )}

      {/* Reels Table */}
      {activeTab === "reels" && (
        <ReelsTable
          reels={mockReelsData}
          onProductClick={(reel) => {
            setSelectedReel(reel);
            setShowProductModal(true);
          }}
          onEditReel={handleReelEdit}
          onDeleteReel={handleDeleteReel}
        />
      )}

      <EmptyState activeTab={activeTab} reelsCount={mockReelsData.length} />

      <ProductModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        selectedStream={selectedStream}
        selectedReel={selectedReel}
        onAddProduct={() => console.log("Add product")}
        onRemoveProduct={(productId) =>
          console.log("Remove product:", productId)
        }
      />

      <ReelEditModal
        isOpen={showReelModal}
        onClose={() => setShowReelModal(false)}
        selectedReel={selectedReel}
        onSave={(reelData) => console.log("Save reel:", reelData)}
      />
    </div>
  );
}
