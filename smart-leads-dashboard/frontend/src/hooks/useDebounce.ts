import { useState, useEffect } from 'react';

/**
 * Debounces a value by the given delay (default: 300ms).
 * Returns the debounced value that only updates after the delay has elapsed
 * without the value changing.
 */
export const useDebounce = <T>(value: T, delay = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
