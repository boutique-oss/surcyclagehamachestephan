import { useState, useEffect } from 'react';

export function useContent<T>(key: string, defaultValue: T): [T, (val: T) => void] {
  const [content, setContent] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultValue;
      }
    }
    return defaultValue;
  });

  const updateContent = (newVal: T) => {
    setContent(newVal);
  };
  
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(content));
  }, [key, content]);

  return [content, updateContent];
}
