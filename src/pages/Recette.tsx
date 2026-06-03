import type { ReactNode, ElementType } from 'react';
import { motion } from 'motion/react';
import {
  ExternalLink, Wind, Droplets, FlaskConical,
  Timer, Layers, Maximize2, Clock, SlidersHorizontal,
  AlertTriangle, CheckCircle, Info,
} from 'lucide-react';

/* ────────────────────────────────── atoms ── */

function Tag({ type, children }: { type: 'warn' | 'ok' | 'tip'; children: ReactNode }) {
  const s = {
    warn: 'bg-red-500/10 border-red-500/25 text-red-400',
    ok:   'bg-secondary/10 border-secondary/25 text-secondary',
    tip:  'bg-primary/30 border-primary/50 text-[#a8c47a]',
  }[type];
  const Icon = type === 'warn' ? AlertTriangle : type === 'ok' ? CheckCircle : Info;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] md:text-[10px] font-semibold ${s}`}>
      <Icon className="w-2.5 h-2.5 flex-shrink-0" />{children}
    </span>
  );
}

/* Barre animée avec chiffre flottant */
function StatBar({ pct, color, label, value, delay = 0 }: {
  pct: number; color: string; label: string; value: string; delay?: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#f0e6d3]/60">{label}</span>
        <span className="text-xl md:text-2xl font-black font-mono" style={{ color }}>{value}</span>
      </div>
      <div className="relative h-3 md:h-3.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}99, ${color})` }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.9 }}
          className="absolute right-2 inset-y-0 flex items-center text-[8px] font-mono font-bold text-black/60"
        >
          {pct}%
        </motion.div>
      </div>
    </div>
  );
}

/* Carte stat clé */
function KPI({ label, value, unit, sub, color = '#d4a574' }: {
  label: string; value: string; unit?: string; sub?: string; color?: string;
}) {
  return (
    <div className="glass-panel rounded-xl border border-primary/30 px-4 py-4 flex flex-col gap-1">
      <p className="text-[9px] uppercase tracking-[0.25em] font-mono text-[#f0e6d3]/40">{label}</p>
      <p className="text-2xl md:text-3xl font-black font-mono leading-none" style={{ color }}>
        {value}{unit && <span className="text-sm font-normal ml-1 opacity-70">{unit}</span>}
      </p>
      {sub && <p className="text-[9px] text-[#f0e6d3]/35 font-serif mt-0.5">{sub}</p>}
    </div>
  );
}

