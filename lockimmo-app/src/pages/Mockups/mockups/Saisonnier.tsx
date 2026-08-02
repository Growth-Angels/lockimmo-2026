import React from 'react';
import { C, F } from '../../../tokens';
import { LockimmoLogo, LockimmoMark } from '../../../brand';

/**
 * Mockup — Logiciel de locations saisonnières (courte durée).
 * Format 960×640. Aucune image externe.
 *
 * Point focal : le planning multi-biens sur 4 semaines, quasi saturé,
 * alimenté par les canaux synchronisés (0 double réservation).
 *
 * Deux rendus à partir de la même source :
 *  · <Saisonnier />          → rendu statique, strictement identique à l'export PNG
 *                              (aucune balise <style>, aucune propriété `animation`).
 *  · <Saisonnier animated /> → le même écran qui se construit progressivement,
 *                              boucle infinie de 8 s, 100 % CSS (aucun JS de timing).
 *
 * Convention des motions en production (AiAutomation / LiveDashboard) : le décalage
 * entre éléments est encodé DANS les pourcentages des keyframes (jamais via un délai
 * CSS, dont le décalage désynchroniserait la reboucle), pour que tous les éléments
 * partagent la même phase de boucle et se réinitialisent ensemble.
 */

/* ── Géométrie générale ─────────────────────────────────────────── */
const W = 960;
const H = 640;

const SB_W = 180;          // barre latérale
const PAD_X = 22;
const CX = SB_W + PAD_X;   // 202 — origine du contenu
const CW = W - CX - PAD_X; // 736 — largeur du contenu

/* ── Géométrie du planning ──────────────────────────────────────── */
const DAYS = 28;
const COL = 19;
const LABEL_W = 172;
const GRID_W = DAYS * COL;        // 532
const PLAN_W = LABEL_W + GRID_W;  // 704 = 736 − 2×16 de padding
const BAND_H = 22;                // bandeau des semaines
const DAYROW_H = 20;              // numéros de jour
const ROW_H = 42;                 // hauteur d'une ligne de bien
const GRID_H = BAND_H + DAYROW_H + 4 * ROW_H; // 210
const TODAY = 9;                  // index du jour courant (mer. 10 juin)

const SHADOW = '0 2px 8px rgba(53,50,48,0.05)';

/* ── Canaux de diffusion (aucun logo de marque : pastille + nom) ── */
type Channel = { name: string; color: string; soft: string; count: string };

const CHANNELS: Channel[] = [
  { name: 'Airbnb', color: C.error, soft: C.errorLight, count: '4 biens' },
  { name: 'Booking', color: C.info, soft: C.infoLight, count: '4 biens' },
  { name: 'Abritel', color: C.purple, soft: C.purpleLight, count: '3 biens' },
  { name: 'Site direct', color: C.accent, soft: C.accentLight, count: '4 biens' },
];

/* ── Biens et séjours ───────────────────────────────────────────── */
type Stay = { a: number; b: number; ch: number; name: string };
type Property = { name: string; sub: string; stays: Stay[]; clean: number[] };

const PROPERTIES: Property[] = [
  {
    name: 'Studio Vieux-Port',
    sub: 'Marseille 2e · 2 pers. · 3★',
    stays: [
      { a: 0, b: 4, ch: 0, name: 'Moreau' },
      { a: 4, b: 9, ch: 1, name: 'Petit' },
      { a: 9, b: 12, ch: 3, name: 'Girard' },
      { a: 13, b: 18, ch: 0, name: 'Bianchi' },
      { a: 18, b: 23, ch: 2, name: 'Roux' },
      { a: 23, b: 28, ch: 1, name: 'Keller' },
    ],
    clean: [12],
  },
  {
    name: 'Mas des Oliviers',
    sub: 'Lourmarin · 8 pers. · 4★',
    stays: [
      { a: 0, b: 7, ch: 1, name: 'Fam. Lemoine' },
      { a: 7, b: 14, ch: 0, name: 'Fam. Vasquez' },
      { a: 14, b: 21, ch: 3, name: 'Fam. Bertrand' },
      { a: 21, b: 28, ch: 0, name: 'Fam. Ohlsen' },
    ],
    clean: [],
  },
  {
    name: 'Chalet Les Mélèzes',
    sub: 'Serre-Chevalier · 6 pers. · 3★',
    stays: [
      { a: 0, b: 3, ch: 2, name: 'Nguyen' },
      { a: 3, b: 8, ch: 3, name: 'Caron' },
      { a: 8, b: 13, ch: 1, name: 'Weber' },
      { a: 14, b: 20, ch: 0, name: 'Ferrand' },
      { a: 20, b: 25, ch: 3, name: 'Dubois' },
      { a: 25, b: 28, ch: 1, name: 'Olsen' },
    ],
    clean: [13],
  },
  {
    name: 'Loft Bellecour',
    sub: 'Lyon 2e · 4 pers. · 4★',
    stays: [
      { a: 0, b: 5, ch: 0, name: 'Marchand' },
      { a: 5, b: 10, ch: 2, name: 'Silva' },
      { a: 10, b: 15, ch: 1, name: 'Perrin' },
      { a: 15, b: 17, ch: 3, name: 'Adam' },
      { a: 18, b: 24, ch: 0, name: 'Colin' },
      { a: 24, b: 28, ch: 3, name: 'Faure' },
    ],
    clean: [17],
  },
];

