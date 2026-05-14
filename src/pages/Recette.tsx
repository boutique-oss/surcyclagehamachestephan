import { useEffect, useState } from 'react';
import { Save, Pencil } from 'lucide-react';
import { motion } from 'motion/react';
import { useAdmin } from '../context/AdminContext';
import { EditableText, EditableImage } from '../components/Editable';

interface MousseRecette {
  id: string;
  nom: string;
  type: string;
  image: string;
  ingredients: string;
  technique: string;
  epaisseur: string;
  densite: string;
  usage: string;
}

const defaultRecettes: MousseRecette[] = [
  {
    id: "mousse-1",
    nom: "Mousse Haute Résilience",
    type: "HR 35 kg/m³",
    image: "https://images.unsplash.com/photo-1558611997-7687bb3365ba?q=80&w=800&auto=format&fit=crop",
    ingredients: "Chutes de mousse HR 35 kg/m³, polyol recyclé, liant naturel.",
    technique: "Déchiquetage manuel des chutes, calibrage par densité. Pressage en moule avec liant, séchage à plat 24 h. Découpe à la scie à ruban selon gabarit.",
    epaisseur: "80 mm",
    densite: "35 kg/m³",
    usage: "Assise principale",
  },
  {
    id: "mousse-2",
    nom: "Mousse Recyclée Copeaux",
    type: "Copeaux HR 40 kg/m³",
    image: "https://images.unsplash.com/photo-1616464916356-3a4082e077fc?q=80&w=800&auto=format&fit=crop",
    ingredients: "Copeaux de mousse HR 40 kg/m³, toile de coton non traité, fil de surpiqûre.",
    technique: "Tri et nettoyage des copeaux. Remplissage homogène dans housse coton. Fermeture à la machine, mise en forme manuelle, contrôle densité à la pression.",
    epaisseur: "60 mm",
    densite: "40 kg/m³",
    usage: "Rembourrage dossier",
  },
  {
    id: "mousse-3",
    nom: "Mousse Mémoire de Forme",
    type: "Visco 50 kg/m³",
    image: "https://images.unsplash.com/photo-1540340061722-9293d5163008?q=80&w=800&auto=format&fit=crop",
    ingredients: "Chutes visco-élastique 50 kg/m³, colle néoprène, enveloppe coton recyclé.",
    technique: "Stratification par couches alternées visco/HR. Encollage néoprène entre couches. Couture de maintien périphérique. Finition par surpiqûre visible cognac.",
    epaisseur: "25 mm",
    densite: "50 kg/m³",
    usage: "Confort appuie-tête",
  },
];

const STORAGE_KEY = 'recettes_mousses_v2';

const VOLET_COLORS = [
  { border: 'border-l-secondary', badge: 'bg-secondary text-background', label: 'text-secondary', num: 'text-secondary' },
  { border: 'border-l-accent', badge: 'bg-accent text-background', label: 'text-accent', num: 'text-accent' },
  { border: 'border-l-primary', badge: 'bg-primary text-[#f2e9e1]', label: 'text-primary', num: 'text-primary' },
];