/* Étape avec icône */
function Step({ n, icon: Icon, titre, color = '#d4a574', children }: {
  n: number; icon: ElementType; titre: string; color?: string; children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 * n, duration: 0.4 }}
      className="flex gap-4 md:gap-5"
    >
      {/* Colonne gauche : numéro + trait */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}40` }}
        >
          <Icon className="w-4 h-4 md:w-4.5 md:h-4.5" style={{ color }} />
        </div>
        {n < 7 && <div className="w-px flex-1 mt-2" style={{ background: `${color}20` }} />}
      </div>

      {/* Contenu */}
      <div className="flex-1 pb-6 md:pb-8">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
            style={{ background: `${color}18`, color }}
          >
            {String(n).padStart(2, '0')}
          </span>
          <p className="text-[11px] md:text-sm font-bold uppercase tracking-wide text-[#f0e6d3]">{titre}</p>
        </div>
        <div className="text-[10px] md:text-[11px] text-[#f0e6d3]/65 font-serif leading-relaxed flex flex-col gap-2">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────── page ── */

export function Recette() {
  return (
    <div className="flex-1 w-full max-w-3xl mx-auto flex flex-col gap-10 md:gap-14 pb-10 md:pb-16 pt-2 md:pt-4">

      {/* ── En-tête ── */}
      <motion.header initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[9px] md:text-[10px] uppercase tracking-[0.35em] text-secondary/50 font-mono mb-2">01 · Recette</p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#f0e6d3] leading-tight mb-3">
          Bloc de mousse<br />
          <span className="text-secondary">recyclée compressée</span>
        </h1>
        <p className="text-xs md:text-sm text-[#f0e6d3]/50 font-serif max-w-md">
          Fabrication par compression de flocons HR — colle D4, coffrage bois,
          maintien sous pression. Fauteuil Réception · Atelier Hamache.
        </p>
      </motion.header>

      {/* ── KPIs ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        <KPI label="Mousse cible" value="5,1" unit="kg" sub="pour 80 kg/m³" />
        <KPI label="Liant D4" value="11" unit="%" sub="600 – 720 g" color="#8b5a3c" />
        <KPI label="Eau MDI" value="1–2" unit="%" sub="60 – 120 g" color="#a8c47a" />
        <KPI label="Compression" value="×7" sub="70 → 10 cm" color="#d4a574" />
      </motion.div>

      {/* ── Fiche technique D4 ── */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-5 rounded-full bg-secondary" />
          <h2 className="text-xs md:text-sm uppercase tracking-[0.2em] font-black text-[#f0e6d3]">
            Fiche technique — Colle D4
          </h2>
          <a
            href="https://www.hout-info.be/fr/colles-adhesifs/colle-a-bois-d4"
            target="_blank" rel="noreferrer"
            className="ml-auto flex items-center gap-1 text-[9px] uppercase tracking-widest text-secondary/40 hover:text-secondary transition-colors border border-secondary/15 hover:border-secondary/40 px-2 py-1 rounded-lg"
          >
            <ExternalLink className="w-2.5 h-2.5" />Source
          </a>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          {/* Carte base */}
          <div className="glass-panel rounded-xl border border-primary/30 p-4 flex flex-col gap-3 sm:col-span-1">
            <p className="text-[9px] uppercase tracking-widest text-secondary/50 font-mono">Base &amp; certification</p>
            <p className="text-[10px] md:text-[11px] text-[#f0e6d3]/70 font-serif leading-relaxed">
              Résine <strong className="text-[#f0e6d3]/90">polyvinylique (PVA)</strong> — incolore après séchage.
            </p>
            <div className="mt-auto">
              <span className="text-[9px] font-mono font-bold px-2 py-1 rounded bg-secondary/15 text-secondary border border-secondary/20">
                NF EN 204 · Classe D4
              </span>
            </div>
          </div>

          {/* Rendement */}
          <div className="glass-panel rounded-xl border border-primary/30 p-4 flex flex-col gap-2">
            <p className="text-[9px] uppercase tracking-widest text-secondary/50 font-mono mb-1">Rendement</p>
            {[
              ['Brosse', '6 – 7 m²/l'],
              ['Applicateur', '7 – 8 m²/l'],
              ['Spatule', '8 – 9 m²/l'],
            ].map(([outil, rdt]) => (
              <div key={outil} className="flex justify-between items-center py-1.5 border-b border-primary/15 last:border-0">
                <span className="text-[10px] text-[#f0e6d3]/50 font-serif">{outil}</span>
                <span className="text-[10px] font-black font-mono text-secondary">{rdt}</span>
              </div>
            ))}
          </div>

          {/* Recommandations */}
          <div className="glass-panel rounded-xl border border-primary/30 p-4 flex flex-col gap-2">
            <p className="text-[9px] uppercase tracking-widest text-secondary/50 font-mono mb-1">Recommandations</p>
            {[
              'Bois sec < 20 % d\'humidité',
              'Surface propre, dégraissée',
              'Agiter avant emploi',
              'Couche homogène, sans surépaisseur',
              'Rincer les débordements à l\'eau',
            ].map((r) => (
              <div key={r} className="flex items-start gap-1.5">
                <span className="text-secondary mt-0.5 text-[9px] flex-shrink-0">—</span>
                <p className="text-[9px] md:text-[10px] text-[#f0e6d3]/60 font-serif leading-snug">{r}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── Graphique composition ── */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-5 rounded-full bg-accent" />
          <h2 className="text-xs md:text-sm uppercase tracking-[0.2em] font-black text-[#f0e6d3]">
            Composition &amp; dosages — pour 6 kg
          </h2>
        </div>

        <div className="glass-panel rounded-xl border border-primary/30 p-5 md:p-6 flex flex-col gap-6">

          {/* Barres */}
          <div className="flex flex-col gap-5">
            <StatBar pct={88} color="#d4a574" label="Mousse (flocons HR recyclés)" value="5,1 – 6 kg" delay={0.2} />
            <StatBar pct={11} color="#8b5a3c" label="Colle D4 · liant PU"         value="600 – 720 g" delay={0.35} />
            <StatBar pct={1.5} color="#a8c47a" label="Eau · humidification MDI"   value="60 – 120 g" delay={0.5} />
          </div>

          {/* Densité */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-primary/20">
            <div className="bg-black/20 rounded-xl p-4 flex flex-col gap-1 border border-primary/20">
              <p className="text-[9px] uppercase tracking-widest font-mono text-[#f0e6d3]/35">Volume coffrage</p>
              <p className="text-lg md:text-xl font-black font-mono text-[#f0e6d3]">0,064 m³</p>
              <p className="text-[9px] text-[#f0e6d3]/35 font-serif">80 × 80 × 10 cm</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="bg-red-500/8 border border-red-500/20 rounded-xl px-3 py-2.5">
                <p className="text-[9px] uppercase tracking-widest font-mono text-red-400/60 mb-0.5">6 kg → densité</p>
                <p className="text-base font-black font-mono text-red-400">≈ 94 kg/m³</p>
                <Tag type="warn">au-dessus de 80</Tag>
              </div>
              <div className="bg-secondary/8 border border-secondary/20 rounded-xl px-3 py-2.5">
                <p className="text-[9px] uppercase tracking-widest font-mono text-secondary/60 mb-0.5">5,1 kg → densité</p>
                <p className="text-base font-black font-mono text-secondary">= 80 kg/m³</p>
                <Tag type="ok">sweet spot</Tag>
              </div>
            </div>
          </div>

          {/* Dosage liant */}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-primary/20">
            <div className="bg-black/20 rounded-xl p-3 border border-secondary/20 flex flex-col gap-1">
              <p className="text-[8px] uppercase tracking-widest font-mono text-secondary/50 leading-tight">Résine PU fluide</p>
              <p className="text-lg font-black font-mono text-secondary">8–10 %</p>
              <p className="text-[9px] text-[#f0e6d3]/40 font-serif">480–600 g</p>
              <Tag type="ok">recommandé</Tag>
            </div>
            <div className="bg-black/20 rounded-xl p-3 border border-primary/25 flex flex-col gap-1">
              <p className="text-[8px] uppercase tracking-widest font-mono text-[#f0e6d3]/40 leading-tight">Colle D4 épaisse</p>
              <p className="text-lg font-black font-mono text-[#f0e6d3]/70">10–12 %</p>
              <p className="text-[9px] text-[#f0e6d3]/35 font-serif">600–720 g</p>
            </div>
            <div className="bg-black/20 rounded-xl p-3 border border-red-500/20 flex flex-col gap-1">
              <p className="text-[8px] uppercase tracking-widest font-mono text-red-400/50 leading-tight">Eau · MDI</p>
              <p className="text-lg font-black font-mono text-red-400">1–2 %</p>
              <p className="text-[9px] text-[#f0e6d3]/35 font-serif">60–120 g</p>
              <Tag type="warn">critique</Tag>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Étapes ── */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-5 rounded-full bg-secondary" />
          <h2 className="text-xs md:text-sm uppercase tracking-[0.2em] font-black text-[#f0e6d3]">
            Processus — 7 étapes
          </h2>
        </div>

        <div className="flex flex-col">
          <Step n={1} icon={Wind} titre="Aérer la mousse">
            Défibrer les flocons à la main pour éliminer tout paquet compacté.
            Objectif : masse légère et aérée avant tout ajout de liquide.
          </Step>

          <Step n={2} icon={Droplets} titre="Pulvériser l'eau — fine brume" color="#a8c47a">
            Humidifier légèrement les flocons au pulvérisateur.
            <div className="flex flex-col gap-1 mt-1">
              <p>Dose : <strong className="text-[#a8c47a]">1 – 2 % du poids mousse</strong> → 60 à 120 g pour 6 kg.</p>
              <div className="flex flex-wrap gap-1.5">
                <Tag type="warn">Trop d'eau → mousse fragile</Tag>
                <Tag type="warn">Pas assez → mauvaise polymérisation</Tag>
              </div>
            </div>
          </Step>

          <Step n={3} icon={FlaskConical} titre="Ajouter le liant D4 progressivement" color="#8b5a3c">
            Verser la colle en filet continu sur les flocons humidifiés en remuant.
            Dose cible : <strong className="text-[#8b5a3c]">10 – 12 % du poids mousse</strong> (600 – 720 g pour 6 kg).
          </Step>

          <Step n={4} icon={Timer} titre="Mélanger — 2 à 3 min max">
            Malaxer rapidement et de façon <strong className="text-secondary">très homogène</strong>.
            <Tag type="warn">Ne pas dépasser 3 min — la polymérisation commence dès le contact</Tag>
          </Step>

          <Step n={5} icon={Layers} titre="Remplissage en coffrage par couches" color="#a8c47a">
            Verser en <strong className="text-[#a8c47a]">2 à 3 couches</strong> avec léger tassage intermédiaire.
            Cette technique compense le ratio de compression élevé (×7) et évite les zones sèches au cœur.
          </Step>

          <Step n={6} icon={Maximize2} titre="Compression à 10 cm">
            Fermer et comprimer jusqu'à l'épaisseur cible.
            <div className="inline-flex items-center gap-2 mt-1 px-3 py-1.5 rounded-lg bg-secondary/10 border border-secondary/20">
              <span className="text-xs font-black font-mono text-secondary">70 → 10 cm</span>
              <span className="text-[9px] text-[#f0e6d3]/40">=</span>
              <span className="text-xs font-black font-mono text-secondary">×7 compression</span>
            </div>
          </Step>

          <Step n={7} icon={Clock} titre="Maintien sous pression" color="#a8c47a">
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="bg-black/25 border border-primary/25 rounded-xl px-3 py-2.5 text-center">
                <p className="text-[8px] uppercase tracking-widest font-mono text-[#f0e6d3]/35 mb-0.5">Minimum</p>
                <p className="text-lg font-black font-mono text-[#f0e6d3]/70">2 – 4 h</p>
              </div>
              <div className="bg-secondary/8 border border-secondary/25 rounded-xl px-3 py-2.5 text-center">
                <p className="text-[8px] uppercase tracking-widest font-mono text-secondary/50 mb-0.5">Idéal</p>
                <p className="text-lg font-black font-mono text-secondary">12 – 24 h</p>
              </div>
            </div>
          </Step>
        </div>
      </motion.section>

      {/* ── Réglage fin ── */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-5 rounded-full bg-primary" />
          <h2 className="text-xs md:text-sm uppercase tracking-[0.2em] font-black text-[#f0e6d3]">
            Réglage fin selon résultat
          </h2>
        </div>

        <div className="flex flex-col gap-2">
          {[
            { symptome: 'Bloc trop dur', action: 'Baisser le liant − 1 à − 2 %', type: 'tip' as const },
            { symptome: 'Bloc trop friable', action: 'Augmenter le liant + 1 à + 2 %', type: 'tip' as const },
            { symptome: 'Mauvaise cohésion interne', action: 'Revoir le malaxage — pas un problème de dosage', type: 'warn' as const },
          ].map(({ symptome, action, type }) => (
            <div key={symptome} className="glass-panel rounded-xl border border-primary/25 px-4 py-3.5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <div className="flex items-center gap-2 sm:w-48 flex-shrink-0">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#f0e6d3]/30 flex-shrink-0" />
                <span className="text-[10px] md:text-[11px] text-[#f0e6d3]/50 font-serif">{symptome}</span>
              </div>
              <span className="text-[10px] md:text-[11px] text-[#f0e6d3]/80 font-serif flex-1">{action}</span>
              <Tag type={type}>{type === 'warn' ? 'mélange' : 'dosage'}</Tag>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── Conclusion ── */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div
          className="rounded-2xl border border-secondary/25 p-5 md:p-7 grid sm:grid-cols-2 gap-5"
          style={{ background: 'linear-gradient(135deg, rgba(212,165,116,0.07) 0%, rgba(139,90,60,0.09) 100%)' }}
        >
          <div>
            <p className="text-[9px] uppercase tracking-[0.25em] font-mono text-secondary/50 mb-3">Masse mousse</p>
            <p className="text-[11px] md:text-sm font-serif text-[#f0e6d3]/70 leading-relaxed">
              → <strong className="text-secondary text-base md:text-lg font-black">5,1 kg</strong> pour 80 kg/m³ (objectif exact)<br />
              → <span className="text-[#f0e6d3]/50">6 kg</span> acceptable → ≈ 95 kg/m³ (mousse plus ferme)
            </p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.25em] font-mono text-secondary/50 mb-3">Liant idéal</p>
            <p className="text-[11px] md:text-sm font-serif text-[#f0e6d3]/70 leading-relaxed">
              → <strong className="text-secondary text-base md:text-lg font-black">~500 g</strong> résine PU fluide<br />
              → Résine fluide préférée à la D4 épaisse pour l'homogénéité du mélange.
            </p>
          </div>
        </div>
      </motion.section>

    </div>
  );
}
