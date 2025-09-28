import { useState } from "react";
import Card from "../ui/Card";
import { Table, TableRow, TableCell } from "../ui/Table";
import { User, ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import StarRating from "./StarRating";
import { ReviewsTableProps } from "./types";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { OrderModal } from "../orders";
import { useModal } from "../../hooks/useModal";
import { Order } from "../../types";
import { mockOrders } from "../../data/mockData";
import { Pagination } from "../shared/pagination";

export default function ReviewsTable({
  reviews,
  formatDate,
}: ReviewsTableProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // 🔹 Pagination state
  const [meta, setMeta] = useState({
    page: 1,
    limit: 5,
    totalPages: Math.ceil(reviews.length / 5),
  });

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    openModal();
  };

  const openLightbox = (images: string[], startIndex: number) => {
    if (!images || images.length === 0) return;
    setLightboxImages(images);
    setCurrentIndex(Math.min(Math.max(startIndex, 0), images.length - 1));
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setLightboxImages([]);
    setCurrentIndex(0);
  };

  const showPrev = () => {
    if (lightboxImages.length === 0) return;
    setCurrentIndex((idx) => (idx - 1 + lightboxImages.length) % lightboxImages.length);
  };

  const showNext = () => {
    if (lightboxImages.length === 0) return;
    setCurrentIndex((idx) => (idx + 1) % lightboxImages.length);
  };

  const MAX_PREVIEW_LENGTH = 150;

  // 🔹 Paginate reviews
  const startIdx = (meta.page - 1) * meta.limit;
  const endIdx = startIdx + meta.limit;
  const paginatedReviews = reviews.slice(startIdx, endIdx);

  return (
    <div className="min-h-[calc(100vh-200px)] gap-6  flex flex-col justify-between bg-red flex-1 ">
      <Card>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Customer Reviews
          </h3>
          <p className="text-sm text-gray-600">
            All customer reviews and feedback for your products.
          </p>
        </div>

        <Table
          className="overflow-auto max-w-full"
          headers={["USER DETAILS", "PRODUCTS", "RATING", "REVIEW DATE"]}
        >
          {paginatedReviews.map((review) => (
            <TableRow key={review.id}>
              {/* USER DETAILS */}
              <TableCell>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {review.customerAvatar ? (
                      <img
                        src={review.customerAvatar}
                        alt={review.customerName}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="font-medium">{review.customerName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <span className="font-medium">Order:</span>
                    <button
                      onClick={() => handleViewOrder(mockOrders[0])}
                      className="text-blue-500 hover:underline cursor-pointer"
                    >
                      {review.orderNumber}
                    </button>
                  </div>
                </div>
              </TableCell>

              {/* PRODUCTS */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <img
                    src={review.productImage}
                    alt={review.productName}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div>
                    <div className="text-sm font-medium whitespace-nowrap">
                      {review.productName}
                    </div>
                  </div>
                </div>
              </TableCell>

              {/* REVIEW */}
              <TableCell className="flex flex-col gap-3 w-full xl:max-w-[700px] max-w-[500px] px-4">
                {Array.isArray(review.images) && review.images.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    {review.images.slice(0, 4).map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`review-${idx}`}
                        className="w-12 h-12 rounded object-cover border cursor-pointer hover:opacity-90"
                        onClick={() =>
                          openLightbox(review.images as string[], idx)
                        }
                      />
                    ))}
                    {review.images.length > 4 && (
                      <div className="w-12 h-12 rounded bg-gray-100 border flex items-center justify-center text-xs text-gray-600">
                        +{review.images.length - 4}
                      </div>
                    )}
                  </div>
                )}
                <div>
                  {review.review.length > MAX_PREVIEW_LENGTH ? (
                    <>
                      <div
                        data-tooltip-id={`review-${review.id}`}
                        data-tooltip-content={review.review}
                        className="text-sm text-gray-600 max-w-full line-clamp-3 cursor-pointer"
                      >
                        "{review.review}"
                      </div>
                      <Tooltip
                        id={`review-${review.id}`}
                        place="top"
                        className="max-w-xs whitespace-pre-line"
                      />
                    </>
                  ) : (
                    <div className="text-sm text-gray-600 max-w-full">
                      "{review.review}"
                    </div>
                  )}
                </div>
                <StarRating rating={review.rating} />
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" />
                    <span>{review.helpful}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsDown className="w-3 h-3" />
                    <span>{review.notHelpful}</span>
                  </div>
                </div>
              </TableCell>

              {/* DATE */}
              <TableCell className="w-[120px]">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono whitespace-pre-line">
                    {formatDate(review.lastUpdated)}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>

        {/* Lightbox */}
        {isLightboxOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              type="button"
              className="absolute top-4 right-4 text-white hover:text-gray-200"
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              type="button"
              className="absolute left-4 md:left-8 text-white hover:text-gray-200"
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <div
              className="max-w-5xl w-full px-6"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxImages[currentIndex]}
                alt={`review-large-${currentIndex}`}
                className="w-full max-h-[80vh] object-contain rounded shadow-lg"
              />
              <div className="mt-3 text-center text-gray-200 text-sm">
                {currentIndex + 1} / {lightboxImages.length}
              </div>
            </div>

            <button
              type="button"
              className="absolute right-4 md:right-8 text-white hover:text-gray-200"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        )}

        <OrderModal isOpen={isOpen} onClose={closeModal} order={selectedOrder} />
      </Card>

      {/* 🔹 Pagination */}
      <Pagination
        page={meta.page}
        totalPages={meta.totalPages}
        onPageChange={(newPage) =>
          setMeta((p) => ({ ...p, page: newPage }))
        }
        limit={meta.limit}
        onLimitChange={(newLimit) =>
          setMeta({
            page: 1,
            limit: newLimit,
            totalPages: Math.ceil(reviews.length / newLimit),
          })
        }
        limitOptions={[5, 10, 20, 50, 100]}
        showLimitDropdown={true}
        className="mt-10"
        buttonClassName="bg-indigo-500 text-white hover:bg-indigo-600 disabled:bg-gray-300 disabled:text-gray-600"
        dropdownClassName="border rounded px-2 py-1 text-sm"
      />
    </div>
  );
}
