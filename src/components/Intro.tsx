import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAnim } from '../context/AnimationContext';

const Spline = lazy(() => import('@splinetool/react-spline'));

/* ── Floating particles for intro ── */
const INTRO_PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: 3 + Math.random() * 94,
  size: 0.8 + Math.random() * 2,
  dur: 20 + Math.random() * 25,
  delay: Math.random() * 30,
  opacity: 0.05 + Math.random() * 0.14,
}));

interface IntroProps {
  onEnter: () => void;
}

export function Intro({ onEnter }: IntroProps) {
  const { s } = useAnim();
  const [leaving, setLeaving] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(onEnter, 900);
  };

  // Allow keyboard entry
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') handleClick();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [leaving]);

  return (
    <AnimatePresence>
      {!leaving ? (
        <motion.div
          key="intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          onClick={handleClick}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden"
          style={{ background: '#0a0704' }}
        >
          {/* Spline 3D background */}
          {s.spline && (
            <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.6 }}>
              <Suspense fallback={null}>
                <Spline scene="https://prod.spline.design/tCFrNCbx0Yp4Z8iR/scene.splinecode" />
              </Suspense>
            </div>
          )}

          {/* Particles */}
          {s.particles && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {INTRO_PARTICLES.map(p => (
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
          )}

          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(5,3,1,0.85) 100%)' }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center px-8">

            {/* Logo mark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.9, type: 'spring', stiffness: 80, damping: 14 }}
              className="w-16 h-16 rounded-[3px] flex items-center justify-center font-bold text-[#0d0a07] text-2xl mb-8 logo-shimmer"
              style={{ boxShadow: '0 0 60px rgba(212,165,116,0.3), 0 0 120px rgba(139,90,60,0.15)' }}
            >
              R
            </motion.div>

            {/* Surtitre */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-[9px] uppercase tracking-[0.55em] font-mono mb-4"
              style={{ color: 'rgba(212,165,116,0.45)' }}
            >
              Atelier Hamache — 2026
            </motion.p>

            {/* Titre principal */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.9, type: 'spring', stiffness: 70, damping: 14 }}
              className="text-5xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight leading-[0.9] mb-2"
              style={{ color: '#f0e6d3' }}
            >
              Fauteuil
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.78, duration: 0.9, type: 'spring', stiffness: 70, damping: 14 }}
              className="text-4xl sm:text-5xl md:text-6xl font-light italic tracking-wide"
              style={{ color: '#d4a574' }}
            >
              Réception
            </motion.h2>

            {/* Règle */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 0.7, ease: 'easeOut' }}
              className="w-12 h-px my-8"
              style={{ background: 'rgba(212,165,116,0.4)', originX: '50%' }}
            />

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="text-[13px] font-serif leading-relaxed max-w-xs mb-10"
              style={{ color: 'rgba(240,230,211,0.45)' }}
            >
              Documentation pédagogique pour jury.<br />
              Une création unique en surcyclage.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.35, duration: 0.7 }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className="flex flex-col items-center gap-2"
            >
              <motion.div
                animate={{ scale: hovered ? 1.06 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="px-8 py-3 border rounded-[2px] text-[9px] uppercase tracking-[0.4em] font-bold transition-colors"
                style={{
                  borderColor: hovered ? 'rgba(212,165,116,0.7)' : 'rgba(212,165,116,0.25)',
                  color: hovered ? '#d4a574' : 'rgba(212,165,116,0.55)',
                  boxShadow: hovered ? '0 0 30px rgba(212,165,116,0.12)' : 'none',
                }}
              >
                Entrer
              </motion.div>
              <motion.p
                animate={{ opacity: hovered ? 0 : [0.3, 0.6, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="text-[8px] font-mono uppercase tracking-widest"
                style={{ color: 'rgba(212,165,116,0.3)' }}
              >
                ou appuyer sur Entrée
              </motion.p>
            </motion.div>
          </div>

          {/* Coin bas-gauche */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="absolute bottom-6 left-6 text-left"
          >
            <p className="text-[7px] uppercase tracking-[0.3em] font-mono" style={{ color: 'rgba(212,165,116,0.2)' }}>
              Surcyclage
            </p>
            <p className="text-[7px] uppercase tracking-[0.3em] font-mono" style={{ color: 'rgba(240,230,211,0.12)' }}>
              Mousse recyclée
            </p>
          </motion.div>

          {/* Coin bas-droit */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="absolute bottom-6 right-6 text-right"
          >
            <p className="text-[7px] uppercase tracking-[0.3em] font-mono" style={{ color: 'rgba(212,165,116,0.2)' }}>
              Jury — BTS Design
            </p>
          </motion.div>
        </motion.div>
      ) : (
        /* Transition vers l'app — rideau qui se ferme */
        <motion.div
          key="curtain"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeIn' }}
          className="fixed inset-0 z-[200]"
          style={{ background: '#0a0704' }}
        />
      )}
    </AnimatePresence>
  );
}
