'use client'

import { useState } from "react";

export const useLocalStorage = (key: string, initialValue: string) => {
  const get = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  };

  const [value, setValue] = useState(get());

  const set = (newValue: string) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(newValue));
      setValue(newValue);
    } catch (error) {
      console.error(error);
    }
  };

  return [value, set] as const;
}