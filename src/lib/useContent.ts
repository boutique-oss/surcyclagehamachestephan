import { useState, useEffect } from 'react';

function logChange<T>(key: string, oldVal: T, newVal: T) {
  if (JSON.stringify(oldVal) === JSON.stringify(newVal)) return;
  try {
    const existing = localStorage.getItem('admin_audit_log');
    const logs = existing ? JSON.parse(existing) : [];
    const stringify = (v: T): string => {
      if (typeof v === 'string' && (v as string).startsWith('data:')) return '[image importée]';
      const s = JSON.stringify(v) ?? '';
      return s.length > 80 ? s.slice(0, 80) + '…' : s;
    };
    logs.unshift({
      key,
      oldVal: stringify(oldVal),
      newVal: stringify(newVal),
      ts: new Date().toISOString(),
    });
    localStorage.setItem('admin_audit_log', JSON.stringify(logs.slice(0, 100)));
  } catch {}
}

export function useContent<T extends object>(key: string, defaultValue: T): [T, (val: T) => void] {
  const [content, setContent] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with defaultValue so any newly-added fields are always present,
        // even when the user has an older version saved in localStorage.
        return { ...defaultValue, ...parsed } as T;
      } catch {
        return defaultValue;
      }
    }
    return defaultValue;
  });

  const updateContent = (newVal: T) => {
    logChange(key, content, newVal);
    setContent(newVal);
  };

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(content));
  }, [key, content]);

  // Sync changes across tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          const newVal = JSON.parse(e.newValue);
          setContent({ ...defaultValue, ...newVal } as T);
        } catch {}
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, defaultValue]);

  return [content, updateContent];
}
