import React from "react";
import Button from "../ui/Button";

type PaginationProps = {
  page: number; // current page
  totalPages: number; // total pages
  onPageChange?: (newPage: number) => void;

  limit?: number; // items per page
  onLimitChange?: (newLimit: number) => void;

  limitOptions?: number[]; // dropdown options
  showLimitDropdown?: boolean; // toggle dropdown visibility

  previousLabel?: string;
  nextLabel?: string;

  className?: string; // wrapper styles
  buttonClassName?: string; // override button styles
  dropdownClassName?: string; // override dropdown styles
};

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,

  limit = 10,
  onLimitChange,
  limitOptions = [5, 10, 20, 50],
  showLimitDropdown = true,

  previousLabel = "Previous",
  nextLabel = "Next",

  className = "",
  buttonClassName = "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-600",
  dropdownClassName = "block w-full appearance-none border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm cursor-pointer pr-8",
}) => {
  return (
    <div className={`flex justify-between items-center mt-6 ${className}`}>
      {/* Previous Button */}
      <Button
        variant="ghost"
        size="sm"
        className={buttonClassName}
        disabled={page === 1}
        onClick={() => onPageChange?.(page - 1)}
      >
        {previousLabel}
      </Button>

      {/* Center - Page Info + Dropdown */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700">
          Page <strong>{page}</strong> of {totalPages}
        </span>

        {showLimitDropdown && (
          <div className="relative inline-block">
            <select
              className={dropdownClassName}
              value={limit}
              onChange={(e) => onLimitChange?.(Number(e.target.value))}
            >
              {limitOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

          </div>
        )}
      </div>

      {/* Next Button */}
      <Button
        variant="ghost"
        size="sm"
        className={buttonClassName}
        disabled={page === totalPages}
        onClick={() => onPageChange?.(page + 1)}
      >
        {nextLabel}
      </Button>
    </div>
  );
};
