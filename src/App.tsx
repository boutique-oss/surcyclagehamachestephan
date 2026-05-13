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

/* ── Liquid glass blobs (fixed, full-screen overlay) ── */
function LiquidBackground() {
  return (
    <div aria-hidden className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Blob 1 — vert primaire, coin haut-gauche */}
      <div
        className="liquid-blob"
        style={{
          width: '700px',
          height: '700px',
          top: '-200px',
          left: '-200px',
          background:
            'radial-gradient(circle at 40% 40%, rgba(45,80,22,0.55) 0%, rgba(45,80,22,0.2) 45%, transparent 70%)',
          filter: 'blur(90px)',
          animation: 'liquid-blob-1 22s ease-in-out infinite',
          opacity: 0.45,
        }}
      />

      {/* Blob 2 — doré secondaire, coin bas-droit */}
      <div
        className="liquid-blob"
        style={{
          width: '580px',
          height: '580px',
          bottom: '-150px',
          right: '-150px',
          background:
            'radial-gradient(circle at 55% 55%, rgba(212,165,116,0.5) 0%, rgba(212,165,116,0.18) 45%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'liquid-blob-2 28s ease-in-out infinite',
          opacity: 0.38,
        }}
      />

      {/* Blob 3 — accent brun, centre */}
      <div
        className="liquid-blob"
        style={{
          width: '420px',
          height: '420px',
          top: '35%',
          left: '38%',
          background:
            'radial-gradient(circle at 50% 50%, rgba(139,90,60,0.45) 0%, rgba(139,90,60,0.12) 45%, transparent 70%)',
          filter: 'blur(70px)',
          animation: 'liquid-blob-3 19s ease-in-out infinite reverse',
          opacity: 0.28,
        }}
      />

      {/* Blob 4 — vert doux, coin haut-droit */}
      <div
        className="liquid-blob"
        style={{
          width: '350px',
          height: '350px',
          top: '-60px',
          right: '10%',
          background:
            'radial-gradient(circle at 50% 50%, rgba(45,80,22,0.4) 0%, rgba(45,80,22,0.1) 50%, transparent 70%)',
          filter: 'blur(65px)',
          animation: 'liquid-blob-1 16s ease-in-out infinite 4s',
          opacity: 0.22,
        }}
      />

      {/* Grille de points subtile */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(212,165,116,0.18) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.6,
        }}
      />

      {/* Vignette bords */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(18,26,13,0.7) 100%)',
        }}
      />
    </div>
  );
}

function TopBar() {
  const location = useLocation();
  return (
    <nav
      className="fixed top-0 w-full z-50 h-14 md:h-16 flex items-center justify-between px-4 md:px-10 border-b"
      style={{
        background: 'rgba(18,26,13,0.7)',
        backdropFilter: 'blur(24px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
        borderBottomColor: 'rgba(212,165,116,0.18)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset, 0 4px 24px rgba(18,26,13,0.6)',
      }}
    >
      <Link to="/" className="flex items-center gap-3 group">
        <div
          className="w-7 h-7 md:w-8 md:h-8 rounded-sm flex items-center justify-center font-bold text-background text-sm transition-all group-hover:scale-110"
          style={{
            background: 'linear-gradient(135deg, #d4a574 0%, #8b5a3c 100%)',
            boxShadow: '0 0 16px rgba(212,165,116,0.4)',
          }}
        >
          R
        </div>
        <h1 className="text-base md:text-xl font-bold tracking-widest uppercase hidden sm:block">
          Réception
        </h1>
      </Link>

      <div className="hidden md:flex gap-8 text-xs font-semibold uppercase tracking-tighter">
        {NAV_LINKS.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'transition-all pb-1 border-b flex items-center gap-2',
                isActive
                  ? 'text-secondary border-secondary'
                  : 'text-[#f2e9e1] border-transparent hover:text-secondary opacity-60 hover:opacity-100'
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
    <nav
      className="fixed bottom-0 w-full z-50 h-14 md:hidden flex items-center justify-around border-t"
      style={{
        background: 'rgba(18,26,13,0.75)',
        backdropFilter: 'blur(24px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
        borderTopColor: 'rgba(212,165,116,0.15)',
      }}
    >
      {NAV_LINKS.map((link) => {
        const isActive = location.pathname === link.to;
        return (
          <Link
            key={link.to}
            to={link.to}
            className={cn(
              'flex flex-col items-center gap-0.5 px-3 py-1 transition-all',
              isActive ? 'text-secondary' : 'text-[#f2e9e1]/40 hover:text-secondary'
            )}
          >
            <link.icon className={cn('w-5 h-5 transition-all', isActive && 'drop-shadow-[0_0_8px_rgba(212,165,116,0.8)]')} />
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
          <LiquidBackground />
          <TopBar />
          <BottomNav />
          <AdminButton />
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-10 flex flex-col relative pb-16 md:pb-0" style={{ zIndex: 1 }}>
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
