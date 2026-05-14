import { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize, Download } from 'lucide-react';
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
  const pinchDist = useRef<number | null>(null);

  const handleZoomIn = () => setScale(s => Math.min(s + 0.25, 3));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.25, 0.5));
  const handleReset = () => {
    setScale(1);
    controls.start({ x: 0, y: 0 });
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    setIsFullscreen(false);
  };

  const toggleFullscreen = async () => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      setIsFullscreen(true);
      try {
        await containerRef.current?.requestFullscreen();
      } catch {
        // CSS fullscreen appliqué — fallback iOS
      }
    }
  };

  // Pinch-to-zoom mobile + ESC + fullscreenchange
  useEffect(() => {
    const el = containerRef.current;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        pinchDist.current = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && pinchDist.current !== null) {
        e.preventDefault();
        const d = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        setScale(s => Math.min(Math.max(s * (d / pinchDist.current!), 0.5), 3));
        pinchDist.current = d;
      }
    };
    const onTouchEnd = () => { pinchDist.current = null; };

    const onFullscreenChange = () => { if (!document.fullscreenElement) setIsFullscreen(false); };
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsFullscreen(false); };

    el?.addEventListener('touchstart', onTouchStart, { passive: false });
    el?.addEventListener('touchmove', onTouchMove, { passive: false });
    el?.addEventListener('touchend', onTouchEnd);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      el?.removeEventListener('touchstart', onTouchStart);
      el?.removeEventListener('touchmove', onTouchMove);
      el?.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = content.planImage;
    link.download = 'Plan_Fauteuil_Reception.jpg';
    link.click();
  };

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col gap-3 md:gap-6 pb-4 md:pb-12 h-[calc(100vh-80px)]">
      {/* Barre outils — tout en ligne sur mobile */}
      <div className="flex flex-row items-center justify-between gap-2 glass-panel p-3 md:p-4 rounded-lg border-l-4 border-l-secondary flex-wrap">
        <div className="flex-1 min-w-0">
          <h1 className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-secondary truncate">Plan Technique A3</h1>
          <p className="text-[9px] md:text-[10px] text-[#f2e9e1] opacity-70 tracking-widest mt-0.5 hidden sm:block">Glissez · Zoom</p>
        </div>

        {/* Contrôles en ligne */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Zoom controls */}
          <div className="flex bg-[#121a0d] border border-primary rounded overflow-hidden">
            <button onClick={handleZoomOut} className="px-2 md:px-3 py-1.5 md:py-2 hover:bg-primary/50 text-secondary transition-colors">
              <ZoomOut className="w-3 h-3 md:w-4 md:h-4" />
            </button>
            <div className="px-2 md:px-3 py-1.5 md:py-2 text-[9px] md:text-[10px] uppercase tracking-widest border-x border-primary w-12 md:w-16 text-center text-secondary font-bold flex items-center justify-center">
              {Math.round(scale * 100)}%
            </div>
            <button onClick={handleZoomIn} className="px-2 md:px-3 py-1.5 md:py-2 hover:bg-primary/50 text-secondary transition-colors">
              <ZoomIn className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          </div>

          {/* Boutons action */}
          <div className="flex gap-1.5 md:gap-2">
            <button onClick={handleReset} className="px-2 md:px-4 py-1.5 md:py-2 border border-primary text-[9px] md:text-[10px] font-bold uppercase tracking-widest hover:bg-primary text-secondary transition-colors">
              Reset
            </button>
            <button onClick={toggleFullscreen} className="px-2 md:px-3 py-1.5 md:py-2 bg-primary text-secondary hover:bg-secondary hover:text-background transition-colors">
              <Maximize className="w-3 h-3 md:w-4 md:h-4" />
            </button>
            <button onClick={handleDownload} className="px-2 md:px-4 py-1.5 md:py-2 bg-accent text-background font-bold uppercase tracking-widest hover:bg-[#a6704d] transition-colors flex items-center gap-1.5">
              <Download className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline text-[9px] md:text-[10px]">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Conteneur plan */}
      <div
        ref={containerRef}
        className={cn(
          "relative bg-[#121a0d] border border-primary shadow-glow-primary overflow-hidden",
          isFullscreen
            ? "fixed inset-0 z-[9999] border-none flex items-center justify-center"
            : "flex-1"
        )}
        style={{
          cursor: 'grab',
          ...(isFullscreen ? {
            paddingTop: 'env(safe-area-inset-top, 0px)',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          } : {}),
        }}
      >
        {/* Bouton fermer — desktop + mobile */}
        {isFullscreen && (
          <button
            onClick={exitFullscreen}
            className="absolute right-4 z-10 bg-background/80 backdrop-blur-sm text-secondary border border-secondary/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-secondary hover:text-background transition-colors"
            style={{ top: 'calc(1rem + env(safe-area-inset-top, 0px))' }}
          >
            ✕ Fermer
          </button>
        )}
        <motion.div
          drag
          dragConstraints={containerRef}
          animate={controls}
          style={{ scale }}
          className="w-full h-full flex items-center justify-center origin-center"
        >
          <div className="relative inline-block border-4 md:border-8 border-background p-2 md:p-4 bg-primary/20">
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
                className="max-w-[1200px] w-full h-auto pointer-events-none"
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
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-secondary text-background flex items-center justify-center text-[10px] md:text-xs font-bold shadow-glow-secondary cursor-help z-10 relative hover:scale-110 transition-transform">
                    {ann.id}
                  </div>

                  {(activeAnnotation === ann.id || isEditMode) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`absolute top-8 md:top-10 left-1/2 -translate-x-1/2 w-44 md:w-56 p-3 md:p-4 glass-panel border-l-4 border-l-secondary z-20 ${isEditMode ? '' : 'pointer-events-none'}`}
                    >
                      {isEditMode ? (
                        <>
                          <EditableText value={ann.title} onChange={(val) => updateAnnotation(ann.id, 'title', val)} as="div" className="text-secondary font-bold text-xs uppercase tracking-widest mb-2" />
                          <EditableText value={ann.desc} onChange={(val) => updateAnnotation(ann.id, 'desc', val)} as="div" multiline className="text-[11px] text-[#f2e9e1] font-serif leading-relaxed opacity-90" />
                        </>
                      ) : (
                        <>
                          <h4 className="text-secondary font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1 md:mb-2">{ann.title}</h4>
                          <p className="text-[10px] md:text-[11px] text-[#f2e9e1] font-serif leading-relaxed opacity-90">{ann.desc}</p>
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
