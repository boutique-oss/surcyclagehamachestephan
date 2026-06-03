import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  AlertTriangle,
  AlertCircle,
  Globe,
  Terminal,
  History,
  Trash2,
  Activity,
  Wifi,
  WifiOff,
  Monitor,
  Clock,
  Database,
  Zap,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  RefreshCw,
  CloudOff,
  Sparkles,
} from 'lucide-react';
import { useAnim } from '../context/AnimationContext';
import { motion } from 'motion/react';
import { errorMonitor, ErrorEntry, ErrorType } from '../lib/errorMonitor';
import { supabase } from '../lib/supabase';

// ─── Hook erreurs live ────────────────────────────────────────────────────────

function useErrors() {
  const [errors, setErrors] = useState<ErrorEntry[]>(() => errorMonitor.getAll());
  useEffect(() => errorMonitor.subscribe(() => setErrors([...errorMonitor.getAll()])), []);
  return errors;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTs(iso: string) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) +
    ' ' +
    d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );
}

function truncate(s: string, n = 120) {
  return s.length > n ? s.slice(0, n) + '…' : s;
}

const ERROR_BADGE: Record<ErrorType, { label: string; color: string }> = {
  js:      { label: 'JS',      color: 'bg-red-900/60 text-red-300 border-red-700/50' },
  promise: { label: 'PROMISE', color: 'bg-orange-900/60 text-orange-300 border-orange-700/50' },
  fetch:   { label: 'FETCH',   color: 'bg-yellow-900/60 text-yellow-300 border-yellow-700/50' },
  console: { label: 'CONSOLE', color: 'bg-slate-800/60 text-slate-300 border-slate-600/50' },
};

// ─── Tab: Erreurs ─────────────────────────────────────────────────────────────

