import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Lock, Unlock, X, Edit3, ShieldAlert, Save, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminPanel, useErrorCount } from './AdminPanel';

function formatLockoutTime(ms: number): string {
  const min = Math.ceil(ms / 60000);
  return `${min} min`;
}

export function AdminButton() {
  const { isAdmin, isEditMode, toggleEditMode, logout, login } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [locked, setLocked] = useState(false);
  const [lockRemaining, setLockRemaining] = useState(0);
  const [saved, setSaved] = useState(false);
  const errorCount = useErrorCount();

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
    toggleEditMode();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(code);
    if (result.ok) {
      setShowModal(false);
      setCode('');
      setError('');
      setLocked(false);
      // Ouvre automatiquement le panneau admin à la connexion
      setShowPanel(true);
    } else if (result.locked) {
      setLocked(true);
      setLockRemaining(result.remainingMs ?? 0);
      setError('');
    } else {
      setError('Code incorrect.');
    }
  };

  const openModal = () => {
    // Lit l'état de verrouillage depuis sessionStorage (même après rechargement)
    try {
      const raw = sessionStorage.getItem('__s_r');
      if (raw) {
        const rate = JSON.parse(atob(raw));
        const now = Date.now();
        if (rate.lockedUntil > now) {
          setLocked(true);
          setLockRemaining(rate.lockedUntil - now);
        } else {
          setLocked(false);
        }
      }
    } catch {}
    setShowModal(true);
  };

  const handleLogout = () => {
    logout();
    setShowPanel(false);
  };

  return (
    <>
      {/* Boutons flottants */}
      <div className="fixed bottom-6 right-6 z-50 hidden md:flex flex-col gap-2 items-end">
        {isAdmin ? (
          <>
            {/* Bouton panneau admin avec badge erreurs */}
            <button
              onClick={() => setShowPanel((v) => !v)}
              title="Console Admin"
              className={`relative p-2 border transition-all flex items-center justify-center rounded-sm ${
                showPanel
                  ? 'bg-secondary/10 border-secondary text-secondary shadow-glow-secondary'
                  : 'bg-[#121a0d] border-primary text-[#f2e9e1]/30 hover:text-secondary hover:border-secondary'
              }`}
            >
              <LayoutDashboard className="w-3 h-3" />
              {errorCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[7px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none animate-pulse">
                  {errorCount > 9 ? '9+' : errorCount}
                </span>
              )}
            </button>

            {/* Edit / Save */}
            <div className="flex flex-row gap-2 items-center">
              {isEditMode && (
                <button
                  onClick={handleSave}
                  title="Sauvegarder et quitter"
                  className={`p-3 border font-bold flex items-center justify-center gap-2 transition-all ${
                    saved
                      ? 'bg-green-700 border-green-500 text-white'
                      : 'bg-[#121a0d] border-secondary text-secondary hover:bg-secondary hover:text-background'
                  }`}
                >
                  <Save className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={toggleEditMode}
                className={`px-4 py-3 text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 border ${
                  isEditMode
                    ? 'bg-secondary text-background border-secondary shadow-glow-secondary'
                    : 'bg-[#121a0d] text-secondary border-primary hover:border-secondary'
                } transition-all`}
              >
                <Edit3 className="w-4 h-4" />
                {isEditMode ? 'Quitter' : 'Éditer'}
              </button>
            </div>

            {/* Déconnexion */}
            <button
              onClick={handleLogout}
              className="p-3 border border-primary bg-[#121a0d] text-[#f2e9e1]/50 hover:text-red-400 hover:border-red-400 transition-all flex items-center justify-center"
              title="Se déconnecter"
            >
              <Unlock className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            onClick={openModal}
            className="p-4 border border-primary bg-[#121a0d] text-[#f2e9e1]/20 hover:text-secondary hover:border-secondary transition-all rounded-sm shadow-glow-primary hover:shadow-glow-secondary"
            title="Accès Admin"
          >
            <Lock className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Modal de connexion */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel max-w-sm w-full border-l-4 border-l-secondary relative p-8 shadow-glow-secondary"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-[#f2e9e1]/50 hover:text-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-secondary/10 flex items-center justify-center rounded">
                  <Lock className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-[#f2e9e1]">Accès Admin</h2>
                  <p className="text-[10px] text-[#f2e9e1]/50 uppercase tracking-widest mt-1">Édition du site</p>
                </div>
              </div>

              {locked ? (
                <div className="flex flex-col items-center gap-4 py-4">
                  <ShieldAlert className="w-8 h-8 text-red-400" />
                  <p className="text-[11px] text-red-400 text-center uppercase tracking-widest font-bold">
                    Accès temporairement bloqué
                  </p>
                  <p className="text-[10px] text-[#f2e9e1]/40 text-center">
                    Réessayez dans {formatLockoutTime(lockRemaining)}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <input
                    type="password"
                    value={code}
                    onChange={(e) => { setCode(e.target.value); setError(''); }}
                    className="w-full bg-[#121a0d] border border-primary p-3 text-[#f2e9e1] font-mono tracking-[0.3em] text-center focus:outline-none focus:border-secondary transition-colors"
                    placeholder="••••••••"
                    autoFocus
                  />
                  {error && (
                    <p className="text-[10px] uppercase font-bold text-red-400 text-center">{error}</p>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-secondary text-background font-bold uppercase tracking-widest py-3 hover:bg-accent transition-colors"
                  >
                    Déverrouiller
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Panneau Admin */}
      <AnimatePresence>
        {isAdmin && showPanel && <AdminPanel onClose={() => setShowPanel(false)} />}
      </AnimatePresence>
    </>
  );
}
