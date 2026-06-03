import { useState } from 'react';
import { Download, FileText, FolderOpen, Maximize2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useContent } from '../lib/useContent';
import { useAdmin } from '../context/AdminContext';
import { PlanPdfManager } from '../components/PlanPdfManager';

interface PlanContent {
  plan1Url: string;
  plan2Url: string;
  plan3Url: string;
}

const defaultContent: PlanContent = {
  plan1Url: '',
  plan2Url: '',
  plan3Url: '',
};

const PLAN_LABELS = ['Plan Bois', 'Plan Mousse', 'Plan Ensemble'] as const;
const PLAN_KEYS = ['plan1Url', 'plan2Url', 'plan3Url'] as const;

export function Plan() {
  const { isEditMode } = useAdmin();
  const [content, setContent] = useContent<PlanContent>('page_plan_v2', defaultContent);
  const [fullscreen, setFullscreen] = useState<{ label: string; url: string } | null>(null);

  const handleChange = (key: 'plan1Url' | 'plan2Url' | 'plan3Url', url: string) => {
    setContent({ ...content, [key]: url });
  };

  const plans = PLAN_KEYS.map((key, i) => ({
    key,
    label: PLAN_LABELS[i],
    url: content[key],
  }));

  const hasAnyPlan = plans.some(p => p.url);

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col gap-6 md:gap-10 pb-6 md:pb-16 pt-2 md:pt-4">

      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between gap-4 border-b border-primary pb-5 md:pb-7"
      >
        <div>
          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-secondary/70 font-mono mb-1">
            Plans techniques
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-[#f0e6d3] leading-tight">
            Plan
          </h1>
          <p className="text-[11px] md:text-sm text-[#f0e6d3]/50 font-serif mt-1">
            Fauteuil Réception — impression A3 recommandée
          </p>
        </div>
      </motion.div>

      {/* Plans empilés — 1 par ligne */}
      <div className="flex flex-col gap-6 md:gap-8">
        {plans.map(({ key, label, url }, idx) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + idx * 0.08 }}
            className="flex flex-col gap-3"
          >
            {/* Carte PDF — plein format */}
            <div
              className="glass-panel rounded-xl border border-primary/30 overflow-hidden flex flex-col"
              style={{ minHeight: 480 }}
            >
              {/* Barre de titre */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-primary/20 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-secondary" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">{label}</span>
                </div>
                <div className="flex items-center gap-3">
                  {url && (
                    <>
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        download
                        className="text-[#f0e6d3]/40 hover:text-secondary transition-colors"
                        title="Télécharger"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => setFullscreen({ label, url })}
                        className="text-[#f0e6d3]/40 hover:text-secondary transition-colors"
                        title="Plein écran"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Visionneuse */}
              <div className="flex-1">
                {url ? (
                  <iframe
                    src={url}
                    title={label}
                    className="w-full h-full"
                    style={{ minHeight: 440, border: 'none' }}
                  />
                ) : (
                  <div
                    className="flex flex-col items-center justify-center gap-3 text-[#f0e6d3]/20"
                    style={{ minHeight: 440 }}
                  >
                    <div className="w-14 h-14 border-2 border-dashed border-[#f0e6d3]/10 rounded flex items-center justify-center">
                      <FileText className="w-7 h-7 opacity-30" />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-center px-4">
                      {isEditMode ? 'Importer un PDF ci-dessous' : 'Plan à venir'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bouton téléchargement */}
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                download
                className="self-start flex items-center gap-2 py-2 px-5 border border-secondary/30 text-[10px] text-secondary uppercase tracking-widest font-bold hover:bg-secondary hover:text-background transition-colors rounded-lg"
              >
                <Download className="w-3.5 h-3.5" />
                Télécharger {label}
              </a>
            )}
          </motion.div>
        ))}
      </div>

      {/* Message si aucun plan */}
      {!hasAnyPlan && !isEditMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-panel rounded-xl border border-primary/20 flex items-center gap-3 px-6 py-5 opacity-40"
        >
          <FileText className="w-4 h-4 text-[#f0e6d3]/30" />
          <span className="text-[10px] text-[#f0e6d3]/30 uppercase tracking-widest">
            Plans techniques — bientôt disponibles
          </span>
        </motion.div>
      )}

      {/* Section admin — import PDF */}
      {isEditMode && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col gap-4"
        >
          <div className="flex items-center gap-3 border-b border-primary pb-3">
            <FolderOpen className="w-4 h-4 text-secondary flex-shrink-0" />
            <h2 className="text-xs md:text-sm uppercase tracking-[0.2em] font-bold text-secondary">
              Importer les plans PDF
            </h2>
            <span className="text-[9px] bg-secondary/10 text-secondary border border-secondary/30 px-1.5 py-0.5 rounded uppercase tracking-widest">
              Admin
            </span>
          </div>

          <PlanPdfManager
            plan1Url={content.plan1Url}
            plan2Url={content.plan2Url}
            plan3Url={content.plan3Url}
            onChange={handleChange}
          />
        </motion.div>
      )}

      {/* ── Modal plein écran ── */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex flex-col"
            style={{ background: 'rgba(6,4,2,0.97)' }}
          >
            {/* Barre plein écran */}
            <div
              className="flex items-center justify-between px-5 py-3 border-b flex-shrink-0"
              style={{ borderColor: 'rgba(212,165,116,0.15)' }}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-secondary" />
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-secondary">
                  {fullscreen.label}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href={fullscreen.url}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#f0e6d3]/50 hover:text-secondary transition-colors border border-[#f0e6d3]/15 hover:border-secondary/40 px-3 py-1.5 rounded-lg"
                >
                  <Download className="w-3.5 h-3.5" />
                  Télécharger
                </a>
                <button
                  onClick={() => setFullscreen(null)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-[#f0e6d3]/60 hover:text-[#f0e6d3] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Iframe plein écran */}
            <div className="flex-1 overflow-hidden">
              <iframe
                src={fullscreen.url}
                title={fullscreen.label}
                className="w-full h-full"
                style={{ border: 'none' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
