import React from 'react';
import { C, F } from '../../../tokens';
import { LockimmoLogo } from '../../../brand';

/**
 * Mockup — Logiciel de transactions (vente immobilière)
 * Écran 960×640. Aucune image externe.
 *
 * Deux rendus depuis la même source :
 *   <Transactions />           → écran statique, strictement inchangé (export PNG)
 *   <Transactions animated />  → même écran, construit progressivement, boucle de 7 s
 *
 * Convention des motions en production (AiAutomation / LiveDashboard) : le décalage
 * entre éléments est encodé DANS les pourcentages des keyframes (jamais via un
 * décalage de départ), pour que tout partage la même phase et se réinitialise ensemble.
 *
 * Composition :
 *   0   → 56    barre d'application (logo, navigation, recherche, compte)
 *   56  → 640   zone de contenu (fond C.bgApp)
 *        ├ 40   en-tête d'écran (titre + vues + période + action principale)
 *        ├ 80   rangée de 4 KPI
 *        ├ 18   intitulé du pipeline + gage de confiance
 *        └ 376  pipeline en 5 colonnes (point focal)
 */

/* ── Grille verticale ── */
const W = 960;
const H = 640;
const HEADER_H = 56;
const PAD_X = 20;
const PAD_TOP = 20;
const PAD_BOTTOM = 18;

const INNER_W = W - PAD_X * 2;              // 920
const TITLE_H = 40;
const KPI_H = 80;
const PIPE_LABEL_H = 18;
const COL_H = H - HEADER_H - PAD_TOP - PAD_BOTTOM - (TITLE_H + 12) - (KPI_H + 12) - (PIPE_LABEL_H + 8); // 376

const COL_PAD = 8;
const COL_HEAD_H = 32;
const COL_BODY_H = COL_H - COL_PAD * 2 - COL_HEAD_H - 8; // 320

const CARD_H = 88;
const CARD_HERO_H = 116;

const SHADOW = '0 2px 8px rgba(53,50,48,0.05)';
const NUM: React.CSSProperties = { fontVariantNumeric: 'tabular-nums' };
const ELL: React.CSSProperties = { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };

/* ── Petites icônes tracées (aucune image) ── */
const Ico: React.FC<{ d: string; size?: number; color?: string; sw?: number }> = ({
  d, size = 14, color = C.textSecondary, sw = 1.7,
}) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ display: 'block', flexShrink: 0 }}
  >
    <path d={d} />
  </svg>
);

const P = {
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14M20 20l-4-4',
  bell: 'M18 15V10a6 6 0 1 0-12 0v5l-1.5 3h15zM10 21h4',
  check: 'M20 6 9 17l-5-5',
  shield: 'M12 3l7 3v6c0 4.4-3 7.4-7 9-4-1.6-7-4.6-7-9V6zM9 12l2 2 4-4',
  doc: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5',
  eye: 'M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6',
  house: 'M3 11.4 12 4l9 7.4M5.6 10.2V20h12.8v-9.8',
  flat: 'M5 3h14v18H5zM9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2',
  plus: 'M12 5v14M5 12h14',
  cal: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
};

/* ── Types ── */
type Tag = { label: string; color: string; bg: string };
type Banner = { text: string; icon: string; color: string; bg: string };

type Deal = {
  title: string;
  place: string;
  price: string;
  grad: string;
  glyph: string;
  tag?: Tag;
  dpe?: { letter: string; color: string; bg: string };
  meta: string;
  metaColor?: string;
  banner?: Banner;
};

type Column = {
  label: string;
  dot: string;
  count: string;
  amount: string;
  deals: Deal[];
};

/* ── Palettes des vignettes (dégradés sobres, jamais de photo) ── */
const G_WARM = `linear-gradient(140deg, ${C.accentSoft} 0%, ${C.accentLight} 100%)`;
const G_STONE = `linear-gradient(140deg, ${C.bgApp} 0%, ${C.bgLight} 100%)`;
const G_BLUE = `linear-gradient(140deg, ${C.infoLight} 0%, ${C.bgLight} 100%)`;
const G_PURPLE = `linear-gradient(140deg, ${C.purpleLight} 0%, ${C.bgLight} 100%)`;
const G_GREEN = `linear-gradient(140deg, ${C.successLight} 0%, ${C.bgLight} 100%)`;
const G_SAND = `linear-gradient(140deg, ${C.bgWarm} 0%, ${C.accentSubtle} 100%)`;

