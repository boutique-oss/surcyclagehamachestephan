import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Ruler, Weight, Camera } from 'lucide-react';
import { motion } from 'motion/react';
import { useContent } from '../lib/useContent';
import { EditableText, EditableImage } from '../components/Editable';
import { useAdmin } from '../context/AdminContext';

interface GalleryPhoto {
  id: string;
  image: string;
  caption: string;
}

const DEFAULT_GALLERY: GalleryPhoto[] = [
  {
    id: 'g1',
    image: 'https://images.unsplash.com/photo-1540340061722-9293d5163008?q=80&w=800&auto=format&fit=crop',
    caption: 'Structure bois brut — chêne massif avant corroyage.',
  },
  {
    id: 'g2',
    image: 'https://images.unsplash.com/photo-1505069411475-7164b15dedea?q=80&w=800&auto=format&fit=crop',
    caption: 'Usinage des tenons et mortaises à la défonceuse.',
  },
  {
    id: 'g3',
    image: 'https://images.unsplash.com/photo-1558611997-7687bb3365ba?q=80&w=800&auto=format&fit=crop',
    caption: 'Copeaux de mousse HR 40 kg/m³ calibrés et triés.',
  },
  {
    id: 'g4',
    image: 'https://images.unsplash.com/photo-1616464916356-3a4082e077fc?q=80&w=800&auto=format&fit=crop',
    caption: 'Capitonnage final — surpiqûres cognac apparentes.',
  },
];

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
    gallery: DEFAULT_GALLERY,
  });

  const updatePhoto = (id: string, field: keyof GalleryPhoto, value: string) => {
    setContent({
      ...content,
      gallery: content.gallery.map((p: GalleryPhoto) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    });
  };

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col gap-5 md:gap-10 pb-6 md:pb-12 pt-3 md:pt-6">
      {/* Hero Section */}
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
            <EditableText value={content.title1} onChange={(val) => setContent({...content, title1: val})} />
            <EditableText value={content.title2} onChange={(val) => setContent({...content, title2: val})} className="text-secondary font-normal" />
          </h1>
          <div className="text-xs md:text-base text-[#f2e9e1] opacity-80 max-w-2xl font-serif hidden sm:block">
            <EditableText value={content.description} onChange={(val) => setContent({...content, description: val})} multiline />
          </div>
        </div>
      </motion.div>

      {/* Specs + CTAs */}
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
                <EditableText value={content.specsMaterials} onChange={(val) => setContent({...content, specsMaterials: val})} multiline />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[9px] md:text-[10px] text-secondary uppercase tracking-widest flex items-center gap-1.5"><Ruler className="w-3 h-3" /> Dimensions</span>
              <div className="text-2xl md:text-3xl font-light mt-1 flex items-baseline gap-1.5 md:gap-2">
                <EditableText value={content.specsDimWidth} onChange={(val) => setContent({...content, specsDimWidth: val})} />
                <span className="text-xs text-secondary">x</span>
                <EditableText value={content.specsDimDepth} onChange={(val) => setContent({...content, specsDimDepth: val})} />
                <span className="text-xs text-secondary">cm</span>
              </div>
              <div className="text-[9px] md:text-[10px] text-[#f2e9e1] opacity-50 uppercase tracking-wide mt-1">
                <EditableText value={content.specsDimDesc} onChange={(val) => setContent({...content, specsDimDesc: val})} />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[9px] md:text-[10px] text-secondary uppercase tracking-widest flex items-center gap-1.5"><Weight className="w-3 h-3" /> Poids</span>
              <div className="text-2xl md:text-3xl font-light mt-1 flex items-baseline gap-1.5 md:gap-2">
                <EditableText value={content.specsWeight} onChange={(val) => setContent({...content, specsWeight: val})} />
                <span className="text-xs text-secondary">kg</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[9px] md:text-[10px] text-secondary uppercase tracking-widest">Finitions</span>
              <div className="text-[10px] md:text-[11px] text-[#f2e9e1] leading-relaxed opacity-70 font-serif mt-1">
                <EditableText value={content.specsFinishes} onChange={(val) => setContent({...content, specsFinishes: val})} multiline />
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTAs en ligne sur mobile */}
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

      {/* ── Galerie photos + légendes ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col gap-3 md:gap-5"
      >
        {/* En-tête galerie */}
        <div className="flex items-center gap-3 border-b border-primary pb-3">
          <Camera className="w-4 h-4 text-secondary flex-shrink-0" />
          <h2 className="text-xs md:text-sm uppercase tracking-[0.2em] font-bold text-secondary">Galerie</h2>
          <span className="text-[10px] text-[#f2e9e1] opacity-40 uppercase tracking-widest">Documentation photographique</span>
        </div>

        {/* 2 colonnes mobile → 4 colonnes desktop, tout en ligne */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4">
          {(content.gallery as GalleryPhoto[]).map((photo, idx) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + idx * 0.07 }}
              className="flex flex-col gap-0 group/photo"
            >
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-t border border-secondary/20 border-b-0 bg-[#121a0d]">
                {isEditMode ? (
                  <EditableImage
                    src={photo.image}
                    alt={photo.caption}
                    onChange={(val) => updatePhoto(photo.id, 'image', val)}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={photo.image}
                    alt={photo.caption}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/photo:scale-105"
                  />
                )}
                {/* Numéro */}
                <div className="absolute top-2 left-2 bg-background/70 backdrop-blur-sm text-secondary text-[9px] font-bold px-1.5 py-0.5 rounded-sm font-mono">
                  {String(idx + 1).padStart(2, '0')}
                </div>
              </div>

              {/* Légende */}
              <div className="bg-[#121a0d]/80 border border-secondary/20 border-t border-t-secondary/40 rounded-b px-2 py-2 md:px-3 md:py-2.5">
                <div className="text-[9px] md:text-[10px] text-[#f2e9e1]/80 font-serif leading-snug">
                  {isEditMode ? (
                    <EditableText
                      value={photo.caption}
                      onChange={(val) => updatePhoto(photo.id, 'caption', val)}
                      multiline
                    />
                  ) : (
                    photo.caption
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <footer className="mt-auto text-center border-t border-primary pt-4 md:pt-6 flex justify-between text-[9px] uppercase tracking-widest text-secondary">
        <span>&copy; 2026 Atelier Réception</span>
        <span>Modèle Gabarit</span>
      </footer>
    </div>
  );
}
