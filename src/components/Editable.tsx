import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
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
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`bg-[#121a0d]/90 border border-secondary text-[#f2e9e1] rounded p-2 w-full font-sans resize-y focus:outline-none focus:ring-1 focus:ring-secondary ${className}`}
          rows={3}
          onClick={(e) => e.stopPropagation()}
        />
      );
    }
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`bg-[#121a0d]/90 border border-secondary text-[#f2e9e1] rounded p-1 w-full font-sans focus:outline-none focus:ring-1 focus:ring-secondary ${className}`}
        onClick={(e) => e.stopPropagation()}
      />
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
      <div className={`relative group w-full h-full ${className}`}>
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover mix-blend-screen opacity-90" />
        ) : (
          <div className="w-full h-full bg-[#162111] flex items-center justify-center text-secondary text-xs uppercase tracking-widest">
            Aucune image
          </div>
        )}

        <div className="absolute inset-0 bg-[#121a0d]/80 p-4 flex flex-col justify-center items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          {/* Bouton upload fichier */}
          <button
            onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
            className="flex items-center gap-2 bg-secondary text-background text-[10px] font-bold uppercase tracking-widest px-4 py-2 hover:bg-accent transition-colors"
          >
            <Upload className="w-3 h-3" />
            Importer une image
          </button>

          {/* Séparateur */}
          <span className="text-[#f2e9e1]/30 text-[9px] uppercase tracking-widest">ou</span>

          {/* URL manuelle */}
          <div className="flex flex-col items-center gap-1 w-full max-w-xs">
            <label className="text-[10px] text-secondary uppercase tracking-widest">Coller une URL</label>
            <input
              type="text"
              defaultValue={src.startsWith('data:') ? '' : src}
              onBlur={(e) => { if (e.target.value.trim()) onChange(e.target.value.trim()); }}
              onClick={(e) => e.stopPropagation()}
              placeholder="https://..."
              className="w-full bg-[#162111] border border-primary text-xs text-[#f2e9e1] p-2 rounded focus:outline-none focus:border-secondary"
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