const DPE_OK = { color: C.success, bg: C.successLight };
const DPE_MID = { color: C.accent, bg: C.accentLight };

const COLUMNS: Column[] = [
  {
    label: 'MANDATS', dot: C.textMuted, count: '9', amount: '3,4 M€',
    deals: [
      {
        title: 'Maison 140 m²', place: 'Uzès (30)', price: '549 000 €', grad: G_WARM, glyph: P.house,
        tag: { label: 'EXCLUSIF', color: C.accent, bg: C.accentLight },
        dpe: { letter: 'C', ...DPE_OK }, meta: 'Estimation validée',
        banner: { text: 'Mandat exclusif · 12 sem.', icon: P.doc, color: C.accent, bg: C.accentLight },
      },
      {
        title: 'T4 — 92 m²', place: 'Nîmes centre', price: '318 000 €', grad: G_STONE, glyph: P.flat,
        tag: { label: 'SIMPLE', color: C.info, bg: C.infoLight },
        dpe: { letter: 'D', ...DPE_MID }, meta: 'En ligne depuis 3 j',
      },
      {
        title: 'Studio 24 m²', place: 'Montpellier', price: '132 000 €', grad: G_SAND, glyph: P.flat,
        dpe: { letter: 'E', ...DPE_MID }, meta: '12 contacts qualifiés',
      },
    ],
  },
  {
    label: 'VISITES', dot: C.info, count: '12', amount: '4,1 M€',
    deals: [
      {
        title: 'T3 — 68 m²', place: 'Lyon 6e', price: '395 000 €', grad: G_BLUE, glyph: P.flat,
        tag: { label: 'EXCLUSIF', color: C.accent, bg: C.accentLight },
        dpe: { letter: 'C', ...DPE_OK }, meta: 'Relance auto envoyée',
        banner: { text: '6 visites · 3 retours +', icon: P.eye, color: C.info, bg: C.infoLight },
      },
      {
        title: 'Maison 165 m²', place: 'Écully', price: '780 000 €', grad: G_STONE, glyph: P.house,
        dpe: { letter: 'B', ...DPE_OK }, meta: 'Visite samedi 11 h',
      },
      {
        title: 'T2 — 44 m²', place: 'Villeurbanne', price: '229 000 €', grad: G_SAND, glyph: P.flat,
        dpe: { letter: 'D', ...DPE_MID }, meta: '4 visites cette semaine',
      },
    ],
  },
  {
    label: 'OFFRES', dot: C.accent, count: '5', amount: '1,9 M€',
    deals: [
      {
        title: 'Duplex 105 m²', place: 'Bordeaux 2e', price: '612 000 €', grad: G_GREEN, glyph: P.flat,
        dpe: { letter: 'C', ...DPE_OK }, meta: 'Financement validé',
        banner: { text: 'Offre acceptée à 98 %', icon: P.check, color: C.success, bg: C.successLight },
      },
      {
        title: 'T2 — 51 m²', place: 'Nantes centre', price: '268 000 €', grad: G_WARM, glyph: P.flat,
        tag: { label: '2 OFFRES', color: C.accent, bg: C.accentLight },
        dpe: { letter: 'D', ...DPE_MID }, meta: 'Offre au prix reçue',
      },
      {
        title: 'Maison 132 m²', place: 'Toulouse', price: '445 000 €', grad: G_STONE, glyph: P.house,
        dpe: { letter: 'C', ...DPE_OK }, meta: 'Contre-proposition J+1',
      },
    ],
  },
  {
    label: 'COMPROMIS', dot: C.purple, count: '4', amount: '1,6 M€',
    deals: [
      {
        title: 'T4 — 88 m²', place: 'Aix centre', price: '585 000 €', grad: G_PURPLE, glyph: P.flat,
        dpe: { letter: 'B', ...DPE_OK }, meta: 'Rétractation J+7',
        banner: { text: 'Signé électroniquement', icon: P.shield, color: C.purple, bg: C.purpleLight },
      },
      {
        title: 'Maison 150 m²', place: 'Le Bouscat', price: '690 000 €', grad: G_STONE, glyph: P.house,
        dpe: { letter: 'C', ...DPE_OK }, meta: 'Diagnostics 9/9',
      },
      {
        title: 'T3 — 72 m²', place: 'Annecy', price: '410 000 €', grad: G_SAND, glyph: P.flat,
        dpe: { letter: 'C', ...DPE_OK }, meta: 'Notaire : Me Ferrand',
      },
    ],
  },
  {
    label: 'ACTÉ', dot: C.success, count: '7', amount: '2,8 M€',
    deals: [
      {
        title: 'Maison 145 m²', place: 'Chaponost', price: '615 000 €', grad: G_GREEN, glyph: P.house,
        meta: 'Honoraires 18 450 € TTC', metaColor: C.success,
        banner: { text: 'Acte authentique le 14/09', icon: P.cal, color: C.success, bg: C.successLight },
      },
      {
        title: 'T5 — 118 m²', place: 'Lyon 3e', price: '528 000 €', grad: G_STONE, glyph: P.flat,
        tag: { label: 'ACTÉ', color: C.success, bg: C.successLight },
        meta: 'Honoraires 15 840 € TTC', metaColor: C.success,
      },
      {
        title: 'T2 — 46 m²', place: 'Grenoble', price: '189 000 €', grad: G_SAND, glyph: P.flat,
        tag: { label: 'ACTÉ', color: C.success, bg: C.successLight },
        meta: 'Honoraires 7 560 € TTC', metaColor: C.success,
      },
    ],
  },
];

