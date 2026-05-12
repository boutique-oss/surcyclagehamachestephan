import { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize, Download, Info } from 'lucide-react';
import { motion, useAnimationControls } from 'motion/react';
import { cn } from '../lib/utils';
import { useContent } from '../lib/useContent';
import { EditableText, EditableImage } from '../components/Editable';
import { useAdmin } from '../context/AdminContext';

const DEFAULT_ANNOTATIONS = [
  { id: 1, x: 25, y: 35, title: "Structure Bois", desc: "Chêne massif, épaisseur 30mm." },
  { id: 2, x: 50, y: 65, title: "Rembourrage", desc: "Zone de compression max. Copeaux densité 40kg/m3." },
  { id: 3, x: 75, y: 45, title: "Assemblage", desc: "Vis M8 apparentes avec inserts métalliques." },
  { id: 4, x: 40, y: 85, title: "Coutures", desc: "Surpiqûre double, fil synthétique ultra-résistant." }
];

export function Plan() {
  const { isEditMode } = useAdmin();
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeAnnotation, setActiveAnnotation] = useState<number | null>(null);
  
  const [content, setContent] = useContent('page_plan', {
    planImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2400&auto=format&fit=crop',
    annotations: DEFAULT_ANNOTATIONS
  });

  const updateAnnotation = (id: number, field: string, value: string) => {
    setContent({
      ...content,
      annotations: content.annotations.map(a => a.id === id ? { ...a, [field]: value } : a)
    });
  };

  
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();

  const handleZoomIn = () => setScale(s => Math.min(s + 0.25, 3));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.25, 0.5));
  const handleReset = () => {
    setScale(1);
    controls.start({ x: 0, y: 0 });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleDownload = () => {
    // Basic image download mapping to "PDF download" intent for now
    const link = document.createElement('a');
    link.href = 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2400&auto=format&fit=crop';
    link.download = 'Plan_Fauteuil_Reception.jpg';
    link.click();
  };

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col gap-6 pb-12 h-[calc(100vh-80px)]">
      <div className="flex items-center justify-between glass-panel p-4 rounded-lg border-l-4 border-l-secondary">
        <div>
          <h1 className="text-sm font-bold uppercase tracking-[0.2em] text-secondary">03. Plan Technique A3</h1>
          <p className="text-[10px] text-[#f2e9e1] opacity-70 tracking-widest mt-1">Glissez pour déplacer • Utilisez les boutons pour zoomer</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-[#121a0d] border border-primary rounded overflow-hidden">
            <button onClick={handleZoomOut} className="px-3 py-2 hover:bg-primary/50 text-secondary transition-colors"><ZoomOut className="w-4 h-4" /></button>
            <div className="px-3 py-2 text-[10px] uppercase tracking-widest border-x border-primary w-16 text-center text-secondary font-bold flex items-center justify-center">
              {Math.round(scale * 100)}%
            </div>
            <button onClick={handleZoomIn} className="px-3 py-2 hover:bg-primary/50 text-secondary transition-colors"><ZoomIn className="w-4 h-4" /></button>
          </div>
          
          <div className="flex gap-2">
            <button onClick={handleReset} className="px-4 py-2 border border-primary text-[10px] font-bold uppercase tracking-widest hover:bg-primary text-secondary transition-colors">
              Reset
            </button>
            <button onClick={toggleFullscreen} className="px-3 py-2 bg-primary text-secondary hover:bg-secondary hover:text-background transition-colors">
              <Maximize className="w-4 h-4" />
            </button>
            <button onClick={handleDownload} className="px-4 py-2 bg-accent text-background font-bold uppercase tracking-widest hover:bg-[#a6704d] transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" /> <span className="hidden sm:inline">Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div 
        ref={containerRef}
        className={cn(
          "relative flex-1 bg-[#121a0d] border border-primary shadow-glow-primary overflow-hidden",
          isFullscreen ? "border-none" : ""
        )}
        style={{ cursor: 'grab' }}
      >
        <motion.div
           drag
           dragConstraints={containerRef}
           animate={controls}
           style={{ scale }}
           className="w-full h-full flex items-center justify-center origin-center"
        >
          {/* We use a specific container to hold the image and annotations so annotations scale and pan with it */}
          <div className="relative inline-block border-8 border-background p-4 bg-primary/20">
            {isEditMode ? (
              <div className="w-full max-w-[1200px]">
                <EditableImage 
                  src={content.planImage} 
                  onChange={(val) => setContent({...content, planImage: val})}
                />
              </div>
            ) : (
               <img 
                 src={content.planImage} 
                 alt="Plan Technique A3"
                 className="max-w-[1200px] w-full h-auto pointer-events-none opacity-90 mix-blend-screen"
                 style={{ filter: 'sepia(0.5) hue-rotate(60deg) saturate(2) brightness(0.9)' }} 
               />
            )}
            
            {content.annotations.map((ann) => (
              <div 
                key={ann.id}
                className="absolute"
                style={{ top: `${ann.y}%`, left: `${ann.x}%` }}
                onMouseEnter={() => setActiveAnnotation(ann.id)}
                onMouseLeave={() => setActiveAnnotation(null)}
              >
                <div className="relative -ml-3 -mt-3">
                  <div className="w-8 h-8 bg-secondary text-background flex items-center justify-center text-xs font-bold shadow-glow-secondary cursor-help z-10 relative hover:scale-110 transition-transform">
                    {ann.id}
                  </div>
                  
                  {(activeAnnotation === ann.id || isEditMode) && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`absolute top-10 left-1/2 -translate-x-1/2 w-56 p-4 glass-panel border-l-4 border-l-secondary z-20 ${isEditMode ? '' : 'pointer-events-none'}`}
                    >
                      {isEditMode ? (
                        <>
                           <EditableText value={ann.title} onChange={(val) => updateAnnotation(ann.id, 'title', val)} as="div" className="text-secondary font-bold text-xs uppercase tracking-widest mb-2" />
                           <EditableText value={ann.desc} onChange={(val) => updateAnnotation(ann.id, 'desc', val)} as="div" multiline className="text-[11px] text-[#f2e9e1] font-serif leading-relaxed opacity-90" />
                        </>
                      ) : (
                        <>
                          <h4 className="text-secondary font-bold text-xs uppercase tracking-widest mb-2">{ann.title}</h4>
                          <p className="text-[11px] text-[#f2e9e1] font-serif leading-relaxed opacity-90">{ann.desc}</p>
                        </>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
