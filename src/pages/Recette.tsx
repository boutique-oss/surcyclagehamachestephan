import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Edit3, Save, Download, Clock, DollarSign, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useAdmin } from '../context/AdminContext';

interface Step {
  id: string;
  title: string;
  duration: number; // in minutes
  cost: number; // in euros
  weight: number; // in grams
  materials: string;
  description: string;
  image: string;
}

const defaultSteps: Step[] = [
  {
    id: "step-1",
    title: "Débit et corroyage du bois brut",
    duration: 180,
    cost: 45,
    weight: 12000,
    materials: "Plateaux chêne ép. 54mm",
    description: "Sélection des pièces sans défaut. Débit à la scie à format, dégauchissage et rabotage à 45mm fini pour la structure principale.",
    image: "https://images.unsplash.com/photo-1540340061722-9293d5163008?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "step-2",
    title: "Usinage et assemblage structure",
    duration: 300,
    cost: 15,
    weight: 0, // already counted
    materials: "Tourillons hêtre 10mm, Colle PU",
    description: "Usinage des tenons courts et mortaises. Percement pour tourillons. Encollage et mise sous presse. Équerrage strict à 90°.",
    image: "https://images.unsplash.com/photo-1505069411475-7164b15dedea?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "step-3",
    title: "Préparation des copeaux de mousse",
    duration: 120,
    cost: 5,
    weight: 4500,
    materials: "Chutes de mousse HR 40kg/m3",
    description: "Déchiquetage manuel et calibrage des chutes de mousse issues de la production précédente. Nettoyage et tri par densité.",
    image: "https://images.unsplash.com/photo-1558611997-7687bb3365ba?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "step-4",
    title: "Garnissage et capitonnage",
    duration: 240,
    cost: 85,
    weight: 2000,
    materials: "Tissu laine bouillie, Fil cognac, Toile blanche",
    description: "Création de la housse interne en toile blanche. Remplissage homogène avec les copeaux. Fermeture et mise en place du tissu final avec surpiqûres cognac.",
    image: "https://images.unsplash.com/photo-1616464916356-3a4082e077fc?q=80&w=800&auto=format&fit=crop"
  }
];

