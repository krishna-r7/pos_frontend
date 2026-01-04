import { useEffect, useState, useRef, useMemo } from "react";
import axios, { AxiosError } from "axios";


type AsyncFunction<TData, TParams> = (params: TParams) => Promise<TData>;

interface UseAsyncReturn<TData> {
  data: TData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const useAsync = <TData, TParams extends Record<string, unknown> = {}>(
  asyncFunction: AsyncFunction<TData, TParams>,
  params: TParams = {} as TParams,
  deps: React.DependencyList = []
): UseAsyncReturn<TData> => {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const stableParams = useMemo(
    () => params,
    [JSON.stringify(params)]
  );

  const fetchData = async (): Promise<void> => {
    // cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const result = await asyncFunction({
        ...stableParams,
      });

      setData(result ?? null);
    } catch (err) {
      if (!axios.isCancel(err)) {
        const errorMessage =
          err instanceof AxiosError
            ? err.response?.data?.message || err.message
            : "Something went wrong";

        setError(errorMessage);
        setData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    return () => {
      abortControllerRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stableParams, ...deps]);

  return {
    data,
    loading,
    error,
    refresh: fetchData,
  };
};

export default useAsync;
