import { createContext, useContext, useState, ReactNode } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  login: (code: string) => Promise<boolean>;
  logout: () => void;
  isEditMode: boolean;
  toggleEditMode: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_HASH = 'f9a08fb80b89de612e9ce8cffbd695c8eb7b61b2c634b99322ce5095993afcde';

async function hashInput(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const buffer = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('app_admin') === 'true');
  const [isEditMode, setIsEditMode] = useState(false);

  const login = async (code: string): Promise<boolean> => {
    const hash = await hashInput(code);
    if (hash === ADMIN_HASH) {
      setIsAdmin(true);
      localStorage.setItem('app_admin', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    setIsEditMode(false);
    localStorage.removeItem('app_admin');
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
