// hooks/use-debounce.ts

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for debouncing values
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Advanced debounce hook with immediate execution option
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @param immediate - Whether to execute immediately on first call
 * @returns Debounced value and control functions
 */
export function useAdvancedDebounce<T>(
  value: T,
  delay: number,
  immediate: boolean = false
): {
  debouncedValue: T;
  isPending: boolean;
  cancel: () => void;
  flush: () => void;
} {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isPending, setIsPending] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const immediateRef = useRef<boolean>(immediate);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      setIsPending(false);
    }
  }, []);

  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      setDebouncedValue(value);
      setIsPending(false);
    }
  }, [value]);

  useEffect(() => {
    // If immediate is true and this is the first call, execute immediately
    if (immediate && immediateRef.current) {
      setDebouncedValue(value);
      immediateRef.current = false;
      return;
    }

    // Cancel any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set pending state
    setIsPending(true);

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
      setIsPending(false);
      timeoutRef.current = null;
    }, delay);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, immediate]);

  // Reset immediate flag when delay changes
  useEffect(() => {
    immediateRef.current = immediate;
  }, [immediate]);

  return {
    debouncedValue,
    isPending,
    cancel,
    flush,
  };
}

/**
 * Hook for debouncing function calls
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @param deps - Dependencies array
 * @returns Debounced function and control functions
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  deps?: React.DependencyList
): {
  debouncedCallback: T;
  isPending: boolean;
  cancel: () => void;
  flush: (...args: Parameters<T>) => void;
} {
  const [isPending, setIsPending] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const argsRef = useRef<Parameters<T>>();

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      setIsPending(false);
    }
  }, []);

  const flush = useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsPending(false);
    return func(...args);
  }, deps ? [func, ...deps] : [func]);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      argsRef.current = args;
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setIsPending(true);

      timeoutRef.current = setTimeout(() => {
        setIsPending(false);
        timeoutRef.current = null;
        if (argsRef.current) {
          func(...argsRef.current);
        }
      }, delay);
    },
    deps ? [func, delay, ...deps] : [func, delay]
  ) as T;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    debouncedCallback,
    isPending,
    cancel,
    flush,
  };
}

/**
 * Hook for debouncing async functions with loading state
 * @param asyncFunc - Async function to debounce
 * @param delay - Delay in milliseconds
 * @param deps - Dependencies array
 * @returns Debounced async function and state
 */
export function useDebouncedAsyncCallback<T extends (...args: any[]) => Promise<any>>(
  asyncFunc: T,
  delay: number,
  deps?: React.DependencyList
): {
  debouncedCallback: T;
  isPending: boolean;
  isLoading: boolean;
  cancel: () => void;
  flush: (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>>;
} {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const argsRef = useRef<Parameters<T>>();
  const abortControllerRef = useRef<AbortController>();

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      setIsPending(false);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = undefined;
      setIsLoading(false);
    }
  }, []);

  const flush = useCallback(async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsPending(false);
    setIsLoading(true);

    try {
      const result = await asyncFunc(...args);
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }, deps ? [asyncFunc, ...deps] : [asyncFunc]);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      argsRef.current = args;
      
      // Cancel any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      setIsPending(true);

      timeoutRef.current = setTimeout(async () => {
        setIsPending(false);
        setIsLoading(true);
        timeoutRef.current = null;

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        try {
          if (argsRef.current) {
            await asyncFunc(...argsRef.current);
          }
        } catch (error) {
          // Only log if not aborted
          if (!abortControllerRef.current?.signal.aborted) {
            console.error('Debounced async function error:', error);
          }
        } finally {
          setIsLoading(false);
          abortControllerRef.current = undefined;
        }
      }, delay);
    },
    deps ? [asyncFunc, delay, ...deps] : [asyncFunc, delay]
  ) as T;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    debouncedCallback,
    isPending,
    isLoading,
    cancel,
    flush,
  };
}

/**
 * Hook for debouncing search functionality
 * @param searchFunc - Function to perform search
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns Search state and functions
 */
export function useDebouncedSearch<T>(
  searchFunc: (query: string) => Promise<T[]>,
  delay: number = 300
): {
  query: string;
  results: T[];
  isSearching: boolean;
  isPending: boolean;
  error: string | null;
  setQuery: (query: string) => void;
  clearResults: () => void;
  retry: () => void;
} {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<T[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, delay);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const searchResults = await searchFunc(searchQuery);
      setResults(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchFunc]);

  const { debouncedCallback, isPending } = useDebouncedCallback(
    performSearch,
    0, // No additional delay since we're already debouncing the query
    [performSearch]
  );

  useEffect(() => {
    debouncedCallback(debouncedQuery);
  }, [debouncedQuery, debouncedCallback]);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  const retry = useCallback(() => {
    if (query.trim()) {
      performSearch(query);
    }
  }, [query, performSearch]);

  return {
    query,
    results,
    isSearching,
    isPending,
    error,
    setQuery,
    clearResults,
    retry,
  };
}

export default useDebounce;