import React, { useState } from 'react';
import { Pencil, ImagePlus, X, Check } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

interface EditableTextProps {
  value: string;
  onChange: (val: string) => void;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  className?: string;
  multiline?: boolean;
}

export function EditableText({ value, onChange, as: Component = 'span', className, multiline }: EditableTextProps) {
  const { isEditMode } = useAdmin();

  if (isEditMode) {
    if (multiline) {
      return (
        <div className="relative w-full">
          <Pencil className="absolute -top-2 -right-2 w-3 h-3 text-secondary opacity-60 z-10 pointer-events-none" />
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`bg-[#121a0d]/90 border border-secondary text-[#f2e9e1] rounded p-2 w-full font-sans resize-y focus:outline-none focus:ring-1 focus:ring-secondary ${className}`}
            rows={3}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      );
    }
    return (
      <div className="relative inline-flex w-full">
        <Pencil className="absolute -top-2 -right-2 w-3 h-3 text-secondary opacity-60 z-10 pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`bg-[#121a0d]/90 border border-secondary text-[#f2e9e1] rounded p-1 w-full font-sans focus:outline-none focus:ring-1 focus:ring-secondary ${className}`}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    );
  }

  return <Component className={className}>{value}</Component>;
}

interface EditableImageProps {
  src: string;
  alt?: string;
  onChange: (val: string) => void;
  className?: string;
}

export function EditableImage({ src, alt, onChange, className }: EditableImageProps) {
  const { isEditMode } = useAdmin();
  const [open, setOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const openPanel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUrlInput(src.startsWith('data:') ? '' : src);
    setOpen(true);
  };

  const handleApply = () => {
    const val = urlInput.trim();
    if (val) {
      onChange(val);
      setOpen(false);
    }
  };

  if (isEditMode) {
    return (
      <>
        {/* Image affichée normalement — aucun overlay */}
        <div className={className}>
          {src ? (
            <img src={src} alt={alt} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#162111] flex items-center justify-center text-secondary text-xs uppercase tracking-widest">
              Aucune image
            </div>
          )}
          {/* Badge discret — positionné dans le coin, ouvre le panel externe */}
          <button
            onClick={openPanel}
            title="Changer l'image"
            className="absolute top-2 right-2 z-20 bg-secondary text-background p-1.5 rounded-sm hover:bg-accent transition-colors shadow-glow-secondary"
          >
            <ImagePlus className="w-3 h-3" />
          </button>
        </div>

        {/* Panel URL — fixed, entièrement hors de la zone image */}
        {open && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-background/70 backdrop-blur-sm p-4"
            onClick={() => setOpen(false)}
          >
            <div
              className="bg-[#121a0d] border border-secondary/50 rounded-lg p-6 w-full max-w-sm shadow-glow-secondary flex flex-col gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImagePlus className="w-4 h-4 text-secondary" />
                  <span className="text-[11px] uppercase tracking-widest text-secondary font-bold">Changer l'image</span>
                </div>
                <button onClick={() => setOpen(false)} className="text-[#f2e9e1]/30 hover:text-secondary transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[9px] uppercase tracking-widest text-[#f2e9e1]/50">URL de l'image</label>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                  autoFocus
                  placeholder="https://…"
                  className="w-full bg-[#0d1309] border border-primary text-sm text-[#f2e9e1] p-3 rounded focus:outline-none focus:border-secondary transition-colors"
                />
              </div>

              <button
                onClick={handleApply}
                className="w-full bg-secondary text-background font-bold uppercase tracking-widest py-2.5 text-[10px] hover:bg-accent transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-3 h-3" />
                Appliquer
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  if (!src) return null;
  return <img src={src} alt={alt} className={className} />;
}
