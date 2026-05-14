import { Link } from 'react-router-dom';
import { LayoutTemplate, FileText, Map, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useContent } from '../lib/useContent';
import { EditableText } from '../components/Editable';

const SPRING = { type: 'spring', stiffness: 90, damping: 16 };
const SPRING_SLOW = { type: 'spring', stiffness: 60, damping: 14 };

export function Home() {
  const [content, setContent] = useContent('page_home', {
    title1: 'Fauteuil',
    title2: 'Réception',
    description:
      'Documentation pédagogique pour jury. Une création unique : structure en bois brut, rembourrage en copeaux de mousse recyclée.',
  });

  return (
    <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full py-4 md:py-10">

      {/* ── Hero — split editorial ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="grid grid-cols-1 md:grid-cols-5 gap-0 mb-10 md:mb-14"
      >
        {/* Colonne gauche — texte éditorial */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...SPRING_SLOW, delay: 0.1 }}
          className="md:col-span-2 flex flex-col justify-end pb-4 md:pb-8 md:pr-10 order-2 md:order-1 pt-6 md:pt-0"
        >
          {/* Surtitre */}
          <span className="text-[8px] uppercase tracking-[0.45em] text-secondary/50 font-mono mb-5 block">
            Atelier Hamache — 2026
          </span>

          {/* Titre */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight uppercase leading-[0.9] mb-5 md:mb-6">
            <span className="block">
              <EditableText
                value={content.title1}
                onChange={(val) => setContent({ ...content, title1: val })}
              />
            </span>
            <span className="block text-secondary font-light italic tracking-wide mt-1">
              <EditableText
                value={content.title2}
                onChange={(val) => setContent({ ...content, title2: val })}
              />
            </span>
          </h1>

          {/* Règle éditoriale */}
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.45, duration: 0.7, ease: 'easeOut' }}
            className="w-10 h-px mb-5"
            style={{ background: 'rgba(212,165,116,0.5)' }}
          />

          {/* Description */}
          <div className="text-[13px] md:text-sm text-[#f0e6d3]/65 font-serif leading-relaxed max-w-xs">
            <EditableText
              value={content.description}
              onChange={(val) => setContent({ ...content, description: val })}
              multiline
            />
          </div>
        </motion.div>

        {/* Colonne droite — image magazine */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: 'easeOut', delay: 0.05 }}
          className="md:col-span-3 relative overflow-hidden order-1 md:order-2"
          style={{ minHeight: '280px', maxHeight: '420px', borderRadius: '2px' }}
        >
          <img
            src="./workshop.jpg"
            alt="Atelier Hamache — fauteuil Réception"
            className="w-full h-full object-cover"
            style={{ minHeight: '280px', maxHeight: '420px' }}
          />
          {/* Dégradé gauche pour transition vers le texte */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, rgba(13,10,7,0.85) 0%, rgba(13,10,7,0.3) 35%, transparent 65%)',
            }}
          />
          {/* Dégradé bas */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, rgba(13,10,7,0.7) 0%, transparent 40%)',
            }}
          />
          {/* Label overlay coin bas-droit */}
          <div className="absolute bottom-4 right-4 text-right hidden md:block">
            <span className="text-[7px] uppercase tracking-[0.3em] text-secondary/40 font-mono block">
              Upcycling
            </span>
            <span className="text-[7px] uppercase tracking-[0.3em] text-[#f0e6d3]/25 font-mono block">
              Mousse recyclée
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Séparateur éditorial ── */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
        className="mb-8 md:mb-10 flex items-center gap-4"
        style={{ originX: 0 }}
      >
        <div className="h-px flex-1" style={{ background: 'rgba(212,165,116,0.18)' }} />
        <span className="text-[8px] uppercase tracking-[0.4em] text-secondary/35 font-mono shrink-0">
          Documentation
        </span>
        <div className="h-px flex-1" style={{ background: 'rgba(212,165,116,0.18)' }} />
      </motion.div>

      {/* ── Cards ── */}
      <div className="grid grid-cols-3 gap-2 md:gap-6">
        {[
          {
            title: 'Gabarit',
            fullTitle: '01. Gabarit',
            desc: 'Structure modulaire pour la pièce. Inclut les spécifications et dimensions clés.',
            icon: LayoutTemplate,
            to: '/gabarit',
            accentColor: 'rgba(45,80,22,1)',
            accentColorDim: 'rgba(45,80,22,0.5)',
            glowColor: 'rgba(45,80,22,0.35)',
          },
          {
            title: 'Recette',
            fullTitle: '02. Recette',
            desc: 'Étapes de fabrication détaillées, interactives et éditables avec totaux.',
            icon: FileText,
            to: '/recette',
            accentColor: 'rgba(212,165,116,1)',
            accentColorDim: 'rgba(212,165,116,0.5)',
            glowColor: 'rgba(212,165,116,0.35)',
          },
          {
            title: 'Plan A3',
            fullTitle: '03. Plan A3',
            desc: "Image technique haute-résolution du schéma avec annotations interactives.",
            icon: Map,
            to: '/plan',
            accentColor: 'rgba(139,90,60,1)',
            accentColorDim: 'rgba(139,90,60,0.5)',
            glowColor: 'rgba(139,90,60,0.35)',
          },
        ].map((card, idx) => (
          <motion.div
            key={card.to}
            initial={{ opacity: 0, y: 32, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ ...SPRING, delay: idx * 0.1 + 0.55 }}
            whileHover={{ y: -5, scale: 1.015, transition: { ...SPRING, stiffness: 200, damping: 18 } }}
            className="flex"
          >
            <Link
              to={card.to}
              className="block w-full h-full glass-card group"
              style={{
                borderLeft: `2px solid ${card.accentColorDim}`,
              }}
            >
              {/* Numéro éditorial + icon */}
              <div className="mb-3 md:mb-5 flex items-start justify-between">
                <card.icon
                  className="w-4 h-4 md:w-7 md:h-7 relative z-10 transition-all duration-300 group-hover:scale-110"
                  style={{ color: card.accentColor }}
                />
                <div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                  style={{ background: card.glowColor }}
                />
              </div>

              {/* Titre */}
              <h2 className="text-[8px] sm:text-[10px] md:text-xs uppercase tracking-[0.15em] md:tracking-[0.25em] font-semibold mb-1 md:mb-3 text-[#f0e6d3]/80">
                <span className="md:hidden">{card.title}</span>
                <span className="hidden md:inline">{card.fullTitle}</span>
              </h2>

              {/* Description */}
              <p className="hidden md:block text-[11px] text-[#f0e6d3] leading-relaxed opacity-45 font-serif mb-6 group-hover:opacity-65 transition-opacity">
                {card.desc}
              </p>

              {/* CTA */}
              <div
                className="flex items-center text-[7px] md:text-[9px] font-semibold tracking-widest uppercase mt-auto transition-colors"
                style={{ color: card.accentColor }}
              >
                <motion.div
                  className="flex items-center gap-1"
                  whileHover={{ x: 3 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <ArrowRight className="w-2.5 h-2.5" />
                  <span className="hidden sm:inline">Accéder</span>
                </motion.div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
