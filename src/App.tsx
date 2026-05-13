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

function Navigation() {
  const location = useLocation();
  const links = [
    { to: '/', label: '00. Accueil', icon: Armchair },
    { to: '/gabarit', label: '01. Gabarit', icon: LayoutTemplate },
    { to: '/recette', label: '02. Recette', icon: FileText },
    { to: '/plan', label: '03. Plan A3', icon: Map },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 h-16 flex items-center justify-between px-10 border-b border-primary bg-[#1a2514]">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-4">
          <div className="w-8 h-8 bg-secondary rounded-sm flex items-center justify-center font-bold text-background">R</div>
          <h1 className="text-xl font-bold tracking-widest uppercase hidden md:block">
            Réception <span className="text-secondary opacity-80 font-normal">— Atelier Hamache</span>
          </h1>
        </Link>
      </div>
      <div className="flex gap-4 md:gap-8 text-xs font-semibold uppercase tracking-tighter">
        {links.map((link) => {
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
              <link.icon className="w-4 h-4 hidden sm:block" />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <HashRouter>
        <div className="min-h-screen bg-background text-[#f2e9e1] flex flex-col pt-16 font-sans">
          <Navigation />
          <AdminButton />
          <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 flex flex-col relative">
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
