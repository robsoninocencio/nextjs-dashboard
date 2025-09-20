import { useCallback, useMemo, useState } from "react";

export type SortDirection = "asc" | "desc" | null;

export interface SortState {
  key: string;
  direction: SortDirection;
}

export interface UseSortProps<T> {
  data: T[];
  initialSort?: SortState;
  sortFunctions?: Record<string, (a: T, b: T) => number>;
}

export function useSort<T>({
  data,
  initialSort,
  sortFunctions = {},
}: UseSortProps<T>) {
  const [sortState, setSortState] = useState<SortState | undefined>(
    initialSort
  );

  const handleSort = useCallback((key: string) => {
    setSortState((prevState) => {
      if (!prevState || prevState.key !== key) {
        return { key, direction: "asc" };
      }

      if (prevState.direction === "asc") {
        return { key, direction: "desc" };
      }

      return { key, direction: null };
    });
  }, []);

  const sortedData = useMemo(() => {
    if (!sortState || !sortState.direction) {
      return data;
    }

    const { key, direction } = sortState;

    return [...data].sort((a, b) => {
      const aValue = (a as any)[key];
      const bValue = (b as any)[key];

      // Use custom sort function if provided
      if (sortFunctions[key]) {
        const result = sortFunctions[key](a, b);
        return direction === "asc" ? result : -result;
      }

      // Default string/number sorting
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return direction === "asc" ? 1 : -1;
      if (bValue == null) return direction === "asc" ? -1 : 1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue);
        return direction === "asc" ? comparison : -comparison;
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      // Convert to string for comparison
      const aStr = String(aValue);
      const bStr = String(bValue);
      const comparison = aStr.localeCompare(bStr);
      return direction === "asc" ? comparison : -comparison;
    });
  }, [data, sortState, sortFunctions]);

  const getSortIcon = useCallback(
    (key: string) => {
      if (!sortState || sortState.key !== key) {
        return "sort";
      }
      return sortState.direction === "asc" ? "chevron-up" : "chevron-down";
    },
    [sortState]
  );

  return {
    sortedData,
    sortState,
    handleSort,
    getSortIcon,
  };
}
