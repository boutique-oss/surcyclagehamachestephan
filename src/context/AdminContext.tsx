import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from 'react';
import { errorMonitor } from '../lib/errorMonitor';

interface AdminContextType {
  isAdmin: boolean;
  isEditMode: boolean;
  login: (code: string) => Promise<{ ok: boolean; locked: boolean; remainingMs?: number }>;
  logout: () => void;
  toggleEditMode: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Hash SHA-256 du mot de passe admin.
// Défini à la compilation via VITE_ADMIN_HASH dans .env.local
// Pour générer : dans la console navigateur → hashPwd('votre_mot_de_passe').then(console.log)
const ADMIN_HASH: string =
  (import.meta.env.VITE_ADMIN_HASH || undefined) ??
  'f9a08fb80b89de612e9ce8cffbd695c8eb7b61b2c634b99322ce5095993afcde';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 1000; // temp — reset lockout
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

// Clé obfusquée — rend la manipulation manuelle moins évidente
const RATE_KEY = '__s_r';

interface RateState {
  attempts: number;
  lockedUntil: number;
}

// Variable module — survit aux remontages React mais se réinitialise au rechargement de page.
// Double protection avec sessionStorage (ne traverse pas les onglets/fenêtres).
let memRate: RateState = { attempts: 0, lockedUntil: 0 };

function loadRate(): RateState {
  try {
    const raw = sessionStorage.getItem(RATE_KEY);
    if (raw) {
      const parsed = JSON.parse(atob(raw)) as RateState;
      // Synchronise la mémoire avec la session (si rechargement de page)
      memRate = { ...parsed };
      return parsed;
    }
  } catch {
    // sessionStorage inaccessible ou données corrompues — fallback mémoire
  }
  return { ...memRate };
}

function saveRate(state: RateState) {
  memRate = { ...state };
  try {
    sessionStorage.setItem(RATE_KEY, btoa(JSON.stringify(state)));
  } catch {
    // sessionStorage plein ou bloqué — la protection mémoire reste active
  }
}

async function hashPwd(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const buffer = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Exposé globalement uniquement en dev pour faciliter la génération du hash
if (import.meta.env.DEV) {
  (window as unknown as Record<string, unknown>).hashPwd = hashPwd;
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Démarre le moniteur d'erreurs dès le chargement de l'app
  useEffect(() => {
    errorMonitor.install();
  }, []);

  const doLogout = useCallback(() => {
    setIsAdmin(false);
    setIsEditMode(false);
  }, []);

  const resetIdleTimer = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(doLogout, SESSION_TIMEOUT_MS);
  }, [doLogout]);

  // Déconnexion automatique après 30 min d'inactivité
  useEffect(() => {
    if (!isAdmin) {
      if (idleTimer.current) {
        clearTimeout(idleTimer.current);
        idleTimer.current = null;
      }
      return;
    }
    resetIdleTimer();
    const events = ['mousemove', 'keydown', 'click', 'touchstart'] as const;
    events.forEach((e) => document.addEventListener(e, resetIdleTimer, { passive: true }));
    return () => {
      events.forEach((e) => document.removeEventListener(e, resetIdleTimer));
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [isAdmin, resetIdleTimer]);

  const login = async (
    code: string
  ): Promise<{ ok: boolean; locked: boolean; remainingMs?: number }> => {
    const now = Date.now();
    const rate = loadRate();

    if (rate.lockedUntil > now) {
      return { ok: false, locked: true, remainingMs: rate.lockedUntil - now };
    }

    const hash = await hashPwd(code);

    if (hash === ADMIN_HASH) {
      saveRate({ attempts: 0, lockedUntil: 0 });
      setIsAdmin(true);
      return { ok: true, locked: false };
    }

    const newAttempts = rate.attempts + 1;
    if (newAttempts >= MAX_ATTEMPTS) {
      saveRate({ attempts: 0, lockedUntil: now + LOCKOUT_MS });
      return { ok: false, locked: true, remainingMs: LOCKOUT_MS };
    }
    saveRate({ attempts: newAttempts, lockedUntil: 0 });
    return { ok: false, locked: false };
  };

  const logout = () => doLogout();

  const toggleEditMode = () => {
    if (isAdmin) setIsEditMode((v) => !v);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, isEditMode, login, logout, toggleEditMode }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin doit être utilisé dans AdminProvider');
  return ctx;
};
