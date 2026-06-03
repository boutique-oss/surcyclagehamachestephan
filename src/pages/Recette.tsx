import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, AlertTriangle, CheckCircle, Info } from 'lucide-react';

/* ── Barre de progression horizontale ── */
function Bar({ pct, color, label, value }: { pct: number; color: string; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] md:text-[11px] uppercase tracking-widest font-bold" style={{ color }}>{label}</span>
        <span className="text-sm md:text-base font-bold font-mono" style={{ color }}>{value}</span>
      </div>
      <div className="h-2 md:h-2.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

/* ── Chip d'alerte inline ── */
function Chip({ type, children }: { type: 'warn' | 'ok' | 'info'; children: ReactNode }) {
  const styles = {
    warn: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)', color: '#f87171', Icon: AlertTriangle },
    ok:   { bg: 'rgba(212,165,116,0.08)', border: 'rgba(212,165,116,0.25)', color: '#d4a574', Icon: CheckCircle },
    info: { bg: 'rgba(45,80,22,0.18)', border: 'rgba(45,80,22,0.4)', color: '#a8c47a', Icon: Info },
  }[type];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] md:text-[10px] font-semibold leading-tight"
      style={{ background: styles.bg, border: `1px solid ${styles.border}`, color: styles.color }}
    >
      <styles.Icon className="w-2.5 h-2.5 flex-shrink-0" />
      {children}
    </span>
  );
}

