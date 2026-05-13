import { createContext, useContext, useState, ReactNode } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  login: (code: string) => Promise<{ ok: boolean; locked: boolean; remainingMs?: number }>;
  logout: () => void;
  isEditMode: boolean;
  toggleEditMode: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_HASH = 'f9a08fb80b89de612e9ce8cffbd695c8eb7b61b2c634b99322ce5095993afcde';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30 * 60 * 1000; // 30 minutes
const RATE_KEY = 'admin_rate';

async function hashInput(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const buffer = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function getRateState(): { attempts: number; lockedUntil: number } {
  try {
    const raw = localStorage.getItem(RATE_KEY);
    return raw ? JSON.parse(raw) : { attempts: 0, lockedUntil: 0 };
  } catch {
    return { attempts: 0, lockedUntil: 0 };
  }
}

function setRateState(state: { attempts: number; lockedUntil: number }) {
  localStorage.setItem(RATE_KEY, JSON.stringify(state));
}

export function AdminProvider({ children }: { children: ReactNode }) {
  // Admin state is NEVER restored from localStorage — must authenticate each session
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const login = async (code: string): Promise<{ ok: boolean; locked: boolean; remainingMs?: number }> => {
    const now = Date.now();
    const rate = getRateState();

    // Check lockout
    if (rate.lockedUntil > now) {
      return { ok: false, locked: true, remainingMs: rate.lockedUntil - now };
    }

    const hash = await hashInput(code);

    if (hash === ADMIN_HASH) {
      // Reset rate on success
      setRateState({ attempts: 0, lockedUntil: 0 });
      setIsAdmin(true);
      return { ok: true, locked: false };
    }

    // Wrong password — increment attempt counter
    const newAttempts = rate.attempts + 1;
    if (newAttempts >= MAX_ATTEMPTS) {
      setRateState({ attempts: 0, lockedUntil: now + LOCKOUT_DURATION_MS });
    } else {
      setRateState({ attempts: newAttempts, lockedUntil: 0 });
    }

    return { ok: false, locked: newAttempts >= MAX_ATTEMPTS };
  };

  const logout = () => {
    setIsAdmin(false);
    setIsEditMode(false);
  };

  const toggleEditMode = () => {
    if (isAdmin) setIsEditMode(!isEditMode);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout, isEditMode, toggleEditMode }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within an AdminProvider');
  return context;
};
