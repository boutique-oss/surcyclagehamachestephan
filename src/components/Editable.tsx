import React from 'react';
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

  if (isEditMode) {
    return (
      <div className={`relative group w-full h-full ${className}`}>
        <img src={src} alt={alt} className="w-full h-full object-cover mix-blend-screen opacity-90" />
        <div className="absolute inset-0 bg-[#121a0d]/80 p-4 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <label className="text-[10px] text-secondary uppercase tracking-widest mb-2">Modifier l'URL de l'image</label>
          <input
            type="text"
            value={src}
            onChange={(e) => onChange(e.target.value)}
            className="w-full max-w-sm bg-[#162111] border border-primary text-xs text-[#f2e9e1] p-2 rounded focus:outline-none focus:border-secondary"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} />;
}
