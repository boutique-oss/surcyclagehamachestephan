import { createContext, useContext, useState, ReactNode } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  login: (code: string) => boolean;
  logout: () => void;
  isEditMode: boolean;
  toggleEditMode: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('app_admin') === 'true');
  const [isEditMode, setIsEditMode] = useState(false);

  const login = (code: string) => {
    if (code === '4895') {
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
