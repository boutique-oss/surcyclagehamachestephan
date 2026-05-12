import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Lock, Unlock, X, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function AdminButton() {
  const { isAdmin, isEditMode, toggleEditMode, logout, login } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(code)) {
      setShowModal(false);
      setCode('');
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {isAdmin ? (
          <>
            <button
              onClick={toggleEditMode}
              className={`px-4 py-3 text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 border ${
                isEditMode ? 'bg-secondary text-background border-secondary shadow-glow-secondary' : 'bg-[#121a0d] text-secondary border-primary hover:border-secondary'
              } transition-all`}
            >
              <Edit3 className="w-4 h-4" />
              {isEditMode ? 'Quitter Edition' : 'Mode Edition'}
            </button>
            <button
              onClick={logout}
              className="p-3 border border-primary bg-[#121a0d] text-[#f2e9e1]/50 hover:text-red-400 hover:border-red-400 transition-all flex items-center justify-center"
              title="Se déconnecter"
            >
              <Unlock className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            onClick={() => setShowModal(true)}
            className="p-4 border border-primary bg-[#121a0d] text-[#f2e9e1]/50 hover:text-secondary hover:border-secondary transition-all rounded-sm shadow-glow-primary hover:shadow-glow-secondary"
            title="Accès Admin"
          >
            <Lock className="w-5 h-5" />
          </button>
        )}
      </div>

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
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                   <input
                     type="password"
                     value={code}
                     onChange={(e) => {
                       setCode(e.target.value);
                       setError(false);
                     }}
                     className="w-full bg-[#121a0d] border border-primary p-3 text-[#f2e9e1] font-mono tracking-[0.5em] text-center focus:outline-none focus:border-secondary transition-colors"
                     placeholder="****"
                     autoFocus
                   />
                </div>
                {error && <p className="text-[10px] uppercase font-bold text-red-400 text-center">Code incorrect.</p>}
                <button type="submit" className="w-full bg-secondary text-background font-bold uppercase tracking-widest py-3 hover:bg-accent transition-colors">
                  Déverrouiller
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
