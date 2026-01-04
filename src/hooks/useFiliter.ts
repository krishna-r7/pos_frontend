import { useState } from "react";
import useAsync from "@/hooks/useAsync";

export interface BaseFilters {
  page: number;
  limit: number;
  [key: string]: any;
}

const DEFAULT_PAGINATION = {
  page: 1,
  limit: 20,
};

const useFilter = <
  TData,
  TFilter extends BaseFilters = BaseFilters
>( apiFn: (params: TFilter) => Promise<TData>, defaultFilters: Partial<TFilter> = {}) => {
    
  const [filters, setFilters] = useState<TFilter>({
    ...(defaultFilters as TFilter),
    ...DEFAULT_PAGINATION,
  });

  const { data, loading, error, refresh } = useAsync<TData, TFilter>(
    apiFn,
    filters
  );

  const updateFilter = (newFilters: Partial<TFilter> = {}) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const resetFilters = () => {
    setFilters({
      ...(defaultFilters as TFilter),
      ...DEFAULT_PAGINATION,
    });
  };

  return {
    data,
    loading,
    error,
    filters,
    updateFilter,
    resetFilters,
    refresh,
  };
};

export default useFilter;
