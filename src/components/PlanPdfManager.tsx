import { useState, useRef } from 'react';
import { Upload, Trash2, FileText, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const BUCKET = 'gabarits';

export interface PlanSlot {
  label: string;
  key: 'plan1Url' | 'plan2Url' | 'plan3Url';
  storagePath: string;
}

const PLAN_SLOTS: PlanSlot[] = [
  { label: 'Plan 1', key: 'plan1Url', storagePath: 'plans/plan-1.pdf' },
  { label: 'Plan 2', key: 'plan2Url', storagePath: 'plans/plan-2.pdf' },
  { label: 'Plan 3', key: 'plan3Url', storagePath: 'plans/plan-3.pdf' },
];

type Msg = { type: 'ok' | 'err'; text: string } | null;

interface PlanPdfManagerProps {
  plan1Url: string;
  plan2Url: string;
  plan3Url: string;
  onChange: (key: 'plan1Url' | 'plan2Url' | 'plan3Url', url: string) => void;
}

export function PlanPdfManager({ plan1Url, plan2Url, plan3Url, onChange }: PlanPdfManagerProps) {
  const [uploading, setUploading] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [msg, setMsg] = useState<Msg>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const urls: Record<string, string> = { plan1Url, plan2Url, plan3Url };

  function flash(type: 'ok' | 'err', text: string) {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4000);
  }

  async function uploadPdf(slot: PlanSlot, file: File) {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      flash('err', 'Seuls les fichiers .pdf sont acceptés.');
      return;
    }
    setUploading(slot.key);
    try {
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(slot.storagePath, file, { upsert: true, contentType: 'application/pdf' });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(slot.storagePath);
      // Ajouter un cache-buster pour forcer le rechargement de l'iframe
      onChange(slot.key, `${urlData.publicUrl}?t=${Date.now()}`);
      flash('ok', `"${slot.label}" importé avec succès.`);
    } catch (e: unknown) {
      flash('err', `Erreur : ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setUploading(null);
    }
  }

  async function deletePdf(slot: PlanSlot) {
    setDeleting(slot.key);
    try {
      await supabase.storage.from(BUCKET).remove([slot.storagePath]);
      onChange(slot.key, '');
      flash('ok', `"${slot.label}" supprimé.`);
    } catch (e: unknown) {
      flash('err', `Erreur suppression : ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {msg && (
        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium border ${
          msg.type === 'ok'
            ? 'bg-secondary/10 border-secondary/30 text-secondary'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {msg.type === 'ok'
            ? <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
            : <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />}
          {msg.text}
        </div>
      )}

      {PLAN_SLOTS.map((slot) => {
        const url = urls[slot.key];
        const isUploading = uploading === slot.key;
        const isDeleting = deleting === slot.key;

        return (
          <div key={slot.key} className="glass-card flex flex-col gap-3 border border-secondary/25">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-secondary flex-shrink-0" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">{slot.label}</span>
                {url ? (
                  <span className="text-[9px] bg-secondary/10 border border-secondary/25 text-secondary px-1.5 py-0.5 rounded uppercase tracking-widest">
                    PDF importé
                  </span>
                ) : (
                  <span className="text-[9px] text-[#f0e6d3]/30 uppercase tracking-widest">vide</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {url && (
                  <button
                    onClick={() => deletePdf(slot)}
                    disabled={isDeleting}
                    className="text-[#f0e6d3]/40 hover:text-red-400 transition-colors"
                    title="Supprimer"
                  >
                    {isDeleting
                      ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                )}
                <button
                  onClick={() => inputRefs.current[slot.key]?.click()}
                  disabled={isUploading}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold border border-secondary text-secondary hover:bg-secondary hover:text-background transition-colors rounded disabled:opacity-50"
                >
                  {isUploading
                    ? <RefreshCw className="w-3 h-3 animate-spin" />
                    : <Upload className="w-3 h-3" />}
                  {url ? 'Remplacer' : 'Importer'}
                </button>
                <input
                  ref={(el) => { inputRefs.current[slot.key] = el; }}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadPdf(slot, f);
                    e.target.value = '';
                  }}
                />
              </div>
            </div>

            {url && (
              <p className="text-[9px] text-[#f0e6d3]/30 font-mono truncate">{url.split('?')[0].split('/').pop()}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