export function Recette() {
  const { isEditMode, toggleEditMode } = useAdmin();
  const [steps, setSteps] = useState<Step[]>(defaultSteps);
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({ "step-1": true });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('fauteuil_recette_steps');
    if (saved) {
      try {
        setSteps(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved steps", e);
      }
    }
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedSteps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleUpdateStep = (id: string, field: keyof Step, value: any) => {
    setSteps(prev => prev.map(step => {
      if (step.id === id) {
        return { ...step, [field]: value };
      }
      return step;
    }));
  };

  const handleSave = () => {
    localStorage.setItem('fauteuil_recette_steps', JSON.stringify(steps));
    toggleEditMode(); // Automatically exit edit mode on save
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(steps, null, 2));
    const dt = document.createElement('a');
    dt.setAttribute("href", dataStr);
    dt.setAttribute("download", "recette_fauteuil.json");
    dt.click();
  };

  // Calculate totals
  const totalDurationMin = steps.reduce((acc, step) => acc + Number(step.duration), 0);
  const hours = Math.floor(totalDurationMin / 60);
  const minutes = totalDurationMin % 60;
  
  const totalCost = steps.reduce((acc, step) => acc + Number(step.cost), 0);
  const totalWeightKg = steps.reduce((acc, step) => acc + Number(step.weight), 0) / 1000;

  // React to changes in the data if the user wants to save outside of the explicit save button
  // the global edit mode toggles via the admin button so we auto save effectively.
  useEffect(() => {
    if (!isEditMode && steps !== defaultSteps) {
      localStorage.setItem('fauteuil_recette_steps', JSON.stringify(steps));
    }
  }, [isEditMode, steps]);

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col gap-8 pb-12 bg-[#162111] p-6 md:p-10 border-x border-primary shadow-glow-primary">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-primary pb-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-sm uppercase tracking-[0.2em] font-bold text-secondary">Recette de Fabrication</h1>
            <span className="text-[10px] text-[#f2e9e1] opacity-50">ID: FT-012</span>
          </div>
          <p className="text-[11px] uppercase tracking-widest opacity-70">Documentation séquentielle des étapes</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleExportJSON}
            className="px-4 py-1.5 text-[10px] border border-secondary text-secondary font-bold uppercase tracking-widest hover:bg-secondary hover:text-background transition-all"
          >
             Export JSON
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="glass p-4 rounded-lg flex flex-col items-center justify-center gap-1 border-t-2 border-t-secondary/50">
          <Clock className="text-secondary w-4 h-4 mb-1" />
          <div className="text-[10px] uppercase tracking-widest text-[#f2e9e1] opacity-70">Temps Total</div>
          <div className="font-light text-xl text-secondary">{hours}h {minutes}m</div>
        </div>
        <div className="glass p-4 rounded-lg flex flex-col items-center justify-center gap-1 border-t-2 border-t-accent/50">
          <DollarSign className="text-accent w-4 h-4 mb-1" />
          <div className="text-[10px] uppercase tracking-widest text-[#f2e9e1] opacity-70">Coût Matériaux</div>
          <div className="font-light text-xl text-accent">{totalCost.toFixed(2)} €</div>
        </div>
        <div className="glass p-4 rounded-lg flex flex-col items-center justify-center gap-1 border-t-2 border-t-[#f2e9e1]/20">
          <Scale className="text-[#f2e9e1]/50 w-4 h-4 mb-1" />
          <div className="text-[10px] uppercase tracking-widest text-[#f2e9e1] opacity-70">Poids Total</div>
          <div className="font-light text-xl text-[#f2e9e1]/80">{totalWeightKg.toFixed(1)} kg</div>
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const isExpanded = expandedSteps[step.id];

          return (
            <div key={step.id} className={`glass-panel p-4 rounded-lg transition-all ${isExpanded ? 'border-l-4 border-l-secondary' : 'border-l-4 border-transparent opacity-70 hover:opacity-100'}`}>
              {/* Header (always visible) */}
              <button 
                onClick={() => !isEditMode && toggleExpand(step.id)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-4">
                  {isEditMode ? (
                    <input 
                      type="text" 
                      value={step.title}
                      onChange={(e) => handleUpdateStep(step.id, 'title', e.target.value)}
                      className="bg-[#121a0d] border border-primary rounded px-3 py-1 text-[#f2e9e1] text-xs font-bold uppercase tracking-wide w-full max-w-md focus:outline-none focus:border-secondary"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <h3 className="text-xs font-bold uppercase tracking-wide">Étape 0{index + 1} : {step.title}</h3>
                  )}
                </div>
                {!isEditMode && (
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] text-secondary bg-primary px-2 py-0.5">
                      {Math.floor(step.duration / 60)}h {step.duration % 60}m
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-secondary" /> : <ChevronDown className="w-4 h-4 text-[#f2e9e1]/50" />}
                  </div>
                )}
              </button>

              {/* Content (expandable) */}
              <AnimatePresence>
                {(isExpanded || isEditMode) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-4 pt-4 border-t border-primary border-dashed"
                  >
                    <div className="grid md:grid-cols-5 gap-8">
                      <div className="md:col-span-2 relative aspect-[4/3] rounded overflow-hidden shadow-glow-primary border border-secondary/20">
                         {isEditMode ? (
                           <div className="absolute inset-0 p-2 flex flex-col gap-2 z-10 bg-[#121a0d]/80 backdrop-blur-sm">
                              <label className="text-[10px] uppercase tracking-widest text-secondary">URL Image</label>
                              <input 
                                value={step.image} 
                                onChange={(e) => handleUpdateStep(step.id, 'image', e.target.value)}
                                className="bg-[#162111] border border-primary text-xs text-[#f2e9e1] p-2 rounded"
                              />
                           </div>
                         ) : null}
                         <img src={step.image} alt={step.title} className="w-full h-full object-cover mix-blend-screen opacity-80" />
                      </div>
                      
                      <div className="md:col-span-3 flex flex-col gap-4">
                        {isEditMode && (
                           <div className="grid grid-cols-3 gap-2">
                             <div className="bg-[#121a0d] p-2 rounded border border-primary">
                               <div className="text-[9px] uppercase tracking-widest text-[#f2e9e1]/50 mb-1">Durée (min)</div>
                               <input 
                                 type="number" 
                                 value={step.duration}
                                 onChange={(e) => handleUpdateStep(step.id, 'duration', e.target.value)}
                                 className="w-full bg-transparent text-secondary border-none outline-none text-sm"
                               />
                             </div>
                             <div className="bg-[#121a0d] p-2 rounded border border-primary">
                               <div className="text-[9px] uppercase tracking-widest text-[#f2e9e1]/50 mb-1">Coût (€)</div>
                               <input 
                                 type="number" 
                                 value={step.cost}
                                 onChange={(e) => handleUpdateStep(step.id, 'cost', e.target.value)}
                                 className="w-full bg-transparent text-secondary border-none outline-none text-sm"
                               />
                             </div>
                             <div className="bg-[#121a0d] p-2 rounded border border-primary">
                               <div className="text-[9px] uppercase tracking-widest text-[#f2e9e1]/50 mb-1">Poids (g)</div>
                               <input 
                                 type="number" 
                                 value={step.weight}
                                 onChange={(e) => handleUpdateStep(step.id, 'weight', e.target.value)}
                                 className="w-full bg-transparent text-secondary border-none outline-none text-sm"
                               />
                             </div>
                           </div>
                        )}

                        <div>
                          <div className="text-[10px] uppercase tracking-widest text-secondary mb-1 border-l-2 border-secondary pl-2">Matériaux utilisés</div>
                          {isEditMode ? (
                            <input 
                              type="text" 
                              value={step.materials}
                              onChange={(e) => handleUpdateStep(step.id, 'materials', e.target.value)}
                              className="w-full bg-[#121a0d] border border-primary rounded p-2 text-sm text-[#f2e9e1]"
                            />
                          ) : (
                            <div className="text-xs uppercase tracking-wider text-[#f2e9e1]/80 ml-2">{step.materials}</div>
                          )}
                        </div>

                        <div className="flex-1 mt-2">
                          <div className="text-[10px] uppercase tracking-widest text-secondary mb-1 border-l-2 border-secondary pl-2">Description technique</div>
                          {isEditMode ? (
                            <textarea 
                              value={step.description}
                              onChange={(e) => handleUpdateStep(step.id, 'description', e.target.value)}
                              className="w-full h-24 bg-[#121a0d] border border-primary rounded p-2 text-sm text-[#f2e9e1] font-serif resize-none"
                            />
                          ) : (
                            <p className="text-[11px] text-[#f2e9e1] leading-relaxed font-serif ml-2 bg-[#121a0d]/30 p-3 rounded">{step.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
