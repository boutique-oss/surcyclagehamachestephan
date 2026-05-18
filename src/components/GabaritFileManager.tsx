import { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, Download, FileText, FolderOpen, Archive, RefreshCw, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import JSZip from 'jszip';
import { supabase } from '../lib/supabase';

const BUCKET = 'gabarits';
const PDF_PREFIX = 'pdfs/';
const ZIP_PREFIX = 'zip/';

interface StoredFile {
  name: string;
  path: string;
  size: number;
  publicUrl: string;
}

interface GabaritFileManagerProps {
  zipUrl: string;
  onZipUrlChange: (url: string) => void;
}

type Msg = { type: 'ok' | 'err'; text: string } | null;

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

async function ensureBucket() {
  const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
  // ignore "already exists" error
  if (error && !error.message.includes('already exists')) throw error;
}

export function GabaritFileManager({ zipUrl, onZipUrlChange }: GabaritFileManagerProps) {
  const [pdfs, setPdfs] = useState<StoredFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingZip, setUploadingZip] = useState(false);
  const [generatingZip, setGeneratingZip] = useState(false);
  const [generateProgress, setGenerateProgress] = useState('');
  const [msg, setMsg] = useState<Msg>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);

  function flash(type: 'ok' | 'err', text: string) {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4000);
  }

  async function loadFiles() {
    setLoading(true);
    try {
      await ensureBucket();
      const { data, error } = await supabase.storage.from(BUCKET).list(PDF_PREFIX, { limit: 100 });
      if (error) throw error;
      const files: StoredFile[] = (data ?? [])
        .filter(f => f.name !== '.emptyFolderPlaceholder')
        .map(f => {
          const path = `${PDF_PREFIX}${f.name}`;
          const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
          return { name: f.name, path, size: f.metadata?.size ?? 0, publicUrl: urlData.publicUrl };
        });
      setPdfs(files);
    } catch (e: unknown) {
      flash('err', `Erreur chargement : ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadFiles(); }, []);

  async function uploadPdf(file: File) {
    if (!file.name.endsWith('.pdf')) { flash('err', 'Seuls les fichiers .pdf sont acceptés.'); return; }
    setUploadingPdf(true);
    try {
      await ensureBucket();
      const path = `${PDF_PREFIX}${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true });
      if (error) throw error;
      flash('ok', `"${file.name}" uploadé.`);
      await loadFiles();
    } catch (e: unknown) {
      flash('err', `Erreur upload : ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setUploadingPdf(false);
    }
  }

  async function deletePdf(path: string, name: string) {
    if (!confirm(`Supprimer "${name}" ?`)) return;
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) { flash('err', `Erreur suppression : ${error.message}`); return; }
    flash('ok', `"${name}" supprimé.`);
    setPdfs(prev => prev.filter(f => f.path !== path));
  }

  async function uploadZip(file: File) {
    if (!file.name.endsWith('.zip')) { flash('err', 'Seul un fichier .zip est accepté ici.'); return; }
    setUploadingZip(true);
    try {
      await ensureBucket();
      const path = `${ZIP_PREFIX}gabarits.zip`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
      onZipUrlChange(urlData.publicUrl);
      flash('ok', 'ZIP mis à jour et lien public enregistré.');
    } catch (e: unknown) {
      flash('err', `Erreur upload ZIP : ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setUploadingZip(false);
    }
  }

  async function generateZip() {
    if (pdfs.length === 0) { flash('err', 'Aucun PDF à zipper — uploadez d\'abord des fichiers.'); return; }
    setGeneratingZip(true);
    try {
      const zip = new JSZip();
      for (let i = 0; i < pdfs.length; i++) {
        const f = pdfs[i];
        setGenerateProgress(`Téléchargement ${i + 1}/${pdfs.length} — ${f.name}`);
        const { data, error: dlErr } = await supabase.storage.from(BUCKET).download(f.path);
        if (dlErr || !data) throw new Error(`Impossible de télécharger ${f.name} : ${dlErr?.message}`);
        zip.file(f.name, data);
      }
      setGenerateProgress('Compression en cours…');
      const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
      setGenerateProgress('Upload du ZIP…');
      const path = `${ZIP_PREFIX}gabarits.zip`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, blob, { upsert: true, contentType: 'application/zip' });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
      onZipUrlChange(urlData.publicUrl);
      flash('ok', `ZIP généré (${pdfs.length} PDF${pdfs.length > 1 ? 's' : ''}) et lien public mis à jour.`);
    } catch (e: unknown) {
      flash('err', `Erreur génération ZIP : ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setGeneratingZip(false);
      setGenerateProgress('');
    }
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Message flash */}
      {msg && (
        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium border ${
          msg.type === 'ok'
            ? 'bg-secondary/10 border-secondary/30 text-secondary'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {msg.type === 'ok' ? <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />}
          {msg.text}
        </div>
      )}

      {/* ZIP de téléchargement public */}
      <div className="glass-card flex flex-col gap-3 border border-accent/30">
        <div className="flex items-center gap-2 pb-2 border-b border-primary">
          <Archive className="w-4 h-4 text-accent" />
          <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-accent">ZIP téléchargeable (public)</h3>
        </div>

        {/* Champ URL direct */}
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={zipUrl}
            onChange={e => onZipUrlChange(e.target.value)}
            placeholder="https://… URL Supabase du .zip"
            className="flex-1 bg-[#0d1309] border border-primary text-[10px] text-[#f2e9e1] px-3 py-2 rounded focus:outline-none focus:border-accent transition-colors font-mono"
          />
          {zipUrl && (
            <button
              onClick={() => onZipUrlChange('')}
              className="text-[#f2e9e1]/30 hover:text-red-400 transition-colors text-[9px] uppercase tracking-widest flex-shrink-0 px-2"
            >
              Effacer
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-primary/40" />
          <span className="text-[9px] text-[#f2e9e1]/30 uppercase tracking-widest">ou uploader</span>
          <div className="flex-1 h-px bg-primary/40" />
        </div>

        <div className="flex gap-2 items-center">
          <button
            onClick={() => zipInputRef.current?.click()}
            disabled={uploadingZip}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold border border-accent text-accent hover:bg-accent hover:text-[#f2e9e1] transition-colors rounded disabled:opacity-50"
          >
            {uploadingZip ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            {zipUrl ? 'Remplacer le ZIP' : 'Uploader le ZIP'}
          </button>
          <input
            ref={zipInputRef}
            type="file"
            accept=".zip"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) uploadZip(f); e.target.value = ''; }}
          />
        </div>
      </div>

      {/* Gestionnaire PDFs */}
      <div className="glass-card flex flex-col gap-3 border border-secondary/30">
        <div className="flex items-center justify-between pb-2 border-b border-primary">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-secondary" />
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-secondary">Fichiers PDF</h3>
            <span className="text-[9px] text-[#f2e9e1]/40 font-mono">{pdfs.length} fichier{pdfs.length !== 1 ? 's' : ''}</span>
          </div>
          <button
            onClick={loadFiles}
            disabled={loading}
            className="text-[#f2e9e1]/40 hover:text-secondary transition-colors"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Liste */}
        {loading ? (
          <div className="flex items-center gap-2 text-[10px] text-[#f2e9e1]/40 py-2">
            <RefreshCw className="w-3 h-3 animate-spin" /> Chargement…
          </div>
        ) : pdfs.length === 0 ? (
          <p className="text-[10px] text-[#f2e9e1]/40 italic py-2">Aucun PDF — uploadez vos premiers gabarits.</p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {pdfs.map(f => (
              <li key={f.path} className="flex items-center gap-2 px-3 py-2 rounded bg-black/20 hover:bg-black/30 transition-colors group">
                <FileText className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                <span className="flex-1 text-[10px] text-[#f2e9e1]/80 font-mono truncate">{f.name}</span>
                <span className="text-[9px] text-[#f2e9e1]/30 font-mono flex-shrink-0">{formatSize(f.size)}</span>
                <a
                  href={f.publicUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#f2e9e1]/30 hover:text-secondary transition-colors flex-shrink-0"
                  title="Télécharger"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => deletePdf(f.path, f.name)}
                  className="text-[#f2e9e1]/20 hover:text-red-400 transition-colors flex-shrink-0"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Générer ZIP */}
        {pdfs.length > 0 && (
          <div className="flex flex-col gap-2 pt-1 border-t border-primary/30">
            <button
              onClick={generateZip}
              disabled={generatingZip}
              className="flex items-center gap-2 px-3 py-2 text-[10px] uppercase tracking-widest font-bold border border-accent text-accent hover:bg-accent hover:text-[#f2e9e1] transition-colors rounded disabled:opacity-50"
            >
              {generatingZip
                ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                : <Zap className="w-3.5 h-3.5" />}
              Générer ZIP depuis les PDFs ({pdfs.length})
            </button>
            {generatingZip && generateProgress && (
              <p className="text-[9px] text-[#f2e9e1]/40 font-mono px-1">{generateProgress}</p>
            )}
          </div>
        )}

        {/* Upload PDF */}
        <div className="flex gap-2 items-center pt-1">
          <button
            onClick={() => pdfInputRef.current?.click()}
            disabled={uploadingPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold border border-secondary text-secondary hover:bg-secondary hover:text-background transition-colors rounded disabled:opacity-50"
          >
            {uploadingPdf ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            Ajouter un PDF
          </button>
          <input
            ref={pdfInputRef}
            type="file"
            accept=".pdf"
            multiple
            className="hidden"
            onChange={e => {
              const files: File[] = Array.from(e.target.files ?? []);
              files.forEach(f => uploadPdf(f));
              e.target.value = '';
            }}
          />
          <span className="text-[9px] text-[#f2e9e1]/30">Plusieurs fichiers acceptés</span>
        </div>
      </div>
    </div>
  );
}
