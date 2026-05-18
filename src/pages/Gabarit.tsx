import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Ruler, Weight, Download, Archive, FolderOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { useContent } from '../lib/useContent';
import { EditableText, EditableImage } from '../components/Editable';
import { useAdmin } from '../context/AdminContext';
import { GabaritFileManager } from '../components/GabaritFileManager';

export function Gabarit() {
  const { isEditMode } = useAdmin();

  const [content, setContent] = useContent('page_gabarit', {
    heroImage: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1600&auto=format&fit=crop',
    title1: 'Fauteuil',
    title2: 'Réception',
    description: 'Une approche éco-responsable alliant la noblesse du bois brut au recyclage innovant de copeaux de mousse.',
    specsMaterials: 'Chêne massif local (structure), Copeaux de mousse HR recyclée (rembourrage), Tissu laine bouillie.',
    specsDimWidth: '75',
    specsDimDepth: '82',
    specsDimDesc: 'H. 90cm • Assise 42cm',
    specsWeight: '18.5',
    specsFinishes: 'Huile de lin naturelle (bois), Surpiqûres cognac apparentes.',
    gabaritImage: '',
    zipUrl: '',
  });

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col gap-5 md:gap-10 pb-6 md:pb-12 pt-3 md:pt-6">

      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full h-[30vh] sm:h-[38vh] md:h-[45vh] min-h-[200px] md:min-h-[350px] rounded-xl md:rounded-2xl overflow-hidden shadow-glow-primary border border-primary/20"
      >
        <EditableImage
          src={content.heroImage}
          onChange={(val) => setContent({ ...content, heroImage: val })}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-transparent pointer-events-none" />

        <div className="absolute bottom-0 left-0 p-4 sm:p-6 md:p-10 w-full">
          <div className="text-[9px] md:text-[10px] uppercase text-secondary tracking-widest mb-1 md:mb-3">Preview : Vue d'ensemble</div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-widest uppercase mb-2 md:mb-4 text-[#f2e9e1] flex gap-2 md:gap-3 flex-wrap">
            <EditableText value={content.title1} onChange={(val) => setContent({ ...content, title1: val })} />
            <EditableText value={content.title2} onChange={(val) => setContent({ ...content, title2: val })} className="text-secondary font-normal" />
          </h1>
          <div className="text-xs md:text-base text-[#f2e9e1] opacity-80 max-w-2xl font-serif hidden sm:block">
            <EditableText value={content.description} onChange={(val) => setContent({ ...content, description: val })} multiline />
          </div>
        </div>
      </motion.div>

      {/* ── Specs + CTAs ── */}
      <div className="grid md:grid-cols-3 gap-3 md:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2 glass-card border-l-4 border-l-secondary flex flex-col justify-center bg-[#162111]/80 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-4 md:mb-8">
            <h2 className="text-xs md:text-sm uppercase tracking-[0.2em] font-bold text-secondary">Spécifications</h2>
            <span className="text-[10px] text-[#f2e9e1] opacity-50">ID: FR-01</span>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-8">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] md:text-[10px] text-secondary uppercase tracking-widest flex items-center gap-1.5"><Leaf className="w-3 h-3" /> Matériaux</span>
              <div className="text-[10px] md:text-[11px] text-[#f2e9e1] leading-relaxed opacity-70 font-serif mt-1">
                <EditableText value={content.specsMaterials} onChange={(val) => setContent({ ...content, specsMaterials: val })} multiline />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[9px] md:text-[10px] text-secondary uppercase tracking-widest flex items-center gap-1.5"><Ruler className="w-3 h-3" /> Dimensions</span>
              <div className="text-2xl md:text-3xl font-light mt-1 flex items-baseline gap-1.5 md:gap-2">
                <EditableText value={content.specsDimWidth} onChange={(val) => setContent({ ...content, specsDimWidth: val })} />
                <span className="text-xs text-secondary">x</span>
                <EditableText value={content.specsDimDepth} onChange={(val) => setContent({ ...content, specsDimDepth: val })} />
                <span className="text-xs text-secondary">cm</span>
              </div>
              <div className="text-[9px] md:text-[10px] text-[#f2e9e1] opacity-50 uppercase tracking-wide mt-1">
                <EditableText value={content.specsDimDesc} onChange={(val) => setContent({ ...content, specsDimDesc: val })} />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[9px] md:text-[10px] text-secondary uppercase tracking-widest flex items-center gap-1.5"><Weight className="w-3 h-3" /> Poids</span>
              <div className="text-2xl md:text-3xl font-light mt-1 flex items-baseline gap-1.5 md:gap-2">
                <EditableText value={content.specsWeight} onChange={(val) => setContent({ ...content, specsWeight: val })} />
                <span className="text-xs text-secondary">kg</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[9px] md:text-[10px] text-secondary uppercase tracking-widest">Finitions</span>
              <div className="text-[10px] md:text-[11px] text-[#f2e9e1] leading-relaxed opacity-70 font-serif mt-1">
                <EditableText value={content.specsFinishes} onChange={(val) => setContent({ ...content, specsFinishes: val })} multiline />
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-row md:flex-col gap-3 md:gap-4"
        >
          <Link to="/recette" className="group glass-card flex-1 flex flex-col justify-center items-center text-center hover:bg-secondary hover:text-background transition-colors border border-secondary shadow-glow-secondary">
            <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1 md:mb-2 transition-colors">02. Recette</h3>
            <p className="text-[9px] md:text-[10px] opacity-70 tracking-widest uppercase mb-2 md:mb-4 group-hover:opacity-100 hidden sm:block">Étapes &amp; coûts</p>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link to="/plan" className="group glass-card flex-1 flex flex-col justify-center items-center text-center hover:bg-accent hover:text-[#f2e9e1] transition-colors border border-accent shadow-glow">
            <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1 md:mb-2 transition-colors">03. Plan A3</h3>
            <p className="text-[9px] md:text-[10px] opacity-70 tracking-widest uppercase mb-2 md:mb-4 group-hover:opacity-100 hidden sm:block">Schéma interactif</p>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-all" />
          </Link>
        </motion.div>
      </div>

      {/* ── Image gabarit (plan) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col gap-3"
      >
        <div className="flex items-center gap-3 border-b border-primary pb-3">
          <h2 className="text-xs md:text-sm uppercase tracking-[0.2em] font-bold text-secondary">Vue gabarit</h2>
          <span className="text-[10px] text-[#f2e9e1] opacity-40 uppercase tracking-widest">Plan coté</span>
        </div>

        <div className="relative w-full rounded-xl overflow-hidden border border-secondary/20 bg-[#0a100a] min-h-[180px]">
          {(content.gabaritImage || isEditMode) ? (
            <EditableImage
              src={content.gabaritImage}
              onChange={(val) => setContent({ ...content, gabaritImage: val })}
              className="w-full object-contain max-h-[70vh]"
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-[#f2e9e1]/20">
              <div className="w-16 h-16 border-2 border-dashed border-[#f2e9e1]/10 rounded flex items-center justify-center">
                <svg viewBox="0 0 64 64" className="w-8 h-8 opacity-30" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="8" y="12" width="48" height="40" rx="2" />
                  <line x1="8" y1="24" x2="56" y2="24" />
                  <line x1="8" y1="36" x2="56" y2="36" />
                  <line x1="20" y1="12" x2="20" y2="52" />
                </svg>
              </div>
              <span className="text-[10px] uppercase tracking-widest">Image gabarit à venir</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Téléchargement ZIP ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {content.zipUrl ? (
          <div className="glass-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-accent/30">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Archive className="w-4 h-4 text-accent flex-shrink-0" />
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-accent">Gabarits à télécharger</h3>
              </div>
              <p className="text-[10px] text-[#f2e9e1]/50 font-serif pl-6">
                Fichiers PDF côtés — impression A3 recommandée.
              </p>
            </div>
            <a
              href={content.zipUrl}
              download
              className="flex items-center gap-2 px-5 py-2.5 bg-accent/10 hover:bg-accent hover:text-[#f2e9e1] border border-accent text-accent text-[11px] uppercase tracking-widest font-bold rounded-lg transition-colors flex-shrink-0"
            >
              <Download className="w-4 h-4" />
              Télécharger .zip
            </a>
          </div>
        ) : (
          !isEditMode && (
            <div className="glass-card flex items-center gap-3 border border-primary/20 opacity-40">
              <Archive className="w-4 h-4 text-[#f2e9e1]/30" />
              <span className="text-[10px] text-[#f2e9e1]/30 uppercase tracking-widest">Fichiers gabarits — bientôt disponibles</span>
            </div>
          )
        )}
      </motion.div>

      {/* ── Gestionnaire admin (mode édition uniquement) ── */}
      {isEditMode && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center gap-3 border-b border-primary pb-3">
            <FolderOpen className="w-4 h-4 text-secondary flex-shrink-0" />
            <h2 className="text-xs md:text-sm uppercase tracking-[0.2em] font-bold text-secondary">Gestionnaire fichiers</h2>
            <span className="text-[9px] bg-secondary/10 text-secondary border border-secondary/30 px-1.5 py-0.5 rounded uppercase tracking-widest">Admin</span>
          </div>

          <GabaritFileManager
            zipUrl={content.zipUrl}
            onZipUrlChange={(url) => setContent({ ...content, zipUrl: url })}
          />
        </motion.div>
      )}

      <footer className="mt-auto text-center border-t border-primary pt-4 md:pt-6 flex justify-between text-[9px] uppercase tracking-widest text-secondary">
        <span>&copy; 2026 Atelier Réception</span>
        <span>Modèle Gabarit</span>
      </footer>
    </div>
  );
}