const KPIS: { label: string; value: string; sub: string; chip: string; chipColor: string; chipBg: string }[] = [
  {
    label: 'VOLUME EN COURS', value: '11,0 M€', sub: '30 affaires actives',
    chip: '+12 %', chipColor: C.success, chipBg: C.successLight,
  },
  {
    label: 'HONORAIRES T3', value: '312 400 €', sub: 'dont 214 900 € sécurisés',
    chip: '+18 %', chipColor: C.success, chipBg: C.successLight,
  },
  {
    label: 'DÉLAI MOYEN DE VENTE', value: '42 j', sub: '68 j en moyenne sur le secteur',
    chip: '−26 j', chipColor: C.accent, chipBg: C.accentLight,
  },
  {
    label: 'TRANSFORMATION', value: '68 %', sub: 'offres → compromis signés',
    chip: '+9 pts', chipColor: C.success, chipBg: C.successLight,
  },
];

const NAV = ['Transactions', 'Biens', 'Contacts', 'Agenda', 'Documents'];

/* ══════════════════════════════════════════════════════════════════════════
   Animation optionnelle — 100 % CSS, cycle unique de 7 s
   Récit : les affaires avancent dans le pipeline jusqu'à la vente.
     2 → 17   les 4 KPI en cascade
    14 → 20   « Pipeline de vente » + gage eIDAS
    20 → 68   les 5 colonnes se remplissent de gauche à droite
              (en-tête de colonne, puis ses cartes de haut en bas)
    28 → 65   le bandeau de réussite de chaque carte héros, en léger rebond
    70 → 79   les honoraires en vert de la colonne « Acté » (la chute)
    79 → 86   maintien de l'écran complet
    86 → 93   réinitialisation simultanée (colonnes vides)
   ══════════════════════════════════════════════════════════════════════════ */

const KPI_START = 2;
const KPI_STEP = 3;
const KPI_DUR = 6;

const HEAD_START = 14;
const HEAD_DUR = 6;

const COL_START = 20;     // en-tête de la 1re colonne
const COL_STEP = 8;       // écart entre deux colonnes
const COL_HEAD_DUR = 4;

const CARD_OFFSET = 3;    // 1re carte, après l'en-tête de sa colonne
const CARD_STEP = 3.5;    // écart entre cartes d'une même colonne
const CARD_DUR = 6;

const BANNER_OFFSET = 5;  // bandeau, après la carte héros
const BANNER_DUR = 5;

const FEE_START = 70;
const FEE_STEP = 2;
const FEE_DUR = 5;

const HOLD = 86;          // % — fin du maintien
const RESET = 93;         // % — tout est revenu à l'état initial