/* ── Une étape numérotée ── */
function Etape({ n, titre, children }: { n: number; titre: string; children: ReactNode }) {
  return (
    <div className="flex gap-4 items-start">
      <div
        className="flex-shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-xs md:text-sm font-bold font-mono text-background mt-0.5"
        style={{ background: 'linear-gradient(135deg, #d4a574 0%, #8b5a3c 100%)', boxShadow: '0 0 14px rgba(212,165,116,0.3)' }}
      >
        {n}
      </div>
      <div className="flex-1 pt-1">
        <p className="text-[11px] md:text-sm font-bold uppercase tracking-wide text-secondary mb-1">{titre}</p>
        <div className="text-[10px] md:text-[11px] text-[#f0e6d3]/75 font-serif leading-relaxed flex flex-col gap-1.5">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Recette() {
  return (
    <div className="flex-1 w-full max-w-3xl mx-auto flex flex-col gap-8 md:gap-12 pb-10 md:pb-16 pt-2 md:pt-4">

      {/* ── En-tête ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="border-b border-primary pb-5 md:pb-7">
        <p className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-secondary/60 font-mono mb-1">01. Recette</p>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-wide text-[#f0e6d3] leading-tight mb-1">
          Fabrication du bloc de mousse recyclée
        </h1>
        <p className="text-[11px] md:text-sm text-[#f0e6d3]/50 font-serif">
          Fauteuil Réception · Rembourrage par compression de flocons
        </p>
      </motion.div>

      {/* ── Fiche technique D4 ── */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-[10px] md:text-xs uppercase tracking-[0.25em] font-bold text-secondary border-l-4 border-l-secondary pl-3">
            Fiche technique — Colle à bois D4
          </h2>
          <a
            href="https://www.hout-info.be/fr/colles-adhesifs/colle-a-bois-d4"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-secondary/50 hover:text-secondary transition-colors border border-secondary/20 hover:border-secondary/50 px-2 py-0.5 rounded"
          >
            <ExternalLink className="w-2.5 h-2.5" />
            Source
          </a>
        </div>

        <div className="glass-panel rounded-xl border border-primary/30 p-5 md:p-6 grid sm:grid-cols-2 gap-5 md:gap-6">

          {/* Col 1 */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-secondary/60 mb-1.5 font-mono">Base &amp; aspect</p>
              <p className="text-[10px] md:text-[11px] text-[#f0e6d3]/75 font-serif leading-relaxed">
                Résine polyvinylique (PVA) — liquide homogène, incolore après séchage complet.
              </p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-widest text-secondary/60 mb-1.5 font-mono">Certification</p>
              <p className="text-[10px] md:text-[11px] text-[#f0e6d3]/75 font-serif leading-relaxed">
                Classe <strong className="text-secondary">D4</strong> selon norme NF EN 204 — résistance maximale à l'humidité pour colles thermoplastiques à usage non structurel.
              </p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-widest text-secondary/60 mb-1.5 font-mono">Performance clé</p>
              <p className="text-[10px] md:text-[11px] text-[#f0e6d3]/75 font-serif leading-relaxed">
                Adhérence supérieure à la cohésion du bois lui-même — rupture dans le bois, pas dans le joint.
              </p>
            </div>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-secondary/60 mb-1.5 font-mono">Rendement par outil</p>
              <div className="flex flex-col gap-1">
                {[
                  ['Brosse', '6 – 7 m² / l'],
                  ['Applicateur', '7 – 8 m² / l'],
                  ['Spatule', '8 – 9 m² / l'],
                ].map(([outil, rdt]) => (
                  <div key={outil} className="flex items-center justify-between text-[10px] py-1 border-b border-primary/20 last:border-0">
                    <span className="text-[#f0e6d3]/55 font-serif">{outil}</span>
                    <span className="font-mono font-bold text-secondary text-[10px]">{rdt}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-widest text-secondary/60 mb-1.5 font-mono">Points d'attention</p>
              <ul className="flex flex-col gap-1 text-[10px] md:text-[11px] text-[#f0e6d3]/65 font-serif leading-snug">
                <li>— Bois sec (&lt; 20 % humidité) et dégraissé.</li>
                <li>— Agiter avant emploi.</li>
                <li>— Couche homogène, sans surépaisseur.</li>
                <li>— Éliminer les débordements à l'eau avant séchage.</li>
                <li>— En extérieur : recouvrir d'une peinture ou laque.</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Graphique composition ── */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
        <h2 className="text-[10px] md:text-xs uppercase tracking-[0.25em] font-bold text-secondary border-l-4 border-l-accent pl-3 mb-5">
          Composition du mélange — pour 6 kg de mousse
        </h2>

        <div className="glass-panel rounded-xl border border-primary/30 p-5 md:p-6 flex flex-col gap-6">

          {/* Barres */}
          <div className="flex flex-col gap-4">
            <Bar pct={88}  color="#d4a574" label="Mousse (flocons HR recyclés)" value="~5,1 – 6 kg" />
            <Bar pct={11}  color="#8b5a3c" label="Colle D4 (liant PU)"          value="600 – 720 g" />
            <Bar pct={1.5} color="#a8c47a" label="Eau (humidification MDI)"      value="60 – 120 g" />
          </div>

          {/* Carte densité */}
          <div className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-primary/20">
            <div className="bg-[#121a0d]/60 border border-primary/40 rounded-lg px-4 py-3 flex flex-col gap-1">
              <p className="text-[9px] uppercase tracking-widest text-secondary/60 font-mono">Objectif densité</p>
              <p className="text-2xl md:text-3xl font-bold font-mono text-secondary">80 <span className="text-sm font-normal">kg/m³</span></p>
              <p className="text-[9px] text-[#f0e6d3]/40 font-serif">Volume coffrage : 80×80×10 cm = 0,064 m³</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="bg-[#121a0d]/40 border border-secondary/20 rounded-lg px-4 py-2.5">
                <p className="text-[9px] uppercase tracking-widest text-secondary/50 font-mono mb-0.5">6 kg → densité réelle</p>
                <p className="text-base font-bold font-mono text-secondary">≈ 94 kg/m³ <Chip type="warn">au-dessus</Chip></p>
              </div>
              <div className="bg-[#121a0d]/40 border border-primary/30 rounded-lg px-4 py-2.5">
                <p className="text-[9px] uppercase tracking-widest text-secondary/50 font-mono mb-0.5">Pour 80 kg/m³ exact</p>
                <p className="text-base font-bold font-mono text-[#a8c47a]">→ 5,1 kg de mousse <Chip type="ok">sweet spot</Chip></p>
              </div>
            </div>
          </div>

          {/* Dosage liant */}
          <div className="grid sm:grid-cols-3 gap-3 pt-2 border-t border-primary/20">
            {[
              { label: 'Résine PU fluide', pct: '8 – 10 %', qty: '480 – 600 g', badge: 'recommandé' as const },
              { label: 'Colle D4 (épaisse)', pct: '10 – 12 %', qty: '600 – 720 g', badge: null },
              { label: 'Eau (brume MDI)', pct: '1 – 2 %', qty: '60 – 120 g', badge: 'critique' as const },
            ].map(({ label, pct, qty, badge }) => (
              <div key={label} className="bg-[#121a0d]/40 border border-primary/30 rounded-lg px-3 py-3 flex flex-col gap-1">
                <p className="text-[9px] uppercase tracking-widest text-secondary/50 font-mono leading-tight">{label}</p>
                <p className="text-lg font-bold font-mono text-secondary">{pct}</p>
                <p className="text-[10px] text-[#f0e6d3]/50 font-serif">{qty}</p>
                {badge === 'recommandé' && <Chip type="ok">recommandé</Chip>}
                {badge === 'critique' && <Chip type="warn">critique</Chip>}
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── Étapes ── */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-[10px] md:text-xs uppercase tracking-[0.25em] font-bold text-secondary border-l-4 border-l-secondary pl-3 mb-6">
          Processus — étapes
        </h2>

        <div className="flex flex-col gap-5 md:gap-6">

          <Etape n={1} titre="Aérer la mousse">
            Défibrer les flocons à la main pour éviter les paquets compactés.
            Objectif : masse légère et homogène avant tout ajout de liquide.
          </Etape>

          <Etape n={2} titre="Pulvériser l'eau (fine brume)">
            Humidifier légèrement les flocons au pulvérisateur — <strong className="text-secondary">1 à 2 % du poids mousse</strong> soit 60 à 120 g pour 6 kg.
            <span className="flex flex-wrap gap-1.5 mt-1">
              <Chip type="warn">Trop d'eau → mousse fragile</Chip>
              <Chip type="warn">Pas assez → mauvaise polymérisation</Chip>
            </span>
          </Etape>

          <Etape n={3} titre="Ajouter le liant D4 progressivement">
            Verser la colle D4 en filet sur les flocons humidifiés en remuant en continu.
            Dose cible : <strong className="text-secondary">10 à 12 % du poids mousse</strong> (600 – 720 g pour 6 kg).
          </Etape>

          <Etape n={4} titre="Mélanger — 2 à 3 min max">
            Malaxer rapidement et de façon homogène. <strong className="text-secondary">Ne pas dépasser 3 minutes</strong> : la polymérisation commence dès le contact liant / eau.
            <Chip type="warn">Mélange hétérogène → zones sèches au cœur du bloc</Chip>
          </Etape>

          <Etape n={5} titre="Remplissage en coffrage — couches successives">
            Verser en 2 à 3 couches avec un léger tassage intermédiaire entre chaque.
            Cette technique évite les zones sèches liées au ratio de compression élevé (×7).
          </Etape>

          <Etape n={6} titre="Compression à 10 cm">
            Fermer le coffrage et comprimer jusqu'à l'épaisseur cible de 10 cm.
            <span className="inline-flex items-center gap-2 mt-1">
              <span className="font-mono text-[10px] text-secondary bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20">
                70 → 10 cm = ×7 compression
              </span>
            </span>
          </Etape>

          <Etape n={7} titre="Maintien sous pression">
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="bg-[#121a0d]/50 border border-primary/30 rounded-lg px-3 py-2 text-center">
                <p className="text-[9px] uppercase tracking-widest text-secondary/50 font-mono mb-0.5">Minimum</p>
                <p className="text-sm font-bold font-mono text-secondary">2 – 4 h</p>
              </div>
              <div className="bg-[#121a0d]/50 border border-secondary/30 rounded-lg px-3 py-2 text-center">
                <p className="text-[9px] uppercase tracking-widest text-secondary/50 font-mono mb-0.5">Idéal</p>
                <p className="text-sm font-bold font-mono text-secondary">12 – 24 h</p>
              </div>
            </div>
          </Etape>

        </div>
      </motion.section>

      {/* ── Réglage fin ── */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
        <h2 className="text-[10px] md:text-xs uppercase tracking-[0.25em] font-bold text-secondary border-l-4 border-l-primary pl-3 mb-4">
          Réglage fin selon résultat
        </h2>
        <div className="glass-panel rounded-xl border border-primary/30 p-5 flex flex-col gap-2.5">
          {[
            { symptome: 'Bloc trop dur', action: 'Baisser le liant de −1 à −2 %', type: 'info' as const },
            { symptome: 'Bloc trop friable', action: 'Augmenter le liant de +1 à +2 %', type: 'info' as const },
            { symptome: 'Mauvaise cohésion interne', action: 'Problème de mélange — revoir le malaxage (pas un problème de dosage)', type: 'warn' as const },
          ].map(({ symptome, action, type }) => (
            <div key={symptome} className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 py-2 border-b border-primary/15 last:border-0">
              <span className="text-[10px] md:text-[11px] text-[#f0e6d3]/55 font-serif flex-shrink-0 sm:w-44">{symptome}</span>
              <span className="text-[10px] md:text-[11px] text-[#f0e6d3]/80 font-serif flex-1">{action}</span>
              <Chip type={type}>{type === 'warn' ? 'attention' : 'dosage'}</Chip>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── Conclusion ── */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}>
        <div
          className="rounded-xl border border-secondary/30 p-5 md:p-6 flex flex-col gap-3"
          style={{ background: 'linear-gradient(135deg, rgba(212,165,116,0.06) 0%, rgba(139,90,60,0.08) 100%)' }}
        >
          <h3 className="text-[10px] md:text-xs uppercase tracking-[0.25em] font-bold text-secondary">Conclusion</h3>
          <div className="grid sm:grid-cols-2 gap-3 text-[10px] md:text-[11px] font-serif text-[#f0e6d3]/75 leading-relaxed">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-secondary/50 font-mono mb-1">Masse mousse</p>
              <p>→ <strong className="text-secondary">5,1 kg</strong> pour 80 kg/m³ (objectif exact)</p>
              <p>→ <strong className="text-[#f0e6d3]/60">6 kg</strong> accepté pour une mousse plus ferme ≈ 95 kg/m³</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-widest text-secondary/50 font-mono mb-1">Liant idéal</p>
              <p>→ <strong className="text-secondary">~500 g résine fluide</strong> (sweet spot)</p>
              <p>→ Résine PU fluide préférée à la D4 épaisse pour l'homogénéité.</p>
            </div>
          </div>
        </div>
      </motion.section>

    </div>
  );
}
