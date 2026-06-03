import { Save } from 'lucide-react';
import { motion } from 'motion/react';
import { useAdmin } from '../context/AdminContext';
import { EditableText } from '../components/Editable';
import { useContent } from '../lib/useContent';

interface Ingredient {
  id: string;
  nom: string;
  detail: string;
}

interface Etape {
  id: string;
  action: string;
}

interface RecetteContent {
  titre: string;
  sousTitre: string;
  ingredients: Ingredient[];
  etapes: Etape[];
  noteFinale: string;
}

const defaultContent: RecetteContent = {
  titre: 'Recette de rembourrage recyclé',
  sousTitre: 'Fauteuil Réception — Atelier Hamache',
  ingredients: [
    { id: 'ing-1', nom: 'Néoprène', detail: 'À compléter : épaisseur et grammage' },
    { id: 'ing-2', nom: 'Liant Stockmeier', detail: 'À compléter : dosage en g/m²' },
    { id: 'ing-3', nom: 'Colle D4', detail: 'À compléter : temps de contact et température' },
    { id: 'ing-4', nom: 'Chutes de mousse HR', detail: 'À compléter : densité et granulométrie cible' },
  ],
  etapes: [
    { id: 'et-1', action: 'Trier et peser les chutes de mousse par densité.' },
    { id: 'et-2', action: 'Déchiqueter les chutes manuellement aux dimensions prescrites. À compléter : dimensions cibles en mm.' },
    { id: 'et-3', action: 'Mélanger avec le liant Stockmeier. À compléter : proportion liant / mousse et durée de malaxage.' },
    { id: 'et-4', action: 'Encoller les faces de contact au néoprène. À compléter : temps de séchage avant assemblage.' },
    { id: 'et-5', action: 'Presser en moule selon le gabarit. À compléter : pression et durée de pressage.' },
    { id: 'et-6', action: 'Laisser sécher à plat. À compléter : durée de séchage et conditions (température, ventilation).' },
    { id: 'et-7', action: 'Coller à la D4 sur la structure bois. À compléter : délai avant utilisation.' },
    { id: 'et-8', action: 'Contrôler la tenue et la forme finale avant la pose du tissu.' },
  ],
  noteFinale: 'À compléter : conseils de stockage, références fournisseurs, indications de sécurité (ventilation, EPI).',
};

export function Recette() {
  const { isEditMode, toggleEditMode } = useAdmin();
  const [content, setContent] = useContent<RecetteContent>('page_recette_v2', defaultContent);

  const updateIngredient = (id: string, field: keyof Ingredient, value: string) => {
    setContent({
      ...content,
      ingredients: content.ingredients.map(i => i.id === id ? { ...i, [field]: value } : i),
    });
  };

  const updateEtape = (id: string, value: string) => {
    setContent({
      ...content,
      etapes: content.etapes.map(e => e.id === id ? { ...e, action: value } : e),
    });
  };

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto flex flex-col gap-6 md:gap-10 pb-6 md:pb-16 pt-2 md:pt-4">

      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-row items-start justify-between gap-4 border-b border-primary pb-5 md:pb-7"
      >
        <div className="flex flex-col gap-1">
          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-secondary/70 font-mono">
            02. Recette
          </p>
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold tracking-wide text-[#f0e6d3] leading-tight">
            <EditableText
              value={content.titre}
              onChange={(val) => setContent({ ...content, titre: val })}
            />
          </h1>
          <p className="text-[11px] md:text-sm text-[#f0e6d3]/50 font-serif mt-1">
            <EditableText
              value={content.sousTitre}
              onChange={(val) => setContent({ ...content, sousTitre: val })}
            />
          </p>
        </div>

        {isEditMode && (
          <button
            onClick={toggleEditMode}
            className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-secondary text-background text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-colors flex-shrink-0 mt-1"
          >
            <Save className="w-3 h-3" />
            Enregistrer
          </button>
        )}
      </motion.div>

      {/* Section Ingrédients / Matériaux */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="flex flex-col gap-4"
      >
        <h2 className="text-[10px] md:text-xs uppercase tracking-[0.25em] font-bold text-secondary border-l-4 border-l-secondary pl-3">
          Ingrédients / Matériaux
        </h2>

        <ul className="flex flex-col gap-2 md:gap-3">
          {content.ingredients.map((ing) => (
            <li
              key={ing.id}
              className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3 glass-panel rounded-lg px-4 py-3"
            >
              <span className="text-[11px] md:text-sm font-bold text-secondary flex-shrink-0 uppercase tracking-wide">
                <EditableText
                  value={ing.nom}
                  onChange={(val) => updateIngredient(ing.id, 'nom', val)}
                />
              </span>
              <span className="text-[10px] md:text-[11px] text-[#f0e6d3]/55 font-serif italic leading-snug">
                <EditableText
                  value={ing.detail}
                  onChange={(val) => updateIngredient(ing.id, 'detail', val)}
                />
              </span>
            </li>
          ))}
        </ul>
      </motion.section>

      {/* Séparateur */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-primary/50" />
        <span className="text-[9px] uppercase tracking-[0.3em] text-[#f0e6d3]/20 font-mono">préparation</span>
        <div className="flex-1 h-px bg-primary/50" />
      </div>

      {/* Section Étapes */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="flex flex-col gap-4"
      >
        <h2 className="text-[10px] md:text-xs uppercase tracking-[0.25em] font-bold text-secondary border-l-4 border-l-accent pl-3">
          Étapes
        </h2>

        <ol className="flex flex-col gap-3 md:gap-4">
          {content.etapes.map((etape, idx) => (
            <li key={etape.id} className="flex gap-4 items-start">
              {/* Numéro */}
              <span
                className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full border border-secondary/40 flex items-center justify-center text-[10px] md:text-xs font-bold text-secondary font-mono mt-0.5"
                style={{ background: 'rgba(212,165,116,0.07)' }}
              >
                {idx + 1}
              </span>
              {/* Texte */}
              <div className="flex-1 text-[11px] md:text-sm text-[#f0e6d3]/80 font-serif leading-relaxed pt-1">
                <EditableText
                  value={etape.action}
                  onChange={(val) => updateEtape(etape.id, val)}
                  multiline
                />
              </div>
            </li>
          ))}
        </ol>
      </motion.section>

      {/* Note finale */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24 }}
        className="glass-panel rounded-lg border-l-4 border-l-primary px-4 py-4 flex flex-col gap-1.5"
      >
        <h3 className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] font-bold text-primary/80">
          Notes &amp; sécurité
        </h3>
        <div className="text-[10px] md:text-[11px] text-[#f0e6d3]/55 font-serif italic leading-relaxed">
          <EditableText
            value={content.noteFinale}
            onChange={(val) => setContent({ ...content, noteFinale: val })}
            multiline
          />
        </div>
      </motion.section>

    </div>
  );
}