/** Instant d'apparition de la carte j de la colonne c. */
const cardAt = (c: number, j: number) => COL_START + CARD_OFFSET + c * COL_STEP + j * CARD_STEP;

const CSS = `
${KPIS.map((_, i) => {
  const s = KPI_START + i * KPI_STEP;
  return `
@keyframes tx-kpi-${i} {
  0%, ${s}%        { opacity: 0; transform: translateY(10px); animation-timing-function: cubic-bezier(.2,.8,.3,1); }
  ${s + KPI_DUR}%  { opacity: 1; transform: translateY(0); }
  ${HOLD}%         { opacity: 1; transform: translateY(0); }
  ${RESET}%, 100%  { opacity: 0; transform: translateY(10px); }
}`;
}).join('')}
@keyframes tx-head {
  0%, ${HEAD_START}%        { opacity: 0; transform: translateY(6px); animation-timing-function: cubic-bezier(.2,.8,.3,1); }
  ${HEAD_START + HEAD_DUR}% { opacity: 1; transform: translateY(0); }
  ${HOLD}%                  { opacity: 1; transform: translateY(0); }
  ${RESET}%, 100%           { opacity: 0; transform: translateY(6px); }
}
${COLUMNS.map((col, c) => {
  const h = COL_START + c * COL_STEP;
  const b = cardAt(c, 0) + BANNER_OFFSET;
  return `
@keyframes tx-colhead-${c} {
  0%, ${h}%             { opacity: 0; transform: translateX(-8px); animation-timing-function: cubic-bezier(.2,.8,.3,1); }
  ${h + COL_HEAD_DUR}%  { opacity: 1; transform: translateX(0); }
  ${HOLD}%              { opacity: 1; transform: translateX(0); }
  ${RESET}%, 100%       { opacity: 0; transform: translateX(-8px); }
}
${col.deals.map((_, j) => {
  const s = cardAt(c, j);
  return `
@keyframes tx-card-${c}-${j} {
  0%, ${s}%         { opacity: 0; transform: translateY(-8px) scale(.97); animation-timing-function: cubic-bezier(.2,.8,.3,1); }
  ${s + CARD_DUR}%  { opacity: 1; transform: translateY(0) scale(1); }
  ${HOLD}%          { opacity: 1; transform: translateY(0) scale(1); }
  ${RESET}%, 100%   { opacity: 0; transform: translateY(-8px) scale(.97); }
}`;
}).join('')}
@keyframes tx-banner-${c} {
  0%, ${b}%              { opacity: 0; transform: scale(.88); animation-timing-function: cubic-bezier(.34,1.56,.64,1); }
  ${b + BANNER_DUR}%     { opacity: 1; transform: scale(1); }
  ${HOLD}%               { opacity: 1; transform: scale(1); }
  ${RESET}%, 100%        { opacity: 0; transform: scale(.88); }
}`;
}).join('')}
${[0, 1, 2].map((j) => {
  const s = FEE_START + j * FEE_STEP;
  return `
@keyframes tx-fee-${j} {
  0%, ${s}%        { opacity: 0; transform: translateY(4px); animation-timing-function: cubic-bezier(.2,.8,.3,1); }
  ${s + FEE_DUR}%  { opacity: 1; transform: translateY(0); }
  ${HOLD}%         { opacity: 1; transform: translateY(0); }
  ${RESET}%, 100%  { opacity: 0; transform: translateY(4px); }
}`;
}).join('')}
`;

/** Toutes les animations partagent la même durée, le même départ (0s) et la même boucle. */
const A = (name: string) => `${name} 7s linear 0s infinite both`;

/** Rien n'est émis quand `animated` est faux : le rendu statique reste au pixel près. */
const makeAnim = (animated: boolean) => (v: string): React.CSSProperties =>
  (animated ? { animation: v } : {});

