import { Link } from 'react-router-dom';
import { LayoutTemplate, FileText, Map, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useContent } from '../lib/useContent';
import { EditableText } from '../components/Editable';

export function Home() {
  const [content, setContent] = useContent('page_home', {
    title1: 'Fauteuil',
    title2: 'Réception',
    description: 'Documentation pédagogique pour jury. Une création unique : structure en bois brut, rembourrage en copeaux de mousse recyclée.',
  });

  return (
    <div className="flex-1 flex flex-col justify-center max-w-5xl mx-auto w-full py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-widest uppercase mb-6 flex flex-wrap justify-center gap-4">
          <EditableText value={content.title1} onChange={(val) => setContent({...content, title1: val})} /> 
          <EditableText value={content.title2} onChange={(val) => setContent({...content, title2: val})} className="text-secondary font-normal" />
        </h1>
        <div className="text-xl text-[#f2e9e1] opacity-70 max-w-2xl mx-auto font-serif">
          <EditableText value={content.description} onChange={(val) => setContent({...content, description: val})} multiline />
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            title: "01. Gabarit",
            desc: "Structure modulaire pour la pièce. Inclut les spécifications et dimensions clés.",
            icon: LayoutTemplate,
            to: "/gabarit",
            color: "primary"
          },
          {
            title: "02. Recette",
            desc: "Étapes de fabrication détaillées, interactives et éditables avec totaux.",
            icon: FileText,
            to: "/recette",
            color: "secondary"
          },
          {
            title: "03. Plan A3",
            desc: "Image technique haute-résolution du schéma avec annotations interactives.",
            icon: Map,
            to: "/plan",
            color: "accent"
          }
        ].map((card, idx) => (
          <motion.div
            key={card.to}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 + 0.2 }}
            className="flex"
          >
            <Link 
              to={card.to}
              className={`block w-full h-full glass-card group border-l-4 ${
                card.color === 'primary' ? 'border-l-primary hover:shadow-glow-primary' : 
                card.color === 'secondary' ? 'border-l-secondary hover:shadow-glow-secondary' : 
                'border-l-accent hover:shadow-glow'
              }`}
            >
              <card.icon className={`w-8 h-8 mb-6 ${
                card.color === 'primary' ? 'text-primary' : 
                card.color === 'secondary' ? 'text-secondary' : 'text-accent'
              }`} />
              <h2 className="text-sm uppercase tracking-[0.2em] font-bold mb-3">{card.title}</h2>
              <p className="text-[11px] text-[#f2e9e1] leading-relaxed opacity-70 font-serif mb-8">{card.desc}</p>
              <div className="flex items-center text-[10px] font-bold text-secondary tracking-widest uppercase transition-colors mt-auto">
                Accéder <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
