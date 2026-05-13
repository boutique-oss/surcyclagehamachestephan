import React, { useRef } from 'react';
import { Upload, Pencil, Link2 } from 'lucide-react';
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
        <div className="relative group/edit w-full">
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
      <div className="relative inline-flex items-center gap-1 w-full group/edit">
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
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  if (isEditMode) {
    return (
      // Le wrapper hérite du positionnement (absolute inset-0 etc.) via className
      // puis passe en flex-col : image en haut, contrôles EN DESSOUS sans overlay
      <div className={`flex flex-col ${className ?? ''}`}>
        {/* Image — occupe tout l'espace restant, jamais obscurcie */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {src ? (
            <img src={src} alt={alt} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#162111] flex items-center justify-center text-secondary text-xs uppercase tracking-widest">
              Aucune image
            </div>
          )}
        </div>

        {/* Contrôles EXTÉRIEURS à la zone image — barre sous la photo */}
        <div className="flex-shrink-0 flex flex-row items-center gap-2 bg-[#0d1309] border-t border-secondary/40 px-2 py-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
            className="flex items-center gap-1.5 bg-secondary text-background text-[9px] font-bold uppercase tracking-widest px-3 py-1 hover:bg-accent transition-colors whitespace-nowrap"
          >
            <Upload className="w-3 h-3" />
            Importer
          </button>

          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <Link2 className="w-3 h-3 text-secondary flex-shrink-0" />
            <input
              type="text"
              defaultValue={src.startsWith('data:') ? '' : src}
              onBlur={(e) => { if (e.target.value.trim()) onChange(e.target.value.trim()); }}
              onClick={(e) => e.stopPropagation()}
              placeholder="Coller une URL…"
              className="flex-1 min-w-0 bg-transparent border-b border-primary text-[10px] text-[#f2e9e1]/70 py-0.5 focus:outline-none focus:border-secondary transition-colors placeholder:text-[#f2e9e1]/20"
            />
          </div>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
      </div>
    );
  }

  if (!src) return null;
  return <img src={src} alt={alt} className={className} />;
}