/* ── Carte de bien ── */
const DealCard: React.FC<{ deal: Deal; animated: boolean; c: number; j: number }> = ({
  deal, animated, c, j,
}) => {
  const anim = makeAnim(animated);
  return (
  <div
    style={{
      height: deal.banner ? CARD_HERO_H : CARD_H,
      boxSizing: 'border-box',
      background: C.white,
      border: `1px solid ${C.border}`,
      borderRadius: 11,
      boxShadow: SHADOW,
      padding: 8,
      display: 'flex',
      flexDirection: 'column',
      ...anim(A(`tx-card-${c}-${j}`)),
    }}
  >
    {/* Vignette + identité du bien */}
    <div style={{ height: 30, display: 'flex', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          width: 38, height: 30, borderRadius: 7, background: deal.grad,
          border: `1px solid ${C.border}`, boxSizing: 'border-box', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Ico d={deal.glyph} size={15} color="rgba(53,50,48,0.30)" sw={1.5} />
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.textPrimary, lineHeight: '14px', ...ELL, ...NUM }}>
          {deal.title}
        </div>
        <div style={{ fontSize: 9.5, color: C.textMuted, lineHeight: '13px', ...ELL }}>
          {deal.place}
        </div>
      </div>
    </div>

    {/* Prix + statut court */}
    <div style={{ height: 17, marginTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
      <span
        style={{
          fontFamily: F.display, fontSize: 13.5, fontWeight: 700,
          color: C.textPrimary, lineHeight: '17px',
          // le prix ne doit jamais passer à la ligne, même face à un badge large
          whiteSpace: 'nowrap', flexShrink: 0,
          ...NUM,
        }}
      >
        {deal.price}
      </span>
      {deal.tag && (
        <span
          style={{
            fontSize: 8, fontWeight: 700, letterSpacing: '0.6px',
            color: deal.tag.color, background: deal.tag.bg,
            padding: '2px 6px', borderRadius: 5, lineHeight: '11px', whiteSpace: 'nowrap',
            overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0,
            ...NUM,
          }}
        >
          {deal.tag.label}
        </span>
      )}
    </div>

    {/* Ligne de détail */}
    <div style={{ height: 14, marginTop: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
      {deal.dpe && (
        <span
          style={{
            width: 24, height: 13, borderRadius: 4, flexShrink: 0,
            background: deal.dpe.bg, color: deal.dpe.color,
            fontSize: 8, fontWeight: 700, letterSpacing: '0.3px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {`DPE ${deal.dpe.letter}`}
        </span>
      )}
      <span
        style={{
          fontSize: 9.5, color: deal.metaColor ?? C.textSecondary,
          fontWeight: deal.metaColor ? 700 : 500, lineHeight: '14px', minWidth: 0, ...ELL, ...NUM,
          ...(deal.metaColor ? anim(A(`tx-fee-${j}`)) : {}),
        }}
      >
        {deal.meta}
      </span>
    </div>

    {/* Bandeau de réussite */}
    {deal.banner && (
      <div
        style={{
          height: 22, marginTop: 7, borderRadius: 7, background: deal.banner.bg,
          display: 'flex', alignItems: 'center', gap: 5, padding: '0 7px', boxSizing: 'border-box',
          ...anim(A(`tx-banner-${c}`)),
        }}
      >
        <Ico d={deal.banner.icon} size={11} color={deal.banner.color} sw={2.1} />
        <span
          style={{
            fontSize: 9.5, fontWeight: 700, color: deal.banner.color,
            lineHeight: '22px', minWidth: 0, ...ELL, ...NUM,
          }}
        >
          {deal.banner.text}
        </span>
      </div>
    )}
  </div>
  );
};

/* ── Colonne du pipeline ── */
const PipeColumn: React.FC<{ col: Column; animated: boolean; c: number }> = ({ col, animated, c }) => {
  const anim = makeAnim(animated);
  return (
  <div
    style={{
      flex: 1, minWidth: 0, height: COL_H, boxSizing: 'border-box',
      background: C.bgPage, border: `1px solid ${C.border}`,
      borderRadius: 13, padding: COL_PAD,
    }}
  >
    {/* En-tête de colonne */}
    <div style={{ height: COL_HEAD_H, marginBottom: 8, ...anim(A(`tx-colhead-${c}`)) }}>
      <div style={{ height: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 6, height: 6, borderRadius: 3, background: col.dot, flexShrink: 0 }} />
        <span
          style={{
            fontSize: 9.5, fontWeight: 700, letterSpacing: '1.1px',
            color: C.textSecondary, lineHeight: '14px', flex: 1, minWidth: 0, ...ELL,
          }}
        >
          {col.label}
        </span>
        <span
          style={{
            minWidth: 18, height: 14, borderRadius: 7, background: C.white,
            border: `1px solid ${C.border}`, boxSizing: 'border-box',
            fontSize: 8.5, fontWeight: 700, color: C.textSecondary,
            display: 'flex', alignItems: 'center', justifyContent: 'center', ...NUM,
          }}
        >
          {col.count}
        </span>
      </div>
      <div
        style={{
          fontSize: 10.5, fontWeight: 600, color: C.textMuted,
          lineHeight: '14px', marginTop: 4, paddingLeft: 12, ...NUM,
        }}
      >
        {col.amount}
      </div>
    </div>

    {/* Cartes */}
    <div style={{ height: COL_BODY_H, display: 'flex', flexDirection: 'column', gap: 8, overflow: 'hidden' }}>
      {col.deals.map((d, j) => (
        <DealCard key={d.title + d.place} deal={d} animated={animated} c={c} j={j} />
      ))}
    </div>
  </div>
  );
};

export const Transactions: React.FC<{ animated?: boolean }> = ({ animated = false }) => {
  const anim = makeAnim(animated);
  return (
  <div
    style={{
      width: W, height: H, position: 'relative', overflow: 'hidden',
      borderRadius: 18, fontFamily: F.body, background: C.bgApp, boxSizing: 'border-box',
    }}
  >
    {animated && <style>{CSS}</style>}

    {/* ══ Barre d'application ══ */}
    <div
      style={{
        height: HEADER_H, boxSizing: 'border-box', background: C.white,
        borderBottom: `1px solid ${C.border}`, padding: `0 ${PAD_X}px`,
        display: 'flex', alignItems: 'center',
      }}
    >
      <LockimmoLogo markSize={25} wordHeight={11} color={C.textPrimary} gap={9} />

      <div style={{ width: 1, height: 22, background: C.border, margin: '0 18px' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {NAV.map((n, i) => (
          <span
            key={n}
            style={{
              fontSize: 12, fontWeight: i === 0 ? 700 : 500,
              color: i === 0 ? C.accent : C.textSecondary,
              background: i === 0 ? C.accentLight : 'transparent',
              padding: '7px 12px', borderRadius: 8, lineHeight: '14px',
            }}
          >
            {n}
          </span>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      {/* Recherche */}
      <div
        style={{
          width: 190, height: 30, boxSizing: 'border-box', background: C.bgApp,
          border: `1px solid ${C.border}`, borderRadius: 8,
          display: 'flex', alignItems: 'center', gap: 7, padding: '0 10px',
        }}
      >
        <Ico d={P.search} size={13} color={C.textMuted} />
        <span style={{
          fontSize: 11, color: C.textMuted, lineHeight: '30px',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          Rechercher un bien…
        </span>
      </div>

      {/* Notifications */}
      <div style={{ position: 'relative', marginLeft: 16, marginRight: 16 }}>
        <Ico d={P.bell} size={17} color={C.textSecondary} sw={1.6} />
        <span
          style={{
            position: 'absolute', top: -2, right: -2, width: 7, height: 7,
            borderRadius: 4, background: C.accent, border: `1.5px solid ${C.white}`, boxSizing: 'content-box',
          }}
        />
      </div>

      {/* Compte */}
      <div
        style={{
          width: 28, height: 28, borderRadius: 14, background: C.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10.5, fontWeight: 700, color: C.white, letterSpacing: '0.3px',
        }}
      >
        MD
      </div>
    </div>

    {/* ══ Contenu ══ */}
    <div
      style={{
        height: H - HEADER_H, boxSizing: 'border-box',
        padding: `${PAD_TOP}px ${PAD_X}px ${PAD_BOTTOM}px`,
      }}
    >
      {/* ── En-tête d'écran ── */}
      <div
        style={{
          width: INNER_W, height: TITLE_H, marginBottom: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontFamily: F.display, fontSize: 22, fontWeight: 700, color: C.textPrimary, lineHeight: '26px' }}>
            Transactions
          </div>
          <div style={{ fontSize: 11, color: C.textSecondary, lineHeight: '13px', ...NUM }}>
            Agence Lyon Presqu'île · 30 biens sous mandat · 4 négociateurs
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Sélecteur de vue */}
          <div
            style={{
              height: 32, boxSizing: 'border-box', background: C.white,
              border: `1px solid ${C.border}`, borderRadius: 9, padding: 3,
              display: 'flex', alignItems: 'center', gap: 2,
            }}
          >
            {['Pipeline', 'Liste', 'Carte'].map((v, i) => (
              <span
                key={v}
                style={{
                  fontSize: 11, fontWeight: i === 0 ? 700 : 500,
                  color: i === 0 ? C.white : C.textSecondary,
                  background: i === 0 ? C.textPrimary : 'transparent',
                  padding: '5px 11px', borderRadius: 7, lineHeight: '14px',
                }}
              >
                {v}
              </span>
            ))}
          </div>

          {/* Période */}
          <div
            style={{
              height: 32, boxSizing: 'border-box', background: C.white,
              border: `1px solid ${C.border}`, borderRadius: 9, padding: '0 11px',
              display: 'flex', alignItems: 'center', gap: 7,
            }}
          >
            <Ico d={P.cal} size={13} color={C.textMuted} />
            <span style={{ fontSize: 11, fontWeight: 600, color: C.textSecondary, ...NUM }}>
              3e trimestre 2026
            </span>
          </div>

          {/* Action principale */}
          <div
            style={{
              height: 32, boxSizing: 'border-box', background: C.accent, borderRadius: 9,
              padding: '0 14px', display: 'flex', alignItems: 'center', gap: 7,
              boxShadow: '0 2px 8px rgba(255,135,83,0.28)',
            }}
          >
            <Ico d={P.plus} size={13} color={C.white} sw={2.2} />
            <span style={{ fontSize: 11.5, fontWeight: 700, color: C.white }}>Nouveau mandat</span>
          </div>
        </div>
      </div>

      {/* ── KPI ── */}
      <div style={{ width: INNER_W, height: KPI_H, marginBottom: 12, display: 'flex', gap: 14 }}>
        {KPIS.map((k, i) => (
          <div
            key={k.label}
            style={{
              flex: 1, minWidth: 0, height: KPI_H, boxSizing: 'border-box',
              background: C.white, border: `1px solid ${C.border}`, borderRadius: 12,
              boxShadow: SHADOW, padding: '12px 14px', position: 'relative',
              ...anim(A(`tx-kpi-${i}`)),
            }}
          >
            <div
              style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.9px',
                color: C.textMuted, lineHeight: '12px', paddingRight: 46, ...ELL,
              }}
            >
              {k.label}
            </div>
            <div
              style={{
                fontFamily: F.display, fontSize: 27, fontWeight: 700,
                color: C.textPrimary, lineHeight: '30px', marginTop: 1, ...NUM,
              }}
            >
              {k.value}
            </div>
            <div style={{ fontSize: 10.5, color: C.textSecondary, lineHeight: '13px', ...ELL, ...NUM }}>
              {k.sub}
            </div>

            <span
              style={{
                position: 'absolute', top: 11, right: 12,
                fontSize: 9.5, fontWeight: 700, color: k.chipColor, background: k.chipBg,
                padding: '3px 7px', borderRadius: 6, lineHeight: '12px', ...NUM,
              }}
            >
              {k.chip}
            </span>
          </div>
        ))}
      </div>

      {/* ── Intitulé du pipeline ── */}
      <div
        style={{
          width: INNER_W, height: PIPE_LABEL_H, marginBottom: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          ...anim(A('tx-head')),
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: F.display, fontSize: 14, fontWeight: 700, color: C.textPrimary }}>
            Pipeline de vente
          </span>
          <span style={{ fontSize: 11, color: C.textMuted, ...NUM }}>
            37 affaires · 13,8 M€ de volume · mis à jour à l'instant
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Ico d={P.shield} size={12} color={C.success} sw={1.9} />
          <span style={{ fontSize: 10, fontWeight: 700, color: C.success, letterSpacing: '0.2px' }}>
            Signature électronique certifiée eIDAS
          </span>
        </div>
      </div>

      {/* ── Pipeline (point focal) ── */}
      <div style={{ width: INNER_W, height: COL_H, display: 'flex', gap: 12 }}>
        {COLUMNS.map((col, c) => (
          <PipeColumn key={col.label} col={col} animated={animated} c={c} />
        ))}
      </div>
    </div>
  </div>
  );
};
