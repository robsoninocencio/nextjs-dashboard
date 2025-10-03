import { useCallback, useMemo } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export interface FilterState {
  [key: string]: string | number | boolean;
}

export interface UseFiltersProps<T extends FilterState> {
  initialFilters: T;
  debounceMs?: number;
  onFiltersChange?: (filters: T) => void;
}

export function useFilters<T extends FilterState>({
  initialFilters,
  debounceMs = 300,
  onFiltersChange,
}: UseFiltersProps<T>) {
  const filters = useMemo(() => initialFilters, [initialFilters]);

  const updateFilter = useCallback(
    (key: keyof T, value: string | number | boolean) => {
      const newFilters = { ...filters, [key]: value };
      onFiltersChange?.(newFilters);
      return newFilters;
    },
    [filters, onFiltersChange]
  );

  const resetFilters = useCallback(() => {
    onFiltersChange?.(initialFilters);
    return initialFilters;
  }, [initialFilters, onFiltersChange]);

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => value !== '' && value !== 0 && value !== false);
  }, [filters]);

  const debouncedUpdateFilter = useDebouncedCallback(updateFilter, debounceMs);

  return {
    filters,
    updateFilter,
    debouncedUpdateFilter,
    resetFilters,
    hasActiveFilters,
  };
}
