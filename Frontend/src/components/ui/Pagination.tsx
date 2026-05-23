import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { getPageNumbers } from "@/utils/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const pages = getPageNumbers(currentPage, totalPages);

  return totalPages > 1 ? (
    <div
      className={clsx("flex justify-center items-center gap-3 py-6", className)}
      aria-label="Pagination Navigation"
    >
      {/* Previous Button (Points right in RTL) */}
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="hero"
        className="w-12! h-12! rounded-xl! text-base! select-none border! border-gray-200! text-slate-700! hover:bg-gray-50! active:bg-gray-100!"
        aria-label="Previous Page"
      >
        <ChevronRight size={20} />
      </Button>

      {/* Page Numbers & Ellipses */}
      <div className="flex items-center gap-3">
        {pages.map((page, index) =>
          page === "..." ? (
            <span
              key={`dots-${index}`}
              className="w-12 h-12 flex items-center justify-center rounded-xl text-base transition-all select-none border border-gray-200 bg-white text-slate-400 font-bold"
            >
              ...
            </span>
          ) : (
            <Button
              key={page}
              onClick={() => onPageChange(page as number)}
              aria-current={page === currentPage ? "page" : undefined}
              variant={page === currentPage ? "primary" : "hero"}
              className={clsx(
                "w-12! h-12! rounded-xl! text-base! select-none",
                page === currentPage
                  ? "shadow-sm shadow-primary/20"
                  : "border! border-gray-200! text-slate-700! hover:bg-gray-50! active:bg-gray-100!"
              )}
            >
              {page}
            </Button>
          )
        )}
      </div>

      {/* Next Button (Points left in RTL) */}
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="hero"
        className="w-12! h-12! rounded-xl! text-base! select-none border! border-gray-200! text-slate-700! hover:bg-gray-50! active:bg-gray-100!"
        aria-label="Next Page"
      >
        <ChevronLeft size={20} />
      </Button>
    </div>
  ) : null;
}