/* Juin 2026 commence un lundi : 4 semaines pleines, du 1 au 28. */
const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const WEEKS = ['SEM. 23', 'SEM. 24', 'SEM. 25', 'SEM. 26'];

/* ── KPI ────────────────────────────────────────────────────────── */
const KPIS: { label: string; value: string; note: string; noteColor: string; stars?: boolean }[] = [
  { label: "Taux d'occupation", value: '97 %', note: '109 nuits réservées sur 112', noteColor: C.success },
  { label: 'Revenu du mois', value: '18 640 €', note: '↗ +12 % vs juin 2025', noteColor: C.success },
  { label: 'Prix moyen / nuit', value: '171 €', note: '↗ +9 € grâce au tarif auto', noteColor: C.success },
  { label: 'Note voyageurs', value: '4,9/5', note: '128 avis · 4 canaux', noteColor: C.textMuted, stars: true },
];

/* ── Navigation ─────────────────────────────────────────────────── */
type NavItem = { label: string; icon: string; active?: boolean };

const NAV_PILOTAGE: NavItem[] = [
  { label: 'Tableau de bord', icon: 'M4 19V11M10 19V5M16 19v-6M21 19V9' },
  { label: 'Planning', icon: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4', active: true },
  { label: 'Réservations', icon: 'M5 4h14v16l-7-4-7 4z' },
  { label: 'Biens & annonces', icon: 'M4 11l8-7 8 7v9H4z' },
  { label: 'Voyageurs', icon: 'M4 20c0-3.3 3.6-5 8-5s8 1.7 8 5M12 4a4 4 0 110 8 4 4 0 010-8' },
];

const NAV_AUTO: NavItem[] = [
  { label: 'Tarification auto', icon: 'M3 12l9-9h8v8l-9 9zM15.5 8.5h.01' },
  { label: 'Ménage & accueil', icon: 'M12 3l2.1 5.4L19.5 10l-5.4 2.1L12 17.5l-2.1-5.4L4.5 10l5.4-1.6z' },
  { label: 'Taxe de séjour', icon: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9.5 8h5M9.5 12h5' },
];

const NAV_FINANCES: NavItem[] = [
  { label: 'Revenus & charges', icon: 'M4 18l5-5 3.5 3L20 8M20 8h-4M20 8v4' },
  { label: 'Documents', icon: 'M6 3h8l4 4v14H6zM14 3v4h4' },
];

/* ── Ordre chronologique de pose des séjours ────────────────────────
   Tri par date d'arrivée croissante, puis par ligne de bien (haut → bas)
   quand deux séjours commencent le même jour. 22 séjours au total. */
type StayRef = { pi: number; a: number };

const STAY_ORDER: StayRef[] = PROPERTIES
  .flatMap((p, pi) => p.stays.map((s) => ({ pi, a: s.a })))
  .sort((x, y) => x.a - y.a || x.pi - y.pi);

const stayIndex = (pi: number, a: number): number =>
  STAY_ORDER.findIndex((s) => s.pi === pi && s.a === a);

/* Chaque créneau de ménage se pose juste après le séjour qui le suit
   (à défaut, celui qui le précède). */
type CleanRef = { pi: number; d: number; after: number };

const CLEANS: CleanRef[] = PROPERTIES.flatMap((p, pi) =>
  p.clean.map((d) => {
    const ref = p.stays.find((s) => s.a === d + 1) ?? p.stays.find((s) => s.b === d);
    return { pi, d, after: ref ? stayIndex(pi, ref.a) : 0 };
  }),
);

const cleanIndex = (pi: number, d: number): number =>
  CLEANS.findIndex((c) => c.pi === pi && c.d === d);

/* ── Timeline de l'animation (en % d'un cycle de 8 s) ───────────────
   1. KPI en cascade  2. grille vide  3. barres de séjour (moment fort)
   4. ménages  5. bandeau vert + tuiles de canaux  6. opérations du jour
   7. maintien  8. réinitialisation simultanée. */
const CYCLE = '8s';

const KPI_START = 2;
const KPI_STEP = 1.8;
const KPI_DUR = 5;

const GRID_START = 9;
const GRID_DUR = 5;

const BAR_START = 15;
const BAR_STEP = 1.8;   // 22 barres → dernière posée à 52,8 % → 56,8 %
const BAR_DUR = 4;

const CLEAN_DUR = 3;

const BANNER_START = 58;
const BANNER_DUR = 4;

const TILE_START = 61;
const TILE_STEP = 2;
const TILE_DUR = 4;

const OPS_START = 70;
const OPS_DUR = 5;

const HOLD = 86;   // % — fin du maintien du planning complet
const RESET = 93;  // % — tout est revenu à l'état initial (planning vide)

const pct = (n: number) => `${+n.toFixed(3)}%`;

const ANIM = (name: string, easing = 'linear') => `${name} ${CYCLE} ${easing} 0s infinite both`;

const CSS = `
${KPIS.map((_, i) => {
  const s = KPI_START + i * KPI_STEP;
  return `
@keyframes sa-kpi-${i} {
  0%, ${pct(s)}         { opacity: 0; transform: translateY(10px); animation-timing-function: cubic-bezier(.2,.8,.3,1); }
  ${pct(s + KPI_DUR)}   { opacity: 1; transform: translateY(0); }
  ${pct(HOLD)}          { opacity: 1; transform: translateY(0); }
  ${pct(RESET)}, 100%   { opacity: 0; transform: translateY(10px); }
}`;
}).join('')}
@keyframes sa-grid {
  0%, ${pct(GRID_START)}           { opacity: 0; }
  ${pct(GRID_START + GRID_DUR)}    { opacity: 1; }
  ${pct(HOLD)}                     { opacity: 1; }
  ${pct(RESET)}, 100%              { opacity: 0; }
}
/* Colonnes week-end : opacité cible 0,55 (identique au rendu statique). */
@keyframes sa-grid-we {
  0%, ${pct(GRID_START)}           { opacity: 0; }
  ${pct(GRID_START + GRID_DUR)}    { opacity: .55; }
  ${pct(HOLD)}                     { opacity: .55; }
  ${pct(RESET)}, 100%              { opacity: 0; }
}
${STAY_ORDER.map((_, k) => {
  const s = BAR_START + k * BAR_STEP;
  return `
@keyframes sa-bar-${k} {
  0%, ${pct(s)}         { opacity: 0; transform: scaleX(0); animation-timing-function: cubic-bezier(.2,.85,.3,1); }
  ${pct(s + BAR_DUR)}   { opacity: 1; transform: scaleX(1); }
  ${pct(HOLD)}          { opacity: 1; transform: scaleX(1); }
  ${pct(RESET)}, 100%   { opacity: 0; transform: scaleX(0); }
}`;
}).join('')}
${CLEANS.map((c, i) => {
  const s = BAR_START + c.after * BAR_STEP + BAR_DUR;
  return `
@keyframes sa-clean-${i} {
  0%, ${pct(s)}           { opacity: 0; transform: scale(.7); animation-timing-function: cubic-bezier(.2,.8,.3,1); }
  ${pct(s + CLEAN_DUR)}   { opacity: 1; transform: scale(1); }
  ${pct(HOLD)}            { opacity: 1; transform: scale(1); }
  ${pct(RESET)}, 100%     { opacity: 0; transform: scale(.7); }
}`;
}).join('')}
@keyframes sa-banner {
  0%, ${pct(BANNER_START)}            { opacity: 0; transform: translateY(6px); animation-timing-function: cubic-bezier(.2,.8,.3,1); }
  ${pct(BANNER_START + BANNER_DUR)}   { opacity: 1; transform: translateY(0); }
  ${pct(HOLD)}                        { opacity: 1; transform: translateY(0); }
  ${pct(RESET)}, 100%                 { opacity: 0; transform: translateY(6px); }
}
${CHANNELS.map((_, i) => {
  const s = TILE_START + i * TILE_STEP;
  return `
@keyframes sa-tile-${i} {
  0%, ${pct(s)}           { opacity: 0; transform: translateY(7px) scale(.96); animation-timing-function: cubic-bezier(.2,.8,.3,1); }
  ${pct(s + TILE_DUR)}    { opacity: 1; transform: translateY(0) scale(1); }
  ${pct(HOLD)}            { opacity: 1; transform: translateY(0) scale(1); }
  ${pct(RESET)}, 100%     { opacity: 0; transform: translateY(7px) scale(.96); }
}`;
}).join('')}
@keyframes sa-ops {
  0%, ${pct(OPS_START)}          { opacity: 0; transform: translateY(10px); animation-timing-function: cubic-bezier(.2,.8,.3,1); }
  ${pct(OPS_START + OPS_DUR)}    { opacity: 1; transform: translateY(0); }
  ${pct(HOLD)}                   { opacity: 1; transform: translateY(0); }
  ${pct(RESET)}, 100%            { opacity: 0; transform: translateY(10px); }
}
`;

/* ── Petits composants ──────────────────────────────────────────── */
const Icon: React.FC<{ d: string; size?: number; color?: string; sw?: number }> = ({
  d,
  size = 14,
  color = C.textSecondary,
  sw = 1.7,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'block', flexShrink: 0 }}
  >
    <path d={d} />
  </svg>
);

const NavRow: React.FC<{ item: NavItem }> = ({ item }) => (
  <div
    style={{
      height: 30,
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      padding: '0 10px',
      borderRadius: 8,
      boxSizing: 'border-box',
      background: item.active ? C.white : 'transparent',
      border: `1px solid ${item.active ? C.border : 'transparent'}`,
      boxShadow: item.active ? SHADOW : 'none',
    }}
  >
    <Icon d={item.icon} color={item.active ? C.accent : C.textMuted} sw={item.active ? 1.9 : 1.6} />
    <span
      style={{
        fontSize: 11.5,
        fontWeight: item.active ? 700 : 500,
        color: item.active ? C.textPrimary : C.textSecondary,
        letterSpacing: '-0.05px',
      }}
    >
      {item.label}
    </span>
  </div>
);

const GroupLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      fontSize: 8.5,
      fontWeight: 700,
      letterSpacing: '1.2px',
      color: C.textMuted,
      textTransform: 'uppercase',
      paddingLeft: 11,
    }}
  >
    {children}
  </div>
);