export function Recette() {
  const { isEditMode, toggleEditMode } = useAdmin();
  const [recettes, setRecettes] = useState<MousseRecette[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultRecettes;
    } catch {
      return defaultRecettes;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recettes));
  }, [recettes]);

  // Sync changes across tabs/windows with improved reliability
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const newVal = JSON.parse(e.newValue);
          setRecettes(newVal);
        } catch (error) {
          console.warn(`Failed to sync recipes:`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateRecette = (id: string, field: keyof MousseRecette, value: string) => {
    setRecettes(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recettes));
    toggleEditMode();
  };

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col gap-4 md:gap-8 pb-4 md:pb-12 pt-2 md:pt-4">
      {/* En-tête */}
      <div className="flex flex-row items-center justify-between gap-4 border-b border-primary pb-4 md:pb-6">
        <div>
          <h1 className="text-xs md:text-sm uppercase tracking-[0.2em] font-bold text-secondary mb-0.5 md:mb-1">
            Recettes de Mousses
          </h1>
          <p className="text-[10px] uppercase tracking-widest opacity-70 hidden sm:block">3 volets — Rembourrage recyclé</p>
        </div>
        {isEditMode && (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-secondary text-background text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-colors flex-shrink-0"
          >
            <Save className="w-3 h-3" />
            Enregistrer
          </button>
        )}
      </div>

      {/* 3 volets — toujours en ligne (image gauche + contenu droit) */}
      <div className="flex flex-col gap-3 md:gap-6">
        {recettes.map((recette, idx) => {
          const color = VOLET_COLORS[idx % VOLET_COLORS.length];
          return (
            <motion.div
              key={recette.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`glass-panel rounded-lg border-l-4 ${color.border} overflow-hidden`}
            >
              {/* Toujours flex-row : image à gauche, contenu à droite */}
              <div className="flex flex-row">
                {/* Image — largeur fixe selon écran */}
                <div className="w-24 sm:w-36 md:w-2/5 flex-shrink-0 relative self-stretch min-h-[130px] sm:min-h-[180px] md:min-h-[220px] bg-[#121a0d]">
                  {isEditMode ? (
                    <div className="absolute inset-0">
                      <EditableImage
                        src={recette.image}
                        alt={recette.nom}
                        onChange={(val) => updateRecette(recette.id, 'image', val)}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <img
                      src={recette.image}
                      alt={recette.nom}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  {/* Numéro */}
                  <div className={`absolute top-2 left-2 text-2xl md:text-4xl font-bold opacity-70 ${color.num} select-none drop-shadow-lg`}>
                    0{idx + 1}
                  </div>
                  {/* Badge type */}
                  <div className={`absolute bottom-2 left-2 right-2 ${color.badge} text-[8px] md:text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 truncate`}>
                    {isEditMode ? (
                      <EditableText
                        value={recette.type}
                        onChange={(val) => updateRecette(recette.id, 'type', val)}
                        className="bg-transparent border-none text-inherit p-0 text-[8px]"
                      />
                    ) : recette.type}
                  </div>
                </div>

                {/* Contenu */}
                <div className="flex-1 p-3 sm:p-4 md:p-6 flex flex-col gap-2 md:gap-4 min-w-0">
                  {/* Titre */}
                  <div className="flex items-center gap-1.5">
                    {isEditMode && <Pencil className="w-3 h-3 text-secondary flex-shrink-0" />}
                    <h2 className={`text-xs sm:text-sm md:text-base font-bold uppercase tracking-wide ${color.label} truncate`}>
                      <EditableText
                        value={recette.nom}
                        onChange={(val) => updateRecette(recette.id, 'nom', val)}
                      />
                    </h2>
                  </div>

                  {/* Specs en ligne */}
                  <div className="grid grid-cols-3 gap-1.5 md:gap-3">
                    {[
                      { label: 'Ép.', labelFull: 'Épaisseur', field: 'epaisseur' as const },
                      { label: 'Dens.', labelFull: 'Densité', field: 'densite' as const },
                      { label: 'Usage', labelFull: 'Usage', field: 'usage' as const },
                    ].map(({ label, labelFull, field }) => (
                      <div key={field} className="bg-[#121a0d]/60 border border-primary/50 rounded p-1.5 md:p-2">
                        <div className={`text-[8px] md:text-[9px] uppercase tracking-widest mb-0.5 md:mb-1 ${color.label}`}>
                          <span className="md:hidden">{label}</span>
                          <span className="hidden md:inline">{labelFull}</span>
                        </div>
                        <div className="text-[9px] md:text-xs text-[#f2e9e1] font-mono leading-tight">
                          <EditableText
                            value={recette[field]}
                            onChange={(val) => updateRecette(recette.id, field, val)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Composants */}
                  <div>
                    <div className={`text-[9px] md:text-[10px] uppercase tracking-widest border-l-2 ${color.border} pl-1.5 md:pl-2 mb-0.5 md:mb-1 ${color.label}`}>
                      Composants
                    </div>
                    <div className="text-[10px] md:text-[11px] text-[#f2e9e1]/80 font-serif ml-2 leading-snug">
                      <EditableText
                        value={recette.ingredients}
                        onChange={(val) => updateRecette(recette.id, 'ingredients', val)}
                        multiline
                      />
                    </div>
                  </div>

                  {/* Technique — cachée sur très petit mobile pour éviter l'écrasement */}
                  <div className="hidden sm:block">
                    <div className={`text-[9px] md:text-[10px] uppercase tracking-widest border-l-2 ${color.border} pl-1.5 md:pl-2 mb-0.5 md:mb-1 ${color.label}`}>
                      Technique
                    </div>
                    <div className="text-[10px] md:text-[11px] text-[#f2e9e1]/80 font-serif ml-2 leading-relaxed">
                      <EditableText
                        value={recette.technique}
                        onChange={(val) => updateRecette(recette.id, 'technique', val)}
                        multiline
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
