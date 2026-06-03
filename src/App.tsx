/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { Home } from './pages/Home';
import { Gabarit } from './pages/Gabarit';
import { Recette } from './pages/Recette';
import { Plan } from './pages/Plan';
import { Armchair, FileText, LayoutTemplate, Map } from 'lucide-react';
import { cn } from './lib/utils';
import { AdminProvider } from './context/AdminContext';
import { AdminButton } from './components/AdminLogin';
import { AnimationProvider, useAnim } from './context/AnimationContext';

const NAV_LINKS = [
  { to: '/', label: 'Accueil', full: 'Accueil', icon: Armchair },
  { to: '/recette', label: 'Recette', full: 'Recette', icon: FileText },
  { to: '/plan', label: 'Plan', full: 'Plan', icon: Map },
  { to: '/gabarit', label: 'CNC', full: 'CNC', icon: LayoutTemplate },
];

/* ── Floating amber particles ── */
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: 3 + Math.random() * 94,
  size: 0.8 + Math.random() * 2.2,
  dur: 22 + Math.random() * 28,
  delay: Math.random() * 35,
  opacity: 0.06 + Math.random() * 0.16,
}));

function ParticleLayer() {
  const { s } = useAnim();
  if (!s.particles) return null;
  return (
    <div aria-hidden className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {PARTICLES.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            bottom: '-4px',
            left: `${p.x}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            background: 'rgba(212,165,116,0.9)',
            animation: `particle-rise ${p.dur}s ease-in ${p.delay}s infinite`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}

/* ── Scanline ── */
function ScanlineLayer() {
  const { s } = useAnim();
  if (!s.scanline) return null;
  return (
    <div aria-hidden className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(to right, transparent 0%, rgba(212,165,116,0.4) 30%, rgba(255,220,140,0.25) 50%, rgba(212,165,116,0.4) 70%, transparent 100%)',
          animation: 'scanline-sweep 14s ease-in-out 4s infinite',
          opacity: 0,
        }}
      />
    </div>
  );
}

/* ── Cursor glow ── */
function CursorGlow() {
  const { s } = useAnim();
  const [pos, setPos] = useState({ x: -999, y: -999 });

  useEffect(() => {
    if (!s.cursorGlow) return;
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [s.cursorGlow]);

  if (!s.cursorGlow) return null;
  return (
    <div
      aria-hidden
      className="fixed pointer-events-none"
      style={{
        zIndex: 0,
        left: pos.x - 220,
        top: pos.y - 220,
        width: '440px',
        height: '440px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,90,60,0.07) 0%, rgba(212,165,116,0.03) 45%, transparent 70%)',
        transition: 'left 0.12s ease-out, top 0.12s ease-out',
      }}
    />
  );
}

/* ── Warm editorial blobs ── */
function LiquidBackground() {
  const { s } = useAnim();
  const scale = s.blobIntensity / 100;
  return (
    <div aria-hidden className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Blob 1 — vert forêt, coin haut-gauche */}
      <div
        className="liquid-blob"
        style={{
          width: '700px', height: '700px', top: '-200px', left: '-200px',
          background: 'radial-gradient(circle at 40% 40%, rgba(45,80,22,0.4) 0%, rgba(45,80,22,0.12) 50%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'liquid-blob-1 26s ease-in-out infinite',
          opacity: 0.28 * scale,
        }}
      />
      {/* Blob 2 — ambre chaud, coin bas-droit */}
      <div
        className="liquid-blob"
        style={{
          width: '640px', height: '640px', bottom: '-160px', right: '-160px',
          background: 'radial-gradient(circle at 55% 55%, rgba(212,140,70,0.6) 0%, rgba(180,110,50,0.22) 45%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'liquid-blob-2 32s ease-in-out infinite',
          opacity: 0.42 * scale,
        }}
      />
      {/* Blob 3 — brun cuir, centre */}
      <div
        className="liquid-blob"
        style={{
          width: '480px', height: '480px', top: '30%', left: '40%',
          background: 'radial-gradient(circle at 50% 50%, rgba(139,90,60,0.5) 0%, rgba(100,60,30,0.15) 45%, transparent 70%)',
          filter: 'blur(75px)',
          animation: 'liquid-blob-3 22s ease-in-out infinite reverse',
          opacity: 0.34 * scale,
        }}
      />
      {/* Blob 4 — or safran, coin haut-droit */}
      <div
        className="liquid-blob"
        style={{
          width: '380px', height: '380px', top: '-80px', right: '8%',
          background: 'radial-gradient(circle at 50% 50%, rgba(200,150,60,0.45) 0%, rgba(160,110,40,0.12) 50%, transparent 70%)',
          filter: 'blur(70px)',
          animation: 'liquid-blob-1 20s ease-in-out infinite 5s',
          opacity: 0.28 * scale,
        }}
      />
      {/* Grille de points */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(180,130,70,0.12) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.5 * scale,
        }}
      />
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 38%, rgba(8,5,2,0.75) 100%)' }}
      />
    </div>
  );
}

function TopBar() {
  const location = useLocation();
  const { s } = useAnim();
  return (
    <nav
      className="fixed top-0 w-full z-50 h-14 md:h-16 flex items-center justify-between px-4 md:px-12 border-b"
      style={{
        background: 'rgba(10,7,4,0.72)',
        backdropFilter: 'blur(28px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
        borderBottomColor: 'rgba(212,165,116,0.14)',
        boxShadow: '0 1px 0 rgba(255,220,150,0.03) inset, 0 4px 32px rgba(5,3,1,0.7)',
      }}
    >
      <Link to="/" className="flex items-center gap-3 group">
        <div
          className={cn(
            'w-7 h-7 md:w-8 md:h-8 rounded-[2px] flex items-center justify-center font-bold text-sm transition-all group-hover:scale-110',
            s.logoShimmer ? 'logo-shimmer' : 'text-[#0d0a07]'
          )}
          style={s.logoShimmer ? {
            boxShadow: '0 0 20px rgba(212,165,116,0.35)',
            border: '1px solid rgba(212,165,116,0.5)',
          } : {
            background: 'linear-gradient(135deg, #d4a574 0%, #8b5a3c 100%)',
            boxShadow: '0 0 20px rgba(212,165,116,0.35)',
          }}
        >
          <span className={s.logoShimmer ? '' : ''}>R</span>
        </div>
        <div className="hidden sm:flex flex-col leading-none">
          <span className="text-[8px] uppercase tracking-[0.35em] text-secondary/50 font-mono">Atelier Hamache</span>
          <span className="text-sm md:text-base font-bold tracking-[0.15em] uppercase text-[#f0e6d3]">Réception</span>
        </div>
      </Link>

      <div className="hidden md:flex gap-10 text-[10px] font-semibold uppercase tracking-widest">
        {NAV_LINKS.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'transition-all pb-1 border-b flex items-center gap-2',
                isActive
                  ? 'text-secondary border-secondary/70'
                  : 'text-[#f0e6d3] border-transparent hover:text-secondary opacity-45 hover:opacity-100'
              )}
            >
              <link.icon className="w-3.5 h-3.5" />
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
        background: 'rgba(10,7,4,0.8)',
        backdropFilter: 'blur(28px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
        borderTopColor: 'rgba(212,165,116,0.12)',
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
              isActive ? 'text-secondary' : 'text-[#f0e6d3]/35 hover:text-secondary'
            )}
          >
            <link.icon className={cn('w-5 h-5 transition-all', isActive && 'drop-shadow-[0_0_10px_rgba(212,165,116,0.7)]')} />
            <span className="text-[8px] uppercase tracking-wide">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function AppInner() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-background text-[#f0e6d3] flex flex-col pt-14 md:pt-16 font-sans">
        <LiquidBackground />
        <ParticleLayer />
        <ScanlineLayer />
        <CursorGlow />
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
  );
}

export default function App() {
  return (
    <AnimationProvider>
      <AdminProvider>
        <AppInner />
      </AdminProvider>
    </AnimationProvider>
  );
}
