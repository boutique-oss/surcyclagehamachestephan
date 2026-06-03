import type { ReactNode, ElementType } from 'react';
import { motion } from 'motion/react';
import {
  ExternalLink, Wind, Droplets, FlaskConical,
  Timer, Layers, Maximize2, Clock, SlidersHorizontal,
  AlertTriangle, CheckCircle, Info, ShieldAlert,
  Eye, Flame, Skull,
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
      {sub && <p className="text-[9px] text-[#f0e6d3]/35 font-sans mt-0.5">{sub}</p>}
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
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}40` }}
        >
          <Icon className="w-4 h-4 md:w-4.5 md:h-4.5" style={{ color }} />
        </div>
        {n < 8 && <div className="w-px flex-1 mt-2" style={{ background: `${color}20` }} />}
      </div>

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
        <div className="text-[10px] md:text-[11px] text-[#f0e6d3]/65 font-sans leading-relaxed flex flex-col gap-2">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

/* Pictogramme de danger */
function HazardPicto({ icon: Icon, label, color, bg }: {
  icon: ElementType; label: string; color: string; bg: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center border-2"
        style={{ background: bg, borderColor: color }}
      >
        <Icon className="w-7 h-7 md:w-8 md:h-8" style={{ color }} />
      </div>
      <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-center leading-tight"
        style={{ color }}>{label}</p>
    </div>
  );
}

/* Carte EPI */
function EpiCard({ icon: Icon, label, detail, color = '#f0e6d3' }: {
  icon: ElementType; label: string; detail: string; color?: string;
}) {
  return (
    <div className="flex items-start gap-3 bg-black/25 border border-white/8 rounded-xl p-3">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-[#f0e6d3]/90">{label}</p>
        <p className="text-[9px] text-[#f0e6d3]/45 font-sans leading-snug mt-0.5">{detail}</p>
      </div>
    </div>
  );
}

/* ────────────────────────────────── page ── */

/*
 * Calcul de référence — base 5,1 kg de mousse
 * ─────────────────────────────────────────────
 * Mousse HR recyclée   5 100 g   (100 % base)
 * Colle D4            +  561 g   (11 % masse mousse)
 * Acétone             +  510 g   (10 % masse mousse — diluant, s'évapore)
 * Eau / MDI           +   76,5 g (1,5 % masse mousse)
 * ─────────────────────────────────────────────
 * Total mélange humide  6 247,5 g
 * Masse bloc sec (ac. évaporé) ≈ 5 737,5 g
 * Volume coffrage       0,064 m³  (80 × 80 × 10 cm)
 * Densité bloc sec      ≈ 89,6 kg/m³ ← acceptable, proche 80-90 cible
 * ─────────────────────────────────────────────
 * % du total mélange humide :
 *   Mousse   81,6 %
 *   D4        9,0 %
 *   Acétone   8,2 %
 *   Eau       1,2 %
 */

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
        <p className="text-xs md:text-sm text-[#f0e6d3]/50 font-sans max-w-md">
          Fabrication par compression de flocons HR — colle D4, acétone (diluant),
          coffrage bois, maintien sous pression. Fauteuil Réception · Atelier Hamache.
        </p>
      </motion.header>

      {/* ══════════════════════════════════════════════════
          ── SÉCURITÉ — à lire avant toute manipulation ──
          ══════════════════════════════════════════════════ */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}>
        <div className="rounded-2xl border-2 border-red-500/40 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(220,38,38,0.05) 100%)' }}>

          {/* Bandeau titre sécurité */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-red-500/25"
            style={{ background: 'rgba(239,68,68,0.12)' }}>
            <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-red-300">
              Sécurité — À lire avant toute manipulation
            </p>
            <span className="ml-auto text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400">
              3 produits à risque
            </span>
          </div>

          <div className="p-5 md:p-6 flex flex-col gap-6">

            {/* Pictogrammes danger */}
            <div>
              <p className="text-[9px] uppercase tracking-[0.25em] font-mono text-red-400/60 mb-4">Dangers identifiés</p>
              <div className="grid grid-cols-3 gap-4 md:gap-6">

                {/* MDI */}
                <div className="flex flex-col gap-3">
                  <HazardPicto icon={Skull} label="MDI · Toxique" color="#f87171" bg="rgba(239,68,68,0.10)" />
                  <div className="bg-black/30 rounded-xl p-3 border border-red-500/20 flex flex-col gap-1.5">
                    <p className="text-[9px] font-black text-red-300 uppercase tracking-widest">Isocyanate (MDI)</p>
                    <p className="text-[8px] md:text-[9px] text-[#f0e6d3]/55 font-sans leading-snug">
                      <strong className="text-[#f0e6d3]/75">Isocyanate de méthylène diphényle</strong> —
                      agent durcisseur/réticulant présent dans les formulations PU.
                      Sensibilisant respiratoire puissant. Exposition répétée = risque d'asthme professionnel.
                    </p>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      <Tag type="warn">Sensibilisant resp.</Tag>
                      <Tag type="warn">Irritant yeux/peau</Tag>
                    </div>
                  </div>
                </div>

                {/* Acétone */}
                <div className="flex flex-col gap-3">
                  <HazardPicto icon={Flame} label="Acétone · Inflammable" color="#fb923c" bg="rgba(251,146,60,0.10)" />
                  <div className="bg-black/30 rounded-xl p-3 border border-orange-500/20 flex flex-col gap-1.5">
                    <p className="text-[9px] font-black text-orange-300 uppercase tracking-widest">Acétone — C₃H₆O</p>
                    <p className="text-[8px] md:text-[9px] text-[#f0e6d3]/55 font-sans leading-snug">
                      Diluant volatil pour la colle D4. Point d'éclair −18 °C.
                      Vapeurs lourdes, s'accumulent en zone basse. Narcotique à forte concentration.
                    </p>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      <Tag type="warn">Hautement inflammable</Tag>
                      <Tag type="warn">Narcotique</Tag>
                    </div>
                  </div>
                </div>

                {/* D4 */}
                <div className="flex flex-col gap-3">
                  <HazardPicto icon={AlertTriangle} label="D4 · Irritant" color="#facc15" bg="rgba(250,204,21,0.08)" />
                  <div className="bg-black/30 rounded-xl p-3 border border-yellow-500/20 flex flex-col gap-1.5">
                    <p className="text-[9px] font-black text-yellow-300 uppercase tracking-widest">Colle D4 — PVA</p>
                    <p className="text-[8px] md:text-[9px] text-[#f0e6d3]/55 font-sans leading-snug">
                      Résine polyvinylique. Faible risque à l'état frais.
                      Éviter le contact prolongé cutané. Rincer à l'eau avant séchage.
                    </p>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      <Tag type="tip">Irritant cutané</Tag>
                      <Tag type="ok">Rinçage eau</Tag>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ventilation obligatoire — barre visuelle */}
            <div className="rounded-xl border border-red-500/30 bg-red-500/8 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Wind className="w-4 h-4 text-red-400" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-300">Ventilation obligatoire</p>
              </div>
              <div className="flex flex-col gap-1.5">
                {[
                  'Travailler en atelier ouvert ou avec extraction d\'air forcée',
                  'Vapeurs d\'acétone et de MDI invisibles — ne pas se fier à l\'absence d\'odeur',
                  'Aucun point d\'ignition (étincelle, flamme nue) pendant le mélange',
                  'Ne jamais stocker l\'acétone à proximité d\'une source de chaleur',
                ].map((r) => (
                  <div key={r} className="flex items-start gap-2">
                    <span className="text-red-400 text-xs flex-shrink-0 mt-px">›</span>
                    <p className="text-[9px] md:text-[10px] text-red-200/70 font-sans leading-snug">{r}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* EPI requis */}
            <div>
              <p className="text-[9px] uppercase tracking-[0.25em] font-mono text-[#f0e6d3]/40 mb-3">EPI requis</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <EpiCard
                  icon={Wind}
                  label="Masque demi-facial"
                  detail="Filtre combiné A2P3 — vapeurs organiques + particules. Obligatoire dès l'ouverture de l'acétone."
                  color="#f87171"
                />
                <EpiCard
                  icon={Eye}
                  label="Lunettes de protection"
                  detail="Lunettes étanches anti-projection. Pas de simples lunettes de vue."
                  color="#fb923c"
                />
                <EpiCard
                  icon={ShieldAlert}
                  label="Gants nitrile"
                  detail="Épaisseur ≥ 0,3 mm. Résistants aux solvants. Changer si coupure ou perforation."
                  color="#a8c47a"
                />
              </div>
            </div>

            {/* Définition MDI encadrée */}
            <div className="rounded-xl border border-primary/30 bg-black/20 p-4">
              <p className="text-[9px] uppercase tracking-[0.25em] font-mono text-secondary/50 mb-2">Définition · MDI</p>
              <p className="text-[10px] md:text-[11px] text-[#f0e6d3]/75 font-sans leading-relaxed">
                <strong className="text-secondary">Isocyanate de méthylène diphényle (MDI)</strong> — CH₂(C₆H₄NCO)₂ —
                est un diisocyanate aromatique utilisé comme agent réticulant dans les mousses polyuréthane et certains liants.
                C'est la présence résiduelle de groupements isocyanate (—NCO) dans les formulations PU qui rend
                l'humidification des flocons nécessaire : l'eau amorce la réaction de polymérisation des chaînes uréthane.
                Le MDI pur a un point d'ébullition élevé (~314 °C) mais ses vapeurs à température ambiante
                sont déjà irritantes à des concentrations de quelques ppb.
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <Tag type="warn">VME : 0,02 ppm</Tag>
                <Tag type="warn">Sensibilisant classe 1</Tag>
                <Tag type="tip">CAS 101-68-8</Tag>
              </div>
            </div>

          </div>
        </div>
      </motion.section>

      {/* ── KPIs ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
        className="grid grid-cols-2 sm:grid-cols-5 gap-3"
      >
        <KPI label="Mousse cible" value="5,1" unit="kg" sub="pour ~90 kg/m³" />
        <KPI label="Liant D4" value="11" unit="%" sub="560 g" color="#8b5a3c" />
        <KPI label="Acétone" value="10" unit="%" sub="510 g — volatile" color="#fb923c" />
        <KPI label="Eau MDI" value="1–2" unit="%" sub="51–102 g" color="#a8c47a" />
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
          <div className="glass-panel rounded-xl border border-primary/30 p-4 flex flex-col gap-3 sm:col-span-1">
            <p className="text-[9px] uppercase tracking-widest text-secondary/50 font-mono">Base &amp; certification</p>
            <p className="text-[10px] md:text-[11px] text-[#f0e6d3]/70 font-sans leading-relaxed">
              Résine <strong className="text-[#f0e6d3]/90">polyvinylique (PVA)</strong> — incolore après séchage.
            </p>
            <div className="mt-auto">
              <span className="text-[9px] font-mono font-bold px-2 py-1 rounded bg-secondary/15 text-secondary border border-secondary/20">
                NF EN 204 · Classe D4
              </span>
            </div>
          </div>

          <div className="glass-panel rounded-xl border border-primary/30 p-4 flex flex-col gap-2">
            <p className="text-[9px] uppercase tracking-widest text-secondary/50 font-mono mb-1">Rendement</p>
            {[
              ['Brosse', '6 – 7 m²/l'],
              ['Applicateur', '7 – 8 m²/l'],
              ['Spatule', '8 – 9 m²/l'],
            ].map(([outil, rdt]) => (
              <div key={outil} className="flex justify-between items-center py-1.5 border-b border-primary/15 last:border-0">
                <span className="text-[10px] text-[#f0e6d3]/50 font-sans">{outil}</span>
                <span className="text-[10px] font-black font-mono text-secondary">{rdt}</span>
              </div>
            ))}
          </div>

          <div className="glass-panel rounded-xl border border-primary/30 p-4 flex flex-col gap-2">
            <p className="text-[9px] uppercase tracking-widest text-secondary/50 font-mono mb-1">Recommandations</p>
            {[
              'Diluer avec acétone max 10 % pour fluidifier',
              'Surface propre, dégraissée',
              'Agiter avant emploi',
              'Couche homogène, sans surépaisseur',
              'Rincer les débordements à l\'eau',
            ].map((r) => (
              <div key={r} className="flex items-start gap-1.5">
                <span className="text-secondary mt-0.5 text-[9px] flex-shrink-0">—</span>
                <p className="text-[9px] md:text-[10px] text-[#f0e6d3]/60 font-sans leading-snug">{r}</p>
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
            Composition &amp; dosages — base 5,1 kg mousse
          </h2>
        </div>

        <div className="glass-panel rounded-xl border border-primary/30 p-5 md:p-6 flex flex-col gap-6">

          {/* Note de calcul */}
          <div className="flex items-start gap-2 bg-primary/10 border border-primary/25 rounded-xl px-3 py-2.5">
            <Info className="w-3.5 h-3.5 text-[#a8c47a] flex-shrink-0 mt-0.5" />
            <p className="text-[9px] text-[#f0e6d3]/55 font-sans leading-snug">
              Pourcentages exprimés sur le <strong className="text-[#f0e6d3]/80">total du mélange humide</strong> (6 247,5 g).
              L'acétone s'évapore au séchage — la masse sèche du bloc est ≈ 5 737 g → densité ≈ 89,6 kg/m³.
            </p>
          </div>

          {/* Barres */}
          <div className="flex flex-col gap-5">
            {/*
              % mélange humide (base 5 100 + 561 + 510 + 76,5 = 6 247,5 g) :
              Mousse  5100 / 6247,5 = 81,6 % → 82
              D4       561 / 6247,5 =  8,98 % →  9
              Acétone  510 / 6247,5 =  8,16 % →  8
              Eau       76,5/ 6247,5 =  1,22 % →  1
            */}
            <StatBar pct={82} color="#d4a574" label="Mousse (flocons HR recyclés)"      value="5 100 g"  delay={0.2} />
            <StatBar pct={9}  color="#8b5a3c" label="Colle D4 · liant PVA (11 % mousse)" value="561 g"   delay={0.35} />
            <StatBar pct={8}  color="#fb923c" label="Acétone · diluant (10 % mousse)"    value="510 g"   delay={0.5} />
            <StatBar pct={1}  color="#a8c47a" label="Eau · activation MDI (1,5 % mousse)" value="76,5 g" delay={0.65} />
          </div>

          {/* Total + densité */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-primary/20">
            <div className="bg-black/20 rounded-xl p-4 flex flex-col gap-1 border border-primary/20">
              <p className="text-[9px] uppercase tracking-widest font-mono text-[#f0e6d3]/35">Volume coffrage</p>
              <p className="text-lg md:text-xl font-black font-mono text-[#f0e6d3]">0,064 m³</p>
              <p className="text-[9px] text-[#f0e6d3]/35 font-sans">80 × 80 × 10 cm</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="bg-red-500/8 border border-red-500/20 rounded-xl px-3 py-2.5">
                <p className="text-[9px] uppercase tracking-widest font-mono text-red-400/60 mb-0.5">Mélange humide</p>
                <p className="text-base font-black font-mono text-red-400">6 247,5 g</p>
                <Tag type="warn">acétone incluse</Tag>
              </div>
              <div className="bg-secondary/8 border border-secondary/20 rounded-xl px-3 py-2.5">
                <p className="text-[9px] uppercase tracking-widest font-mono text-secondary/60 mb-0.5">Densité bloc sec</p>
                <p className="text-base font-black font-mono text-secondary">≈ 89,6 kg/m³</p>
                <Tag type="ok">dans cible 80–90</Tag>
              </div>
            </div>
          </div>

          {/* Dosage détaillé par produit */}
          <div className="grid grid-cols-4 gap-2.5 pt-2 border-t border-primary/20">
            <div className="bg-black/20 rounded-xl p-3 border border-[#d4a574]/20 flex flex-col gap-1">
              <p className="text-[8px] uppercase tracking-widest font-mono text-[#d4a574]/50 leading-tight">Mousse HR</p>
              <p className="text-base font-black font-mono text-[#d4a574]">5 100 g</p>
              <p className="text-[9px] text-[#f0e6d3]/40 font-sans">100 % base</p>
            </div>
            <div className="bg-black/20 rounded-xl p-3 border border-secondary/20 flex flex-col gap-1">
              <p className="text-[8px] uppercase tracking-widest font-mono text-secondary/50 leading-tight">Colle D4</p>
              <p className="text-base font-black font-mono text-secondary">561 g</p>
              <p className="text-[9px] text-[#f0e6d3]/40 font-sans">11 %</p>
              <Tag type="ok">liant</Tag>
            </div>
            <div className="bg-black/20 rounded-xl p-3 border border-orange-500/20 flex flex-col gap-1">
              <p className="text-[8px] uppercase tracking-widest font-mono text-orange-400/50 leading-tight">Acétone</p>
              <p className="text-base font-black font-mono text-orange-400">510 g</p>
              <p className="text-[9px] text-[#f0e6d3]/40 font-sans">10 %</p>
              <Tag type="warn">volatile</Tag>
            </div>
            <div className="bg-black/20 rounded-xl p-3 border border-red-500/20 flex flex-col gap-1">
              <p className="text-[8px] uppercase tracking-widest font-mono text-red-400/50 leading-tight">Eau · MDI</p>
              <p className="text-base font-black font-mono text-red-400">76,5 g</p>
              <p className="text-[9px] text-[#f0e6d3]/40 font-sans">1,5 %</p>
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
            Processus — 8 étapes
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
              <p>Dose : <strong className="text-[#a8c47a]">1,5 % du poids mousse</strong> → <strong className="text-[#a8c47a]">76,5 g</strong> pour 5,1 kg.</p>
              <p className="text-[#f0e6d3]/40">Fourchette : 51 g (1 %) à 102 g (2 %)</p>
              <div className="flex flex-wrap gap-1.5">
                <Tag type="warn">Trop d'eau → mousse fragile</Tag>
                <Tag type="warn">Pas assez → mauvaise polymérisation MDI</Tag>
              </div>
            </div>
          </Step>

          <Step n={3} icon={FlaskConical} titre="Préparer le mélange D4 + acétone" color="#fb923c">
            <p>Dans un récipient séparé, mélanger la colle D4 avec l'acétone <strong className="text-orange-400">avant</strong> de verser sur la mousse.</p>
            <div className="flex flex-col gap-1 mt-1">
              <p>Colle D4 : <strong className="text-[#8b5a3c]">561 g</strong> (11 % de 5 100 g)</p>
              <p>Acétone : <strong className="text-orange-400">510 g</strong> (10 % de 5 100 g) — fluidifie la colle pour une meilleure pénétration</p>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1">
              <Tag type="warn">Hors de toute flamme</Tag>
              <Tag type="warn">Masque A2P3 obligatoire</Tag>
            </div>
          </Step>

          <Step n={4} icon={FlaskConical} titre="Verser le liant D4+acétone progressivement" color="#8b5a3c">
            Verser le mélange en filet continu sur les flocons humidifiés en remuant.
            L'acétone abaisse la viscosité pour enrober chaque flocon uniformément.
            <Tag type="warn">Ne pas inhaler les vapeurs — ventilateur extracteur requis</Tag>
          </Step>

          <Step n={5} icon={Timer} titre="Mélanger — 2 à 3 min max">
            Malaxer rapidement et de façon <strong className="text-secondary">très homogène</strong>.
            <Tag type="warn">Ne pas dépasser 3 min — la polymérisation commence dès le contact eau/MDI</Tag>
          </Step>

          <Step n={6} icon={Layers} titre="Remplissage en coffrage par couches" color="#a8c47a">
            Verser en <strong className="text-[#a8c47a]">2 à 3 couches</strong> avec léger tassage intermédiaire.
            Cette technique compense le ratio de compression élevé (×7) et évite les zones sèches au cœur.
          </Step>

          <Step n={7} icon={Maximize2} titre="Compression à 10 cm">
            Fermer et comprimer jusqu'à l'épaisseur cible.
            <div className="inline-flex items-center gap-2 mt-1 px-3 py-1.5 rounded-lg bg-secondary/10 border border-secondary/20">
              <span className="text-xs font-black font-mono text-secondary">70 → 10 cm</span>
              <span className="text-[9px] text-[#f0e6d3]/40">=</span>
              <span className="text-xs font-black font-mono text-secondary">×7 compression</span>
            </div>
          </Step>

          <Step n={8} icon={Clock} titre="Maintien sous pression" color="#a8c47a">
            Laisser l'acétone s'évaporer et le liant polymériser sous pression.
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="bg-black/25 border border-primary/25 rounded-xl px-3 py-2.5 text-center">
                <p className="text-[8px] uppercase tracking-widest font-mono text-[#f0e6d3]/35 mb-0.5">Minimum</p>
                <p className="text-lg font-black font-mono text-[#f0e6d3]/70">4 – 6 h</p>
                <p className="text-[8px] text-[#f0e6d3]/30 font-sans">acétone évaporée</p>
              </div>
              <div className="bg-secondary/8 border border-secondary/25 rounded-xl px-3 py-2.5 text-center">
                <p className="text-[8px] uppercase tracking-widest font-mono text-secondary/50 mb-0.5">Idéal</p>
                <p className="text-lg font-black font-mono text-secondary">12 – 24 h</p>
                <p className="text-[8px] text-secondary/40 font-sans">polymérisation complète</p>
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
            { symptome: 'Bloc trop dur', action: 'Baisser le liant − 1 à − 2 % (→ 480–510 g)', type: 'tip' as const },
            { symptome: 'Bloc trop friable', action: 'Augmenter le liant + 1 à + 2 % (→ 612–663 g)', type: 'tip' as const },
            { symptome: 'Colle trop épaisse', action: 'Augmenter l\'acétone jusqu\'à 12 % (→ 612 g)', type: 'tip' as const },
            { symptome: 'Mauvaise cohésion interne', action: 'Revoir le malaxage — pas un problème de dosage', type: 'warn' as const },
          ].map(({ symptome, action, type }) => (
            <div key={symptome} className="glass-panel rounded-xl border border-primary/25 px-4 py-3.5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <div className="flex items-center gap-2 sm:w-48 flex-shrink-0">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#f0e6d3]/30 flex-shrink-0" />
                <span className="text-[10px] md:text-[11px] text-[#f0e6d3]/50 font-sans">{symptome}</span>
              </div>
              <span className="text-[10px] md:text-[11px] text-[#f0e6d3]/80 font-sans flex-1">{action}</span>
              <Tag type={type}>{type === 'warn' ? 'mélange' : 'dosage'}</Tag>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── Conclusion ── */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div
          className="rounded-2xl border border-secondary/25 p-5 md:p-7 grid sm:grid-cols-3 gap-5"
          style={{ background: 'linear-gradient(135deg, rgba(212,165,116,0.07) 0%, rgba(139,90,60,0.09) 100%)' }}
        >
          <div>
            <p className="text-[9px] uppercase tracking-[0.25em] font-mono text-secondary/50 mb-3">Masse mousse</p>
            <p className="text-[11px] md:text-sm font-sans text-[#f0e6d3]/70 leading-relaxed">
              → <strong className="text-secondary text-base md:text-lg font-black">5 100 g</strong><br />
              → Densité bloc sec ≈ <span className="text-secondary font-black">89,6 kg/m³</span>
            </p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.25em] font-mono text-secondary/50 mb-3">Liant + diluant</p>
            <p className="text-[11px] md:text-sm font-sans text-[#f0e6d3]/70 leading-relaxed">
              → D4 : <strong className="text-secondary font-black">561 g</strong> (11 %)<br />
              → Acétone : <strong className="text-orange-400 font-black">510 g</strong> (10 %)
            </p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.25em] font-mono text-secondary/50 mb-3">Activation MDI</p>
            <p className="text-[11px] md:text-sm font-sans text-[#f0e6d3]/70 leading-relaxed">
              → Eau : <strong className="text-[#a8c47a] font-black">76,5 g</strong> (1,5 %)<br />
              → Total mélange humide : <span className="text-[#f0e6d3]/60 font-bold">6 247,5 g</span>
            </p>
          </div>
        </div>
      </motion.section>

    </div>
  );
}