const CardTitle: React.FC<{ title: string; right?: React.ReactNode }> = ({ title, right }) => (
  <div style={{ height: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <span style={{ fontFamily: F.display, fontSize: 13, fontWeight: 700, color: C.textPrimary }}>{title}</span>
    {right}
  </div>
);

/** Petit bloc dégradé évoquant la photo du bien (aucune image externe). */
const Thumb: React.FC = () => (
  <div
    style={{
      width: 26,
      height: 26,
      borderRadius: 7,
      flexShrink: 0,
      background: `linear-gradient(140deg, ${C.accentSoft} 0%, ${C.accentLight} 100%)`,
      border: `1px solid ${C.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Icon d="M4 11l8-7 8 7v9H4z" size={11} color={C.accent} sw={1.8} />
  </div>
);

const Stars: React.FC = () => (
  <svg width="52" height="9" viewBox="0 0 52 9" fill={C.accent} style={{ display: 'block' }}>
    {[0, 1, 2, 3, 4].map((i) => (
      <path
        key={i}
        transform={`translate(${i * 10.4} 0)`}
        d="M4.5 0L5.68 2.86L8.6 3.1L6.38 5.05L7.06 8L4.5 6.44L1.94 8L2.62 5.05L0.4 3.1L3.32 2.86Z"
      />
    ))}
  </svg>
);

const Check: React.FC<{ color?: string; size?: number }> = ({ color = C.success, size = 11 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'block', flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" fill={color} />
    <path d="M7.5 12.4l3 3 6-6.4" stroke={C.white} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ── Écran ──────────────────────────────────────────────────────── */
export const Saisonnier: React.FC<{ animated?: boolean }> = ({ animated = false }) => {
  /* Hors mode animé, aucune propriété `animation` n'est émise : le rendu
     reste rigoureusement identique à l'export PNG existant. */
  const anim = (v: string): React.CSSProperties => (animated ? { animation: v } : {});
  const animFrom = (v: string, origin: string): React.CSSProperties =>
    animated ? { animation: v, transformOrigin: origin } : {};

  return (
    <div
      style={{
        width: W,
        height: H,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 18,
        fontFamily: F.body,
        background: C.bgApp,
        color: C.textPrimary,
      }}
    >
      {animated ? <style>{CSS}</style> : null}

      {/* ══ Barre latérale ══════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: SB_W,
          height: H,
          background: C.bgApp,
          borderRight: `1px solid ${C.border}`,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ position: 'absolute', left: 16, top: 22 }}>
          <LockimmoLogo markSize={22} wordHeight={10} gap={8} />
        </div>

        <div style={{ position: 'absolute', left: 16, top: 64, width: 148 }}>
          <GroupLabel>Pilotage</GroupLabel>
        </div>
        <div style={{ position: 'absolute', left: 16, top: 80, width: 148 }}>
          {NAV_PILOTAGE.map((n) => (
            <NavRow key={n.label} item={n} />
          ))}
        </div>

        <div style={{ position: 'absolute', left: 16, top: 244, width: 148 }}>
          <GroupLabel>Automatisations</GroupLabel>
        </div>
        <div style={{ position: 'absolute', left: 16, top: 260, width: 148 }}>
          {NAV_AUTO.map((n) => (
            <NavRow key={n.label} item={n} />
          ))}
        </div>

        <div style={{ position: 'absolute', left: 16, top: 364, width: 148 }}>
          <GroupLabel>Finances</GroupLabel>
        </div>
        <div style={{ position: 'absolute', left: 16, top: 380, width: 148 }}>
          {NAV_FINANCES.map((n) => (
            <NavRow key={n.label} item={n} />
          ))}
        </div>

        {/* Widget occupation 12 mois */}
        <div
          style={{
            position: 'absolute',
            left: 16,
            top: 456,
            width: 148,
            height: 78,
            boxSizing: 'border-box',
            background: C.white,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: 12,
            boxShadow: SHADOW,
          }}
        >
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '1.1px', color: C.textMuted }}>
            OCCUPATION 12 MOIS
          </div>
          <div
            style={{
              fontFamily: F.display,
              fontSize: 26,
              fontWeight: 700,
              lineHeight: '30px',
              color: C.textPrimary,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            92 %
          </div>
          <div style={{ width: 124, height: 5, borderRadius: 3, background: C.bgApp, marginTop: 2 }}>
            <div style={{ width: 114, height: 5, borderRadius: 3, background: C.accent }} />
          </div>
          <div style={{ fontSize: 8.5, color: C.textMuted, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
            Moyenne du marché : 68 %
          </div>
        </div>

        {/* Classement meublé de tourisme */}
        <div
          style={{
            position: 'absolute',
            left: 16,
            top: 546,
            width: 148,
            height: 74,
            boxSizing: 'border-box',
            background: C.accentSubtle,
            border: `1px solid ${C.accentSoft}`,
            borderRadius: 12,
            padding: 12,
          }}
        >
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '1.1px', color: C.accent }}>
            MEUBLÉ DE TOURISME
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5 }}>
            <Stars />
            <span style={{ fontSize: 11, fontWeight: 700, color: C.textPrimary, fontVariantNumeric: 'tabular-nums' }}>
              4 biens
            </span>
          </div>
          <div style={{ fontSize: 8.5, color: C.textSecondary, marginTop: 5, fontVariantNumeric: 'tabular-nums' }}>
            Classement valide → 12/2029
          </div>
        </div>
      </div>

      {/* ══ Zone principale ═════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          left: SB_W,
          top: 0,
          width: W - SB_W,
          height: H,
          background: C.bgPage,
        }}
      />

      {/* ── En-tête d'écran ── */}
      <div
        style={{
          position: 'absolute',
          left: CX,
          top: 20,
          width: CW,
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontFamily: F.display, fontSize: 21, fontWeight: 700, color: C.textPrimary, lineHeight: '25px' }}>
            Locations saisonnières
          </div>
          <div style={{ fontSize: 11, color: C.textSecondary, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
            Juin 2026 · 4 biens en ligne · 4 canaux synchronisés
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Sélecteur de vue */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              height: 30,
              padding: 3,
              boxSizing: 'border-box',
              background: C.white,
              border: `1px solid ${C.border}`,
              borderRadius: 9,
            }}
          >
            {['Mois', 'Semaine', 'Liste'].map((v, i) => (
              <div
                key={v}
                style={{
                  height: 24,
                  lineHeight: '24px',
                  padding: '0 11px',
                  borderRadius: 7,
                  fontSize: 10.5,
                  fontWeight: i === 0 ? 700 : 500,
                  color: i === 0 ? C.white : C.textSecondary,
                  background: i === 0 ? C.accent : 'transparent',
                }}
              >
                {v}
              </div>
            ))}
          </div>

          {/* Action principale */}
          <div
            style={{
              height: 30,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '0 13px',
              borderRadius: 9,
              background: C.textPrimary,
            }}
          >
            <Icon d="M12 5v14M5 12h14" size={12} color={C.white} sw={2.2} />
            <span style={{ fontSize: 10.5, fontWeight: 700, color: C.white }}>Nouvelle réservation</span>
          </div>

          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              background: C.accentLight,
              border: `1px solid ${C.accentSoft}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10.5,
              fontWeight: 700,
              color: C.accent,
            }}
          >
            AL
          </div>
        </div>
      </div>

      {/* ── Rangée de KPI ── */}
      <div style={{ position: 'absolute', left: CX, top: 76, width: CW, height: 84, display: 'flex', gap: 12 }}>
        {KPIS.map((k, i) => (
          <div
            key={k.label}
            style={{
              width: 175,
              height: 84,
              boxSizing: 'border-box',
              background: C.white,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: 12,
              boxShadow: SHADOW,
              ...anim(ANIM(`sa-kpi-${i}`)),
            }}
          >
            <div
              style={{
                fontSize: 8.5,
                fontWeight: 700,
                letterSpacing: '1.1px',
                color: C.textMuted,
                textTransform: 'uppercase',
              }}
            >
              {k.label}
            </div>
            <div
              style={{
                fontFamily: F.display,
                fontSize: 28,
                fontWeight: 700,
                lineHeight: '34px',
                color: C.textPrimary,
                fontVariantNumeric: 'tabular-nums',
                marginTop: 1,
              }}
            >
              {k.value}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 1 }}>
              {k.stars && <Stars />}
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  color: k.noteColor,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {k.note}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Planning des séjours (point focal) ── */}
      <div
        style={{
          position: 'absolute',
          left: CX,
          top: 172,
          width: CW,
          height: 300,
          boxSizing: 'border-box',
          background: C.white,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: 16,
          boxShadow: SHADOW,
        }}
      >
        {/* Titre + légende */}
        <div
          style={{
            height: 24,
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 9 }}>
            <span style={{ fontFamily: F.display, fontSize: 16, fontWeight: 700, color: C.textPrimary }}>
              Planning des séjours
            </span>
            <span style={{ fontSize: 10.5, color: C.textMuted, fontVariantNumeric: 'tabular-nums' }}>
              1 → 28 juin 2026
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {CHANNELS.map((ch) => (
              <div key={ch.name} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 7, height: 7, borderRadius: 2, background: ch.color }} />
                <span style={{ fontSize: 9.5, fontWeight: 600, color: C.textSecondary }}>{ch.name}</span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 2,
                  background: C.bgApp,
                  border: `1px dashed ${C.borderStrong}`,
                  boxSizing: 'border-box',
                }}
              />
              <span style={{ fontSize: 9.5, fontWeight: 600, color: C.textSecondary }}>Ménage</span>
            </div>
          </div>
        </div>

        {/* Grille */}
        <div style={{ position: 'relative', width: PLAN_W, height: GRID_H }}>
          {/* Colonnes week-end */}
          {Array.from({ length: DAYS }).map((_, i) =>
            i % 7 >= 5 ? (
              <div
                key={`we-${i}`}
                style={{
                  position: 'absolute',
                  left: LABEL_W + i * COL,
                  top: 0,
                  width: COL,
                  height: GRID_H,
                  background: C.bgApp,
                  opacity: 0.55,
                  ...anim(ANIM('sa-grid-we')),
                }}
              />
            ) : null,
          )}

          {/* Séparateurs de semaine */}
          {[0, 1, 2, 3, 4].map((w) => (
            <div
              key={`sep-${w}`}
              style={{
                position: 'absolute',
                left: LABEL_W + w * 7 * COL,
                top: 0,
                width: 1,
                height: GRID_H,
                background: C.border,
                ...anim(ANIM('sa-grid')),
              }}
            />
          ))}

          {/* Bandeau des semaines */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: LABEL_W,
              height: BAND_H + DAYROW_H,
              display: 'flex',
              alignItems: 'flex-end',
              paddingBottom: 5,
              boxSizing: 'border-box',
              ...anim(ANIM('sa-grid')),
            }}
          >
            <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '1.1px', color: C.textMuted }}>
              4 BIENS
            </span>
          </div>

          {WEEKS.map((wk, w) => (
            <div
              key={wk}
              style={{
                position: 'absolute',
                left: LABEL_W + w * 7 * COL,
                top: 0,
                width: 7 * COL,
                height: BAND_H,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 8.5,
                fontWeight: 700,
                letterSpacing: '1px',
                color: C.textMuted,
                fontVariantNumeric: 'tabular-nums',
                ...anim(ANIM('sa-grid')),
              }}
            >
              {wk}
            </div>
          ))}

          {/* Numéros de jour */}
          {Array.from({ length: DAYS }).map((_, i) => (
            <div
              key={`d-${i}`}
              style={{
                position: 'absolute',
                left: LABEL_W + i * COL,
                top: BAND_H,
                width: COL,
                height: DAYROW_H,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                ...anim(ANIM('sa-grid')),
              }}
            >
              <span style={{ fontSize: 7.5, fontWeight: 600, color: C.textMuted, letterSpacing: '0.2px' }}>
                {WEEKDAYS[i % 7]}
              </span>
              {i === TODAY ? (
                <span
                  style={{
                    width: 14,
                    height: 12,
                    borderRadius: 4,
                    background: C.accent,
                    color: C.white,
                    fontSize: 8,
                    fontWeight: 700,
                    lineHeight: '12px',
                    textAlign: 'center',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {i + 1}
                </span>
              ) : (
                <span
                  style={{
                    fontSize: 8.5,
                    fontWeight: 600,
                    color: C.textSecondary,
                    lineHeight: '12px',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {i + 1}
                </span>
              )}
            </div>
          ))}

          {/* Ligne du jour */}
          <div
            style={{
              position: 'absolute',
              left: LABEL_W + TODAY * COL + COL / 2,
              top: BAND_H + DAYROW_H,
              width: 0,
              height: 4 * ROW_H,
              borderLeft: `1px dashed rgba(255,135,83,0.55)`,
              ...anim(ANIM('sa-grid')),
            }}
          />

          {/* Filet sous l'en-tête */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: BAND_H + DAYROW_H,
              width: PLAN_W,
              height: 1,
              background: C.borderStrong,
              ...anim(ANIM('sa-grid')),
            }}
          />

          {/* Lignes de biens */}
          {PROPERTIES.map((p, r) => (
            <div
              key={p.name}
              style={{
                position: 'absolute',
                left: 0,
                top: BAND_H + DAYROW_H + r * ROW_H,
                width: PLAN_W,
                height: ROW_H,
                borderBottom: r < 3 ? `1px solid ${C.border}` : 'none',
                boxSizing: 'border-box',
              }}
            >
              {/* Libellé du bien */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: LABEL_W,
                  height: ROW_H,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  paddingRight: 12,
                  boxSizing: 'border-box',
                  ...anim(ANIM('sa-grid')),
                }}
              >
                <Thumb />
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: C.textPrimary,
                      lineHeight: '14px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {p.name}
                  </div>
                  <div
                    style={{
                      fontSize: 8.5,
                      color: C.textMuted,
                      lineHeight: '11px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {p.sub}
                  </div>
                </div>
              </div>

              {/* Barres de séjour */}
              {p.stays.map((s) => {
                const nights = s.b - s.a;
                const barW = nights * COL - 4;
                const ch = CHANNELS[s.ch];
                const k = stayIndex(r, s.a);
                return (
                  <div
                    key={`${p.name}-${s.a}`}
                    style={{
                      position: 'absolute',
                      left: LABEL_W + s.a * COL + 2,
                      top: 9,
                      width: barW,
                      height: 24,
                      borderRadius: 6,
                      background: ch.color,
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 5px',
                      boxSizing: 'border-box',
                      overflow: 'hidden',
                      ...animFrom(ANIM(`sa-bar-${k}`), 'left center'),
                    }}
                  >
                    <span
                      style={{
                        fontSize: 8.2,
                        fontWeight: 700,
                        color: C.white,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontVariantNumeric: 'tabular-nums',
                        letterSpacing: '-0.1px',
                      }}
                    >
                      {barW >= 66 ? `${s.name} · ${nights} n.` : `${nights} n.`}
                    </span>
                  </div>
                );
              })}

              {/* Créneaux de ménage entre deux séjours */}
              {p.clean.map((d) => (
                <div
                  key={`c-${d}`}
                  style={{
                    position: 'absolute',
                    left: LABEL_W + d * COL + 3,
                    top: 9,
                    width: COL - 6,
                    height: 24,
                    borderRadius: 5,
                    background: C.bgLight,
                    border: `1px dashed ${C.borderStrong}`,
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...animFrom(ANIM(`sa-clean-${cleanIndex(r, d)}`), 'center'),
                  }}
                >
                  <svg width="9" height="9" viewBox="0 0 24 24" fill={C.textMuted} style={{ display: 'block' }}>
                    <path d="M12 2l2.4 6.2L20.6 10.6L14.4 13L12 19.2L9.6 13L3.4 10.6L9.6 8.2Z" />
                  </svg>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Pied du planning */}
        <div
          style={{
            height: 22,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Check />
            <span style={{ fontSize: 9.5, fontWeight: 600, color: C.textSecondary }}>
              Aucune double réservation — les calendriers des 4 canaux sont bloqués automatiquement.
            </span>
          </div>
          <span style={{ fontSize: 9.5, color: C.textMuted, fontVariantNumeric: 'tabular-nums' }}>
            109 nuits sur 112 · 3 ménages planifiés
          </span>
        </div>
      </div>

      {/* ── Synchronisation des canaux ── */}
      <div
        style={{
          position: 'absolute',
          left: CX,
          top: 484,
          width: 440,
          height: 136,
          boxSizing: 'border-box',
          background: C.white,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: 14,
          boxShadow: SHADOW,
        }}
      >
        <CardTitle
          title="Synchronisation des canaux"
          right={
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.success }} />
              <span style={{ fontSize: 9.5, fontWeight: 600, color: C.success, fontVariantNumeric: 'tabular-nums' }}>
                Synchronisé il y a 2 min
              </span>
            </div>
          }
        />

        <div
          style={{
            height: 26,
            marginTop: 12,
            background: C.successLight,
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            padding: '0 10px',
            boxSizing: 'border-box',
            gap: 7,
            ...anim(ANIM('sa-banner')),
          }}
        >
          <Check size={12} />
          <span style={{ fontSize: 10.5, fontWeight: 700, color: C.success, fontVariantNumeric: 'tabular-nums' }}>
            0 double réservation en 14 mois
          </span>
          <span style={{ fontSize: 9.5, color: C.textMuted, fontVariantNumeric: 'tabular-nums', marginLeft: 'auto' }}>
            1 248 nuits synchronisées
          </span>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          {CHANNELS.map((ch, i) => (
            <div
              key={ch.name}
              style={{
                width: 97,
                height: 42,
                boxSizing: 'border-box',
                background: C.bgLight,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: 8,
                ...anim(ANIM(`sa-tile-${i}`)),
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                {ch.name === 'Site direct' ? (
                  <LockimmoMark size={9} radius={3} />
                ) : (
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: ch.color, flexShrink: 0 }} />
                )}
                <span style={{ fontSize: 9.5, fontWeight: 700, color: C.textPrimary }}>{ch.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                <span style={{ fontSize: 8.5, color: C.textMuted, fontVariantNumeric: 'tabular-nums' }}>
                  {ch.count} ·
                </span>
                <span style={{ fontSize: 8.5, fontWeight: 700, color: C.success }}>à jour</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Opérations du jour ── */}
      <div
        style={{
          position: 'absolute',
          left: CX + 452,
          top: 484,
          width: 284,
          height: 136,
          boxSizing: 'border-box',
          background: C.white,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: 14,
          boxShadow: SHADOW,
          ...anim(ANIM('sa-ops')),
        }}
      >
        <CardTitle
          title="Opérations du jour"
          right={
            <span style={{ fontSize: 9.5, color: C.textMuted, fontVariantNumeric: 'tabular-nums' }}>
              mer. 10 juin
            </span>
          }
        />

        <div
          style={{
            height: 80,
            marginTop: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {[
            {
              icon: 'M12 3l2.1 5.4L19.5 10l-5.4 2.1L12 17.5l-2.1-5.4L4.5 10l5.4-1.6z',
              title: 'Ménage',
              sub: 'Studio Vieux-Port · 11h00',
              chip: 'Planifié',
              chipColor: C.info,
              chipBg: C.infoLight,
            },
            {
              icon: 'M14 8a4 4 0 11-4 4M10 12L3 19v2h3v-2h2v-2h2z',
              title: 'Check-in autonome',
              sub: 'Mas des Oliviers · 16h00',
              chip: 'Prêt',
              chipColor: C.success,
              chipBg: C.successLight,
            },
            {
              icon: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9.5 8h5M9.5 12h5',
              title: 'Taxe de séjour',
              sub: 'Collectée automatiquement',
              chip: '412 €',
              chipColor: C.accent,
              chipBg: C.accentLight,
            },
          ].map((op) => (
            <div key={op.title} style={{ height: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 7,
                  background: C.bgLight,
                  border: `1px solid ${C.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon d={op.icon} size={11} color={C.textSecondary} sw={1.7} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.textPrimary,
                    lineHeight: '12px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {op.title}
                </div>
                <div
                  style={{
                    fontSize: 8.5,
                    color: C.textMuted,
                    lineHeight: '11px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {op.sub}
                </div>
              </div>
              <div
                style={{
                  height: 17,
                  lineHeight: '17px',
                  padding: '0 7px',
                  borderRadius: 6,
                  background: op.chipBg,
                  fontSize: 8.5,
                  fontWeight: 700,
                  color: op.chipColor,
                  flexShrink: 0,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {op.chip}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
