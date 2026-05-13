/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { Gabarit } from './pages/Gabarit';
import { Recette } from './pages/Recette';
import { Plan } from './pages/Plan';
import { Armchair, FileText, LayoutTemplate, Map } from 'lucide-react';
import { cn } from './lib/utils';
import { AdminProvider } from './context/AdminContext';
import { AdminButton } from './components/AdminLogin';

const NAV_LINKS = [
  { to: '/', label: 'Accueil', full: '00. Accueil', icon: Armchair },
  { to: '/gabarit', label: 'Gabarit', full: '01. Gabarit', icon: LayoutTemplate },
  { to: '/recette', label: 'Recette', full: '02. Recette', icon: FileText },
  { to: '/plan', label: 'Plan A3', full: '03. Plan A3', icon: Map },
];

function TopBar() {
  const location = useLocation();
  return (
    <nav className="fixed top-0 w-full z-50 h-14 md:h-16 flex items-center justify-between px-4 md:px-10 border-b border-primary bg-[#1a2514]">
      <Link to="/" className="flex items-center gap-3">
        <div className="w-7 h-7 md:w-8 md:h-8 bg-secondary rounded-sm flex items-center justify-center font-bold text-background text-sm">R</div>
        <h1 className="text-base md:text-xl font-bold tracking-widest uppercase hidden sm:block">
          Réception
        </h1>
      </Link>

      {/* Desktop nav links uniquement */}
      <div className="hidden md:flex gap-8 text-xs font-semibold uppercase tracking-tighter">
        {NAV_LINKS.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "transition-colors pb-1 border-b flex items-center gap-2",
                isActive ? "text-secondary border-secondary" : "text-[#f2e9e1] border-transparent hover:text-secondary opacity-70 hover:opacity-100"
              )}
            >
              <link.icon className="w-4 h-4" />
              <span>{link.full}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function BottomNav() {
  const location = useLocation();
  return (
    <nav className="fixed bottom-0 w-full z-50 h-14 md:hidden flex items-center justify-around border-t border-primary bg-[#1a2514]/95 backdrop-blur-sm">
      {NAV_LINKS.map((link) => {
        const isActive = location.pathname === link.to;
        return (
          <Link
            key={link.to}
            to={link.to}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-1 transition-colors",
              isActive ? "text-secondary" : "text-[#f2e9e1]/40 hover:text-secondary"
            )}
          >
            <link.icon className="w-5 h-5" />
            <span className="text-[8px] uppercase tracking-wide">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <HashRouter>
        <div className="min-h-screen bg-background text-[#f2e9e1] flex flex-col pt-14 md:pt-16 font-sans">
          <TopBar />
          <BottomNav />
          <AdminButton />
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-10 flex flex-col relative pb-16 md:pb-0">
            <div className="fixed inset-0 w-full h-full opacity-20 pointer-events-none" style={{backgroundImage: 'radial-gradient(var(--color-primary) 1px, transparent 1px)', backgroundSize: '24px 24px'}}></div>
            <div className="relative z-10 flex-1 flex flex-col w-full h-full">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/gabarit" element={<Gabarit />} />
                <Route path="/recette" element={<Recette />} />
                <Route path="/plan" element={<Plan />} />
              </Routes>
            </div>
          </main>
        </div>
      </HashRouter>
    </AdminProvider>
  );
}
