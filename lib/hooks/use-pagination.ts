import { useMemo } from "react";

export interface UsePaginationProps {
  currentPage: number;
  totalPages: number;
  maxVisiblePages?: number;
}

export function usePagination({
  currentPage,
  totalPages,
  maxVisiblePages = 5,
}: UsePaginationProps) {
  const paginationRange = useMemo(() => {
    const delta = Math.floor(maxVisiblePages / 2);
    const range = [];
    const rangeWithDots = [];

    // Calculate the range of pages to show
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    // Add first page
    if (start > 2) {
      range.push(1);
    }

    // Add pages with dots
    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // Add last page
    if (end < totalPages - 1) {
      range.push(totalPages);
    }

    // Add dots where needed
    for (let i = 0; i < range.length; i++) {
      rangeWithDots.push(range[i]);

      if (i < range.length - 1 && range[i + 1] - range[i] > 1) {
        rangeWithDots.push("...");
      }
    }

    return rangeWithDots;
  }, [currentPage, totalPages, maxVisiblePages]);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return {
    paginationRange,
    canGoPrevious,
    canGoNext,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages,
  };
}
