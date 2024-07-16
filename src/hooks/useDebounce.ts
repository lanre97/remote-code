import { useEffect, useState } from "react";

export function useDebounce<T>(initialValue: T, delay: number): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setValue(initialValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [initialValue, delay]);

  return [value, setValue];
}