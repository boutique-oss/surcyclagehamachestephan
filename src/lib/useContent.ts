import { useState, useEffect } from 'react';
import { supabase } from './supabase';

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

async function fetchFromCloud<T>(key: string): Promise<T | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('content')
      .select('value')
      .eq('key', key)
      .maybeSingle();
    if (error || !data) return null;
    return data.value as T;
  } catch {
    return null;
  }
}

async function saveToCloud<T>(key: string, value: T): Promise<void> {
  if (!supabase) return;
  try {
    await supabase
      .from('content')
      .upsert({ key, value, updated_at: new Date().toISOString() });
  } catch {}
}

export function useContent<T extends object>(key: string, defaultValue: T): [T, (val: T) => void] {
  const [content, setContent] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaultValue, ...parsed } as T;
      } catch {
        return defaultValue;
      }
    }
    return defaultValue;
  });

  // Charge depuis Supabase au montage + écoute les changements temps réel
  useEffect(() => {
    let active = true;

    fetchFromCloud<T>(key).then((cloud) => {
      if (!active || !cloud) return;
      const merged = { ...defaultValue, ...cloud } as T;
      setContent(merged);
      localStorage.setItem(key, JSON.stringify(merged));
    });

    if (!supabase) return;

    const channel = supabase
      .channel(`content:${key}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'content', filter: `key=eq.${key}` },
        (payload) => {
          const rec = payload.new as { value?: T } | undefined;
          if (!rec?.value) return;
          const merged = { ...defaultValue, ...rec.value } as T;
          setContent(merged);
          localStorage.setItem(key, JSON.stringify(merged));
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const updateContent = (newVal: T) => {
    logChange(key, content, newVal);
    setContent(newVal);
    localStorage.setItem(key, JSON.stringify(newVal));
    saveToCloud(key, newVal);
  };

  return [content, updateContent];
}
