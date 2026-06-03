import { createContext, useContext, useState, ReactNode } from 'react';

export interface AnimSettings {
  particles: boolean;
  scanline: boolean;
  cursorGlow: boolean;
  logoShimmer: boolean;
  blobIntensity: number; // 0–100
  spline: boolean;
}

const DEFAULTS: AnimSettings = {
  particles: true,
  scanline: true,
  cursorGlow: true,
  logoShimmer: true,
  blobIntensity: 100,
  spline: true,
};

const LS_KEY = 'anim_settings';

const Ctx = createContext<{
  s: AnimSettings;
  set: (p: Partial<AnimSettings>) => void;
}>({ s: DEFAULTS, set: () => {} });

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<AnimSettings>(() => {
    try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(LS_KEY) || '{}') }; }
    catch { return DEFAULTS; }
  });

  const set = (p: Partial<AnimSettings>) =>
    setS(prev => {
      const next = { ...prev, ...p };
      localStorage.setItem(LS_KEY, JSON.stringify(next));
      return next;
    });

  return <Ctx.Provider value={{ s, set }}>{children}</Ctx.Provider>;
}

export const useAnim = () => useContext(Ctx);
