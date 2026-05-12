import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Ruler, Weight } from 'lucide-react';
import { motion } from 'motion/react';
import { useContent } from '../lib/useContent';
import { EditableText, EditableImage } from '../components/Editable';

export function Gabarit() {
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
  });

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col gap-10 pb-12 pt-6">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full h-[45vh] min-h-[350px] rounded-2xl overflow-hidden shadow-glow-primary border border-primary/20"
      >
        <EditableImage 
          src={content.heroImage} 
          onChange={(val) => setContent({ ...content, heroImage: val })}
          className="absolute inset-0 w-full h-full object-cover mix-blend-normal" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-transparent pointer-events-none" />
        
        <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full">
          <div className="text-[10px] uppercase text-secondary tracking-widest mb-3">Preview : Vue d'ensemble</div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-widest uppercase mb-4 text-[#f2e9e1] flex gap-3">
            <EditableText value={content.title1} onChange={(val) => setContent({...content, title1: val})} />
            <EditableText value={content.title2} onChange={(val) => setContent({...content, title2: val})} className="text-secondary font-normal" />
          </h1>
          <div className="text-base text-[#f2e9e1] opacity-80 max-w-2xl font-serif">
            <EditableText value={content.description} onChange={(val) => setContent({...content, description: val})} multiline />
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Specs Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2 glass-card border-l-4 border-l-secondary flex flex-col justify-center bg-[#162111]/80 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-secondary">Spécifications Techniques</h2>
             <span className="text-[10px] text-[#f2e9e1] opacity-50">ID: FR-01</span>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-secondary uppercase tracking-widest flex items-center gap-2"><Leaf className="w-3 h-3" /> Matériaux</span>
              <div className="text-[11px] text-[#f2e9e1] leading-relaxed opacity-70 font-serif mt-1">
                <EditableText value={content.specsMaterials} onChange={(val) => setContent({...content, specsMaterials: val})} multiline />
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
               <span className="text-[10px] text-secondary uppercase tracking-widest flex items-center gap-2"><Ruler className="w-3 h-3" /> Dimensions</span>
               <div className="text-3xl font-light mt-1 flex items-baseline gap-2">
                 <EditableText value={content.specsDimWidth} onChange={(val) => setContent({...content, specsDimWidth: val})} />
                 <span className="text-xs text-secondary">x</span> 
                 <EditableText value={content.specsDimDepth} onChange={(val) => setContent({...content, specsDimDepth: val})} />
                 <span className="text-xs text-secondary">cm</span>
               </div>
               <div className="text-[10px] text-[#f2e9e1] opacity-50 uppercase tracking-wide mt-1">
                 <EditableText value={content.specsDimDesc} onChange={(val) => setContent({...content, specsDimDesc: val})} />
               </div>
            </div>

            <div className="flex flex-col gap-1">
               <span className="text-[10px] text-secondary uppercase tracking-widest flex items-center gap-2"><Weight className="w-3 h-3" /> Poids</span>
               <div className="text-3xl font-light mt-1 flex items-baseline gap-2">
                 <EditableText value={content.specsWeight} onChange={(val) => setContent({...content, specsWeight: val})} />
                 <span className="text-xs text-secondary">kg</span>
               </div>
            </div>
            
             <div className="flex flex-col gap-1">
                <span className="text-[10px] text-secondary uppercase tracking-widest">Finitions</span>
                <div className="text-[11px] text-[#f2e9e1] leading-relaxed opacity-70 font-serif mt-1">
                  <EditableText value={content.specsFinishes} onChange={(val) => setContent({...content, specsFinishes: val})} multiline />
                </div>
            </div>
          </div>
        </motion.div>

        {/* CTAs Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-4"
        >
          <Link to="/recette" className="group glass-card flex-1 flex flex-col justify-center items-center text-center hover:bg-secondary hover:text-background transition-colors border border-secondary shadow-glow-secondary">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-2 transition-colors">02. Recette</h3>
            <p className="text-[10px] opacity-70 tracking-widest uppercase mb-4 group-hover:opacity-100">Étapes &amp; coûts</p>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-all" />
          </Link>
          
          <Link to="/plan" className="group glass-card flex-1 flex flex-col justify-center items-center text-center hover:bg-accent hover:text-[#f2e9e1] transition-colors border border-accent shadow-glow">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-2 transition-colors">03. Plan A3</h3>
            <p className="text-[10px] opacity-70 tracking-widest uppercase mb-4 group-hover:opacity-100">Schéma interactif</p>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-all" />
          </Link>
        </motion.div>
      </div>

      <footer className="mt-auto text-center border-t border-primary pt-6 flex justify-between text-[9px] uppercase tracking-widest text-secondary">
        <span>&copy; 2026 Atelier Réception — Design Durable</span>
        <span>Modèle Gabarit</span>
      </footer>
    </div>
  );
}
