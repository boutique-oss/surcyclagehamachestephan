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

export function useContent<T>(key: string, defaultValue: T): [T, (val: T) => void] {
  const [content, setContent] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
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

  return [content, updateContent];
}