function ErrorRow({ entry }: { key?: React.Key; entry: ErrorEntry }) {
  const [open, setOpen] = useState(false);
  const badge = ERROR_BADGE[entry.type];

  return (
    <div className="border border-white/5 rounded bg-[#0d1309]/60 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-3 py-2 flex items-start gap-2 hover:bg-white/[0.03] transition-colors"
      >
        <span className={`mt-0.5 shrink-0 text-[8px] font-bold uppercase tracking-widest border rounded px-1 py-0.5 ${badge.color}`}>
          {badge.label}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-[#f2e9e1]/80 leading-tight break-words">
            {truncate(entry.message)}
          </p>
          {entry.source && (
            <p className="text-[9px] text-[#f2e9e1]/30 mt-0.5 truncate font-mono">
              {entry.source}
              {entry.line != null ? `:${entry.line}` : ''}
              {entry.col != null ? `:${entry.col}` : ''}
            </p>
          )}
        </div>
        <div className="shrink-0 flex flex-col items-end gap-1">
          <span className="text-[9px] text-[#f2e9e1]/25">{formatTs(entry.ts)}</span>
          {entry.stack && (
            open
              ? <ChevronDown className="w-3 h-3 text-[#f2e9e1]/30" />
              : <ChevronRight className="w-3 h-3 text-[#f2e9e1]/30" />
          )}
        </div>
      </button>
      {open && entry.stack && (
        <div className="px-3 pb-2 border-t border-white/5">
          <pre className="text-[9px] text-[#f2e9e1]/30 font-mono whitespace-pre-wrap break-all leading-relaxed mt-2 max-h-32 overflow-y-auto">
            {entry.stack}
          </pre>
        </div>
      )}
    </div>
  );
}

function TabErrors() {
  const errors = useErrors();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold ${errors.length > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {errors.length === 0 ? '✓ Aucune erreur' : `${errors.length} erreur${errors.length > 1 ? 's' : ''} détectée${errors.length > 1 ? 's' : ''}`}
          </span>
        </div>
        {errors.length > 0 && (
          <button
            onClick={() => errorMonitor.clear()}
            className="p-1 text-[#f2e9e1]/20 hover:text-red-400 transition-colors"
            title="Effacer"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
        {errors.length === 0 ? (
          <div className="flex flex-col items-center gap-3 mt-10">
            <div className="w-10 h-10 rounded-full bg-green-900/20 border border-green-700/30 flex items-center justify-center">
              <Activity className="w-5 h-5 text-green-500/60" />
            </div>
            <p className="text-[10px] text-[#f2e9e1]/20 uppercase tracking-widest text-center">
              Le site fonctionne<br />sans erreur détectée
            </p>
          </div>
        ) : (
          errors.map((e) => <ErrorRow key={e.id} entry={e} />)
        )}
      </div>
    </div>
  );
}

// ─── Tab: Modifications ───────────────────────────────────────────────────────

interface AuditEntry {
  key: string;
  oldVal: string;
  newVal: string;
  ts: string;
}

function TabAudit() {
  const [logs, setLogs] = useState<AuditEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem('admin_audit_log') || '[]'); }
    catch { return []; }
  });

  const clearLogs = () => {
    localStorage.removeItem('admin_audit_log');
    setLogs([]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
        <span className="text-[10px] text-[#f2e9e1]/40 uppercase tracking-widest">
          {logs.length} modification{logs.length > 1 ? 's' : ''}
        </span>
        {logs.length > 0 && (
          <button onClick={clearLogs} className="p-1 text-[#f2e9e1]/20 hover:text-red-400 transition-colors" title="Effacer">
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center gap-3 mt-10">
            <History className="w-8 h-8 text-[#f2e9e1]/10" />
            <p className="text-[10px] text-[#f2e9e1]/20 uppercase tracking-widest text-center">
              Aucune modification<br />enregistrée
            </p>
          </div>
        ) : (
          logs.map((entry, i) => (
            <div key={i} className="bg-[#0d1309]/60 border border-white/5 rounded p-2.5 text-[10px]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-secondary font-mono truncate max-w-[160px] text-[9px]">{entry.key}</span>
                <span className="text-[#f2e9e1]/25 text-[9px]">{formatTs(entry.ts)}</span>
              </div>
              <div className="text-red-400/50 truncate font-mono">− {entry.oldVal || '(vide)'}</div>
              <div className="text-green-400/60 truncate font-mono">+ {entry.newVal || '(vide)'}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Tab: Système ─────────────────────────────────────────────────────────────

function lsSize(): string {
  try {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i) ?? '';
      total += k.length + (localStorage.getItem(k) ?? '').length;
    }
    return total > 1024 ? `${(total / 1024).toFixed(1)} Ko` : `${total} o`;
  } catch {
    return 'N/A';
  }
}

function getNavInfo(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Edg')) return 'Edge';
  return 'Navigateur inconnu';
}

function getLoadTime(): string {
  try {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    if (nav) return `${Math.round(nav.loadEventEnd - nav.startTime)} ms`;
  } catch {}
  return 'N/A';
}

// ─── Sync Supabase ───────────────────────────────────────────────────────────

const CONTENT_KEYS = ['page_home', 'page_gabarit', 'page_recette', 'page_plan'];

type SyncStatus = 'idle' | 'syncing' | 'ok' | 'error';

function SyncPanel() {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [cloudKeys, setCloudKeys] = useState<string[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [imported, setImported] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const checkConnection = async () => {
    if (!supabase) { setConnected(false); return; }
    try {
      const { data, error } = await supabase.from('content').select('key');
      if (error) { setConnected(false); return; }
      setConnected(true);
      setCloudKeys((data ?? []).map((r: { key: string }) => r.key));
    } catch {
      setConnected(false);
    }
  };

  useEffect(() => { checkConnection(); }, []);

  const handlePushToCloud = async () => {
    if (!supabase) return;
    setSyncStatus('syncing');
    try {
      for (const k of CONTENT_KEYS) {
        const raw = localStorage.getItem(k);
        if (!raw) continue;
        let value: unknown;
        try { value = JSON.parse(raw); } catch { continue; }
        await supabase.from('content').upsert({ key: k, value, updated_at: new Date().toISOString() });
      }
      setLastSync(new Date().toLocaleTimeString('fr-FR'));
      setSyncStatus('ok');
      await checkConnection();
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  const handlePullFromCloud = async () => {
    if (!supabase) return;
    setSyncStatus('syncing');
    try {
      const { data } = await supabase.from('content').select('key, value');
      (data ?? []).forEach((row: { key: string; value: unknown }) => {
        localStorage.setItem(row.key, JSON.stringify(row.value));
      });
      setSyncStatus('ok');
      setLastSync(new Date().toLocaleTimeString('fr-FR'));
      setTimeout(() => { setSyncStatus('idle'); window.location.reload(); }, 800);
    } catch {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  const handleExport = () => {
    const data: Record<string, unknown> = {};
    CONTENT_KEYS.forEach((k) => {
      const val = localStorage.getItem(k);
      if (val) { try { data[k] = JSON.parse(val); } catch { data[k] = val; } }
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contenu-hamache-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string) as Record<string, unknown>;
        for (const [k, v] of Object.entries(data)) {
          if (!CONTENT_KEYS.includes(k)) continue;
          localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
          if (supabase) await supabase.from('content').upsert({ key: k, value: v, updated_at: new Date().toISOString() });
        }
        setImported(true);
        setTimeout(() => window.location.reload(), 800);
      } catch {
        alert("Fichier invalide.");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const statusColor = syncStatus === 'ok' ? 'text-green-400' : syncStatus === 'error' ? 'text-red-400' : syncStatus === 'syncing' ? 'text-secondary animate-pulse' : '';

  return (
    <div className="border border-white/5 rounded p-3 space-y-3">
      {/* Statut connexion */}
      <div className="flex items-center justify-between">
        <p className="text-[9px] uppercase tracking-widest text-secondary font-bold">Supabase Sync</p>
        <div className="flex items-center gap-1.5">
          {connected === null ? (
            <span className="text-[8px] text-[#f2e9e1]/30">Vérification…</span>
          ) : connected ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
              <span className="text-[8px] text-green-400 font-mono">{cloudKeys.length} pages en cloud</span>
            </>
          ) : (
            <>
              <CloudOff className="w-3 h-3 text-red-400" />
              <span className="text-[8px] text-red-400">Non connecté</span>
            </>
          )}
        </div>
      </div>

      {/* Pages en cloud */}
      {connected && cloudKeys.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {CONTENT_KEYS.map((k) => (
            <span key={k} className={`text-[7px] font-mono px-1.5 py-0.5 rounded border ${cloudKeys.includes(k) ? 'border-green-700/40 text-green-400/70 bg-green-900/10' : 'border-white/5 text-[#f2e9e1]/20'}`}>
              {k.replace('page_', '')}
              {cloudKeys.includes(k) ? ' ✓' : ' —'}
            </span>
          ))}
        </div>
      )}

      {/* Boutons sync cloud */}
      {connected && (
        <div className="flex gap-2">
          <button
            onClick={handlePushToCloud}
            disabled={syncStatus === 'syncing'}
            className="flex-1 py-2 bg-secondary/15 border border-secondary/30 text-secondary text-[8px] uppercase tracking-widest font-bold rounded hover:bg-secondary/25 disabled:opacity-40 transition-colors flex items-center justify-center gap-1"
          >
            <RefreshCw className={`w-2.5 h-2.5 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
            <span className={statusColor || 'text-secondary'}>
              {syncStatus === 'syncing' ? 'Sync…' : syncStatus === 'ok' ? 'Envoyé ✓' : syncStatus === 'error' ? 'Erreur' : 'Desktop → Cloud'}
            </span>
          </button>
          <button
            onClick={handlePullFromCloud}
            disabled={syncStatus === 'syncing'}
            className="flex-1 py-2 bg-white/5 border border-white/10 text-[#f2e9e1]/50 text-[8px] uppercase tracking-widest font-bold rounded hover:border-secondary/30 hover:text-secondary disabled:opacity-40 transition-colors flex items-center justify-center gap-1"
          >
            <Zap className="w-2.5 h-2.5" />
            Cloud → Ici
          </button>
        </div>
      )}

      {lastSync && (
        <p className="text-[8px] text-[#f2e9e1]/25 font-mono">Dernière sync : {lastSync}</p>
      )}

      {/* Export / Import fichier */}
      <div className="border-t border-white/5 pt-3 flex gap-2">
        <button onClick={handleExport} className="flex-1 py-1.5 border border-white/8 text-[#f2e9e1]/30 text-[7px] uppercase tracking-widest rounded hover:text-secondary hover:border-secondary/20 transition-colors flex items-center justify-center gap-1">
          <Database className="w-2.5 h-2.5" />Exporter JSON
        </button>
        <button onClick={() => fileRef.current?.click()} className={`flex-1 py-1.5 border text-[7px] uppercase tracking-widest rounded transition-colors flex items-center justify-center gap-1 ${imported ? 'border-green-700/40 text-green-400' : 'border-white/8 text-[#f2e9e1]/30 hover:text-secondary hover:border-secondary/20'}`}>
          <Zap className="w-2.5 h-2.5" />{imported ? 'Importé ✓' : 'Importer JSON'}
        </button>
        <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
      </div>
    </div>
  );
}

function CopyHash() {
  const [pwd, setPwd] = useState('');
  const [hash, setHash] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!pwd) return;
    const bytes = new TextEncoder().encode(pwd);
    const buf = await crypto.subtle.digest('SHA-256', bytes);
    const h = Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
    setHash(h);
  };

  const copy = () => {
    navigator.clipboard.writeText(hash).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="border border-white/5 rounded p-3 space-y-2">
      <p className="text-[9px] uppercase tracking-widest text-secondary font-bold">Générer un nouveau hash</p>
      <p className="text-[9px] text-[#f2e9e1]/30 leading-relaxed">
        Saisissez un nouveau mot de passe → copiez le hash → collez dans <code className="text-secondary font-mono">.env.local</code> → rebuild.
      </p>
      <div className="flex gap-2">
        <input
          type="password"
          value={pwd}
          onChange={(e) => { setPwd(e.target.value); setHash(''); }}
          onKeyDown={(e) => e.key === 'Enter' && generate()}
          placeholder="Nouveau mot de passe"
          className="flex-1 bg-[#0d1309] border border-primary text-[#f2e9e1] text-[10px] px-2 py-1.5 rounded focus:outline-none focus:border-secondary transition-colors font-mono"
        />
        <button
          onClick={generate}
          disabled={!pwd}
          className="px-2 py-1.5 bg-secondary/20 border border-secondary/30 text-secondary text-[9px] uppercase tracking-widest font-bold rounded hover:bg-secondary/30 disabled:opacity-30 transition-colors"
        >
          Hash
        </button>
      </div>
      {hash && (
        <div className="flex items-center gap-2">
          <code className="flex-1 text-[8px] font-mono text-[#f2e9e1]/50 break-all leading-relaxed">{hash}</code>
          <button onClick={copy} className="shrink-0 p-1 text-[#f2e9e1]/30 hover:text-secondary transition-colors">
            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
      )}
    </div>
  );
}

function TabSystem() {
  const [online, setOnline] = useState(navigator.onLine);
  const errors = useErrors();

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  const conn = (navigator as unknown as { connection?: { effectiveType?: string } }).connection;
  const errorCount = errors.length;

  const rows: [React.ReactNode, string][] = [
    [<span className="flex items-center gap-1">{online ? <Wifi className="w-3 h-3 text-green-400" /> : <WifiOff className="w-3 h-3 text-red-400" />} Connexion</span>, online ? `En ligne${conn?.effectiveType ? ` · ${conn.effectiveType}` : ''}` : 'Hors ligne'],
    [<span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Chargement</span>, getLoadTime()],
    [<span className="flex items-center gap-1"><Database className="w-3 h-3" /> Stockage local</span>, lsSize()],
    [<span className="flex items-center gap-1"><Monitor className="w-3 h-3" /> Navigateur</span>, getNavInfo()],
    [<span className="flex items-center gap-1"><Monitor className="w-3 h-3" /> Résolution</span>, `${window.screen.width}×${window.screen.height}`],
    [<span className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Erreurs actives</span>, errorCount === 0 ? '✓ Aucune' : `${errorCount} erreur${errorCount > 1 ? 's' : ''}`],
    [<span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Session</span>, new Date().toLocaleTimeString('fr-FR')],
  ];

  return (
    <div className="flex flex-col gap-4 px-3 py-3 overflow-y-auto h-full">
      <SyncPanel />
      <div className="border border-white/5 rounded overflow-hidden">
        {rows.map(([label, value], i) => (
          <div key={i} className={`flex items-center justify-between px-3 py-2 text-[10px] ${i < rows.length - 1 ? 'border-b border-white/5' : ''}`}>
            <span className="text-[#f2e9e1]/40 flex items-center gap-1">{label}</span>
            <span className={`font-mono text-right max-w-[140px] truncate ${value.startsWith('✓') ? 'text-green-400' : value.includes('erreur') ? 'text-red-400' : 'text-[#f2e9e1]/70'}`}>
              {value}
            </span>
          </div>
        ))}
      </div>

      <CopyHash />

      <div className="border border-white/5 rounded p-3 space-y-1">
        <p className="text-[9px] uppercase tracking-widest text-[#f2e9e1]/30 font-bold mb-2">Variable d'environnement</p>
        <code className="block text-[9px] font-mono text-secondary/70 leading-relaxed">
          VITE_ADMIN_HASH=&lt;votre_hash&gt;
        </code>
        <p className="text-[9px] text-[#f2e9e1]/20">
          Dans <code className="text-secondary/50">.env.local</code> (jamais commité en git)
        </p>
      </div>
    </div>
  );
}

// ─── Tab: Animations ─────────────────────────────────────────────────────────

function Toggle({ on, onChange, label, desc }: { on: boolean; onChange: (v: boolean) => void; label: string; desc: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
      <div className="flex-1 pr-3">
        <p className="text-[10px] text-[#f2e9e1]/70 font-semibold">{label}</p>
        <p className="text-[9px] text-[#f2e9e1]/25 mt-0.5 leading-snug">{desc}</p>
      </div>
      <button
        onClick={() => onChange(!on)}
        className={`shrink-0 w-9 h-5 rounded-full transition-all duration-300 relative ${on ? 'bg-secondary/60' : 'bg-white/10'}`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300 ${on ? 'left-[18px] bg-secondary' : 'left-0.5 bg-white/30'}`}
        />
      </button>
    </div>
  );
}

function TabAnimations() {
  const { s, set } = useAnim();

  return (
    <div className="flex flex-col h-full overflow-y-auto px-3 py-3 gap-3">
      <div className="border border-white/5 rounded p-3">
        <p className="text-[9px] uppercase tracking-widest text-secondary font-bold mb-3">Effets visuels</p>
        <Toggle
          on={s.spline}
          onChange={v => set({ spline: v })}
          label="Scène 3D Spline"
          desc="Fond 3D interactif — désactiver pour alléger les performances"
        />
        <Toggle
          on={s.particles}
          onChange={v => set({ particles: v })}
          label="Particules ambrées"
          desc="Poussières flottantes qui montent depuis le bas de l'écran"
        />
        <Toggle
          on={s.scanline}
          onChange={v => set({ scanline: v })}
          label="Ligne de scan"
          desc="Fine ligne lumineuse qui traverse l'écran périodiquement"
        />
        <Toggle
          on={s.cursorGlow}
          onChange={v => set({ cursorGlow: v })}
          label="Lueur curseur"
          desc="Halo subtil brun-ambre qui suit le pointeur"
        />
        <Toggle
          on={s.logoShimmer}
          onChange={v => set({ logoShimmer: v })}
          label="Shimmer logo"
          desc="Animation dorée sur le logo R dans la barre de navigation"
        />
      </div>

      <div className="border border-white/5 rounded p-3 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[9px] uppercase tracking-widest text-secondary font-bold">Intensité blobs</p>
          <span className="text-[9px] font-mono text-[#f2e9e1]/50">{s.blobIntensity}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={s.blobIntensity}
          onChange={e => set({ blobIntensity: Number(e.target.value) })}
          className="w-full accent-[#d4a574] cursor-pointer"
        />
        <div className="flex justify-between text-[8px] text-[#f2e9e1]/20 font-mono">
          <span>Désactivé</span>
          <span>Maximum</span>
        </div>
      </div>
    </div>
  );
}

// ─── Panneau principal ────────────────────────────────────────────────────────

type TabId = 'errors' | 'audit' | 'system' | 'animations';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'errors',     label: 'Erreurs',    icon: <AlertTriangle className="w-3 h-3" /> },
  { id: 'audit',      label: 'Modifs',     icon: <History className="w-3 h-3" /> },
  { id: 'animations', label: 'Anim',       icon: <Sparkles className="w-3 h-3" /> },
  { id: 'system',     label: 'Système',    icon: <Globe className="w-3 h-3" /> },
];

interface AdminPanelProps {
  onClose: () => void;
}

export function AdminPanel({ onClose }: AdminPanelProps) {
  const [tab, setTab] = useState<TabId>('errors');
  const errors = useErrors();
  const panelRef = useRef<HTMLDivElement>(null);

  // Fermeture au clic extérieur
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <motion.div
      ref={panelRef}
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 260 }}
      className="fixed top-0 right-0 h-full z-[90] flex flex-col"
      style={{
        width: '360px',
        background: 'rgba(10, 16, 8, 0.97)',
        backdropFilter: 'blur(24px)',
        borderLeft: '1px solid rgba(212,165,116,0.12)',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.6)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-sm bg-secondary/15 flex items-center justify-center">
            <Terminal className="w-3 h-3 text-secondary" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f2e9e1]">
            Console Admin
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Indicateur erreurs live */}
          <span className={`text-[9px] font-mono flex items-center gap-1 ${errors.length > 0 ? 'text-red-400' : 'text-green-500/60'}`}>
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${errors.length > 0 ? 'bg-red-400 animate-pulse' : 'bg-green-500/60'}`} />
            {errors.length > 0 ? `${errors.length} err.` : 'OK'}
          </span>
          <button
            onClick={onClose}
            className="p-1 text-[#f2e9e1]/20 hover:text-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div
        className="flex shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[9px] uppercase tracking-widest font-bold transition-all border-b-2 ${
              tab === t.id
                ? 'text-secondary border-secondary'
                : 'text-[#f2e9e1]/25 border-transparent hover:text-[#f2e9e1]/50'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
            {t.id === 'errors' && errors.length > 0 && (
              <span className="bg-red-500 text-white text-[7px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none">
                {errors.length > 9 ? '9+' : errors.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {tab === 'errors'     && <TabErrors />}
        {tab === 'audit'      && <TabAudit />}
        {tab === 'animations' && <TabAnimations />}
        {tab === 'system'     && <TabSystem />}
      </div>
    </motion.div>
  );
}

// Compte d'erreurs exporté pour le badge sur le bouton flottant
export function useErrorCount() {
  const [count, setCount] = useState(() => errorMonitor.getAll().length);
  useEffect(() => errorMonitor.subscribe(() => setCount(errorMonitor.getAll().length)), []);
  return count;
}
