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
    <div className="flex-1 flex flex-col justify-center max-w-5xl mx-auto w-full py-6 md:py-12">
      {/* ── Hero title ── */}
      <motion.div
        initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ ...SPRING_SLOW, delay: 0.05 }}
        className="text-center mb-8 md:mb-16"
      >
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-widest uppercase mb-4 md:mb-6 flex flex-wrap justify-center gap-2 md:gap-4">
          <EditableText
            value={content.title1}
            onChange={(val) => setContent({ ...content, title1: val })}
          />
          <EditableText
            value={content.title2}
            onChange={(val) => setContent({ ...content, title2: val })}
            className="text-secondary font-normal"
          />
        </h1>

        {/* Description avec ligne décorative */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
          className="w-16 h-px bg-secondary/50 mx-auto mb-4"
        />

        <div className="text-sm md:text-xl text-[#f2e9e1] opacity-70 max-w-2xl mx-auto font-serif px-2">
          <EditableText
            value={content.description}
            onChange={(val) => setContent({ ...content, description: val })}
            multiline
          />
        </div>
      </motion.div>

      {/* ── Cards ── */}
      <div className="grid grid-cols-3 gap-2 md:gap-8">
        {[
          {
            title: 'Gabarit',
            fullTitle: '01. Gabarit',
            desc: 'Structure modulaire pour la pièce. Inclut les spécifications et dimensions clés.',
            icon: LayoutTemplate,
            to: '/gabarit',
            color: 'primary',
            accentColor: 'rgba(45,80,22,1)',
            glowColor: 'rgba(45,80,22,0.4)',
          },
          {
            title: 'Recette',
            fullTitle: '02. Recette',
            desc: 'Étapes de fabrication détaillées, interactives et éditables avec totaux.',
            icon: FileText,
            to: '/recette',
            color: 'secondary',
            accentColor: 'rgba(212,165,116,1)',
            glowColor: 'rgba(212,165,116,0.4)',
          },
          {
            title: 'Plan A3',
            fullTitle: '03. Plan A3',
            desc: "Image technique haute-résolution du schéma avec annotations interactives.",
            icon: Map,
            to: '/plan',
            color: 'accent',
            accentColor: 'rgba(139,90,60,1)',
            glowColor: 'rgba(139,90,60,0.4)',
          },
        ].map((card, idx) => (
          <motion.div
            key={card.to}
            initial={{ opacity: 0, y: 40, scale: 0.94, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            transition={{ ...SPRING, delay: idx * 0.12 + 0.25 }}
            whileHover={{ y: -6, scale: 1.02, transition: { ...SPRING, stiffness: 200, damping: 18 } }}
            className="flex"
          >
            <Link
              to={card.to}
              className="block w-full h-full glass-card group"
              style={{
                borderLeft: `3px solid ${card.accentColor}`,
              }}
            >
              {/* Icon avec halo */}
              <div className="mb-2 md:mb-5 relative">
                <card.icon
                  className="w-5 h-5 md:w-8 md:h-8 relative z-10 transition-all duration-300 group-hover:scale-110"
                  style={{ color: card.accentColor }}
                />
                <div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                  style={{ background: card.glowColor }}
                />
              </div>

              {/* Titre */}
              <h2 className="text-[9px] sm:text-[11px] md:text-sm uppercase tracking-[0.1em] md:tracking-[0.2em] font-bold mb-1 md:mb-3">
                <span className="md:hidden">{card.title}</span>
                <span className="hidden md:inline">{card.fullTitle}</span>
              </h2>

              {/* Description */}
              <p className="hidden md:block text-[11px] text-[#f2e9e1] leading-relaxed opacity-60 font-serif mb-6 group-hover:opacity-80 transition-opacity">
                {card.desc}
              </p>

              {/* CTA */}
              <div className="flex items-center text-[8px] md:text-[10px] font-bold tracking-widest uppercase mt-auto transition-colors"
                style={{ color: card.accentColor }}>
                <motion.div
                  className="flex items-center gap-1"
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <ArrowRight className="w-3 h-3" />
                  <span className="hidden sm:inline">Accéder</span>
                </motion.div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* ── Tag bas de page ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-10 md:mt-16 text-center"
      >
        <span className="text-[9px] uppercase tracking-[0.3em] text-secondary/40 font-mono">
          Atelier Hamache — 2026
        </span>
      </motion.div>
    </div>
  );
}
