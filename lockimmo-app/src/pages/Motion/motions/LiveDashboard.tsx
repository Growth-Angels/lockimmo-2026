import React from 'react';
import { C, F } from '../../../tokens';

/**
 * Motion — Tableaux de bord financiers en temps réel
 * Format 4:3 (640×480), boucle infinie de 6 s, 100 % CSS (aucun JS de timing).
 *
 * Même convention que DataTransfer / AiAutomation : le décalage entre éléments est
 * encodé DANS les pourcentages des keyframes (jamais via animation-delay), pour que
 * tous les éléments partagent la même phase de boucle et se réinitialisent ensemble.
 * Seule exception : la pastille « EN DIRECT », qui pulse en continu sans état à réinitialiser.
 */

const W = 640;
const H = 480;

/* ── Carte « fenêtre d'app » ── */
const CARD_X = 56;
const CARD_Y = 126;
const CARD_W = 528;
const CARD_H = 306;
const PAD = 16;

/* ── Zone graphique ── */
const LINE_W = 320;
const BAR_W = 164;
const CHART_H = 148;

/* Repère du SVG à l'intérieur du panneau courbe (padding 12 + titre 14 + marge 8) */
const SVG_W = 296;
const SVG_H = 102;
const SVG_X = 12;
const SVG_Y = 34;

/* ── Timeline (en % d'un cycle de 6 s) ── */
const KPI_START = 6;
const KPI_STEP = 6;
const KPI_DUR = 6;
const DRAW_START = 22;
const DRAW_END = 62;
const BAR_START = 30;
const BAR_STEP = 4;
const BAR_DUR = 12;
const HOLD = 88;  // % — fin du maintien
const RESET = 94; // % — tout est revenu à l'état initial

/* ── Courbe : chemin lissé (Catmull-Rom → Bézier) sur 7 mois ──
   Longueur réelle mesurée hors ligne : 288,76 px → dasharray légèrement surestimé. */
const CURVE =
  'M8 64 C15.8 63 39.2 57.7 54.7 58 C70.3 58.3 85.8 68 101.3 66 ' +
  'C116.9 64 132.4 50.3 148 46 C163.6 41.7 179.1 42.7 194.7 40 ' +
  'C210.3 37.3 225.8 33.7 241.3 30 C256.9 26.3 280.2 20 288 18';
const CURVE_LEN = 292;
const AREA = `${CURVE} L288 82 L8 82 Z`;

/* Points échantillonnés à intervalle d'abscisse curviligne constant : le point
   lumineux suit exactement l'extrémité tracée par stroke-dashoffset. */
const DOT_PTS: [number, number][] = [
  [8, 64], [31.8, 60], [55.7, 58], [79.2, 63.2], [102.9, 65.7],
  [125.1, 56.6], [146.7, 46.4], [170.4, 42.5], [194.4, 40.1],
  [218, 35.4], [241.4, 30], [264.8, 24.1], [288, 18],
];

const MONTHS: [string, number][] = [
  ['JAN', 8], ['FÉV', 54.7], ['MAR', 101.3], ['AVR', 148],
  ['MAI', 194.7], ['JUIN', 241.3], ['JUIL', 288],
];

const GRID_Y = [10, 34, 58, 82];

type Kpi = {
  label: string;
  value?: string;
  ticks?: string[];
  delta: string;
  deltaColor: string;
};

const KPIS: Kpi[] = [
  { label: 'Revenus', ticks: ['22 140 €', '23 460 €', '24 800 €'], delta: '↗ +8,4 %', deltaColor: C.success },
  { label: 'Encaissé', value: '96,8 %', delta: '↗ +2,1 pts', deltaColor: C.success },
  { label: 'Impayés', value: '1 250 €', delta: '↘ −12 %', deltaColor: C.accent },
];

/** Mini histogramme : hauteur cible (max 78) + libellé de lot. */
const BARS: [number, string][] = [
  [30, 'L1'], [48, 'L2'], [38, 'L3'], [62, 'L4'], [78, 'L5'],
];
const BAR_SLOT = 30.5; // 5 barres de 18 px réparties sur 140 px

const CSS = `
${KPIS.map((_, i) => {
  const s = KPI_START + i * KPI_STEP;
  return `
@keyframes ld-kpi-${i} {
  0%, ${s}%          { opacity: 0; transform: translateY(9px); animation-timing-function: cubic-bezier(.2,.8,.3,1); }
  ${s + KPI_DUR}%    { opacity: 1; transform: translateY(0); }
  ${HOLD}%           { opacity: 1; transform: translateY(0); }
  ${RESET}%, 100%    { opacity: 0; transform: translateY(9px); }
}`;
}).join('')}
${BARS.map((_, i) => {
  const s = BAR_START + i * BAR_STEP;
  return `
@keyframes ld-bar-${i} {
  0%, ${s}%          { transform: scaleY(0); animation-timing-function: cubic-bezier(.2,.85,.3,1); }
  ${s + BAR_DUR}%    { transform: scaleY(1); }
  ${HOLD}%           { transform: scaleY(1); }
  ${RESET}%, 100%    { transform: scaleY(0); }
}
@keyframes ld-barlabel-${i} {
  0%, ${s}%          { opacity: 0; }
  ${s + BAR_DUR}%    { opacity: 1; }
  ${HOLD}%           { opacity: 1; }
  ${RESET}%, 100%    { opacity: 0; }
}`;
}).join('')}
@keyframes ld-line {
  0%, ${DRAW_START}%   { stroke-dashoffset: ${CURVE_LEN}; }
  ${DRAW_END}%         { stroke-dashoffset: 0; }
  ${HOLD}%             { stroke-dashoffset: 0; }
  ${RESET}%, 100%      { stroke-dashoffset: ${CURVE_LEN}; }
}
@keyframes ld-reveal {
  0%, ${DRAW_START}%   { transform: scaleX(0); }
  ${DRAW_END}%         { transform: scaleX(1); }
  ${HOLD}%             { transform: scaleX(1); }
  ${RESET}%, 100%      { transform: scaleX(0); }
}
@keyframes ld-dotmove {
${DOT_PTS.map(([x, y], k) => {
  const p = DRAW_START + ((DRAW_END - DRAW_START) * k) / (DOT_PTS.length - 1);
  const at = k === 0 ? `0%, ${DRAW_START}%` : k === DOT_PTS.length - 1 ? `${DRAW_END}%, 100%` : `${p.toFixed(2)}%`;
  return `  ${at} { transform: translate(${x}px, ${y}px); }`;
}).join('\n')}
}
@keyframes ld-dotfade {
  0%, ${DRAW_START - 1}%  { opacity: 0; }
  ${DRAW_START + 2}%      { opacity: 1; }
  ${DRAW_END - 2}%        { opacity: 1; }
  ${DRAW_END + 3}%, 100%  { opacity: 0; }
}
@keyframes ld-tick-0 {
  0%, 34%          { opacity: 1; }
  36%, 93%         { opacity: 0; }
  ${RESET}%, 100%  { opacity: 1; }
}
@keyframes ld-tick-1 {
  0%, 34%          { opacity: 0; }
  36%, 46%         { opacity: 1; }
  48%, 100%        { opacity: 0; }
}
@keyframes ld-tick-2 {
  0%, 46%          { opacity: 0; }
  48%, 93%         { opacity: 1; }
  ${RESET}%, 100%  { opacity: 0; }
}
@keyframes ld-badge {
  0%, ${DRAW_END}%     { opacity: 0; transform: translateY(6px) scale(.94); animation-timing-function: cubic-bezier(.2,.8,.3,1); }
  ${DRAW_END + 6}%     { opacity: 1; transform: translateY(0) scale(1); }
  ${HOLD}%             { opacity: 1; transform: translateY(0) scale(1); }
  ${RESET}%, 100%      { opacity: 0; transform: translateY(6px) scale(.94); }
}
@keyframes ld-live {
  0%          { transform: scale(1); opacity: .55; }
  70%, 100%   { transform: scale(2.7); opacity: 0; }
}
`;

const ANIM = (name: string, easing = 'linear') => `${name} 6s ${easing} 0s infinite both`;

const PanelTitle: React.FC<{ left: string; right?: string }> = ({ left, right }) => (
  <div style={{
    height: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8,
  }}>
    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.6px', color: C.textSecondary }}>{left}</span>
    {right && <span style={{ fontSize: 8.5, fontWeight: 500, color: C.textMuted }}>{right}</span>}
  </div>
);

export const LiveDashboard: React.FC = () => (
  <div style={{
    width: W, height: H, position: 'relative', overflow: 'hidden',
    background: C.bgApp, borderRadius: 18, fontFamily: F.body,
  }}>
    <style>{CSS}</style>

    {/* Titre */}
    <div style={{ position: 'absolute', top: 42, left: 0, right: 0, textAlign: 'center' }}>
      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '1.4px',
        color: C.textMuted, textTransform: 'uppercase', marginBottom: 7,
      }}>
        Pilotage
      </div>
      <div style={{ fontFamily: F.display, fontSize: 25, fontWeight: 700, color: C.textPrimary, letterSpacing: '-0.4px' }}>
        Vos chiffres, en temps réel
      </div>
    </div>

    {/* ── Fenêtre d'application ── */}
    <div style={{
      position: 'absolute', left: CARD_X, top: CARD_Y, width: CARD_W, height: CARD_H,
      background: C.white, borderRadius: 14, border: `1px solid ${C.border}`,
      boxShadow: '0 14px 36px rgba(53,50,48,0.09)',
      padding: PAD, boxSizing: 'border-box',
    }}>

      {/* En-tête de la fenêtre */}
      <div style={{
        height: 26, marginBottom: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 7, background: C.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round">
              <path d="M4 19V11M10 19V5M16 19v-6M22 19V8" />
            </svg>
          </div>
          <div style={{ fontFamily: F.display, fontSize: 13, fontWeight: 700, color: C.textPrimary }}>
            Tableau de bord
          </div>
          <div style={{ fontSize: 10.5, color: C.textMuted }}>· Portefeuille 2025</div>
        </div>

        {/* Indicateur EN DIRECT (pulsation continue, indépendante du cycle) */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: C.errorLight, padding: '5px 10px', borderRadius: 20,
        }}>
          <div style={{ position: 'relative', width: 6, height: 6, flexShrink: 0 }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%', background: C.error,
              animation: 'ld-live 1.5s ease-out 0s infinite',
            }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: C.error }} />
          </div>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.9px', color: C.error }}>
            EN DIRECT
          </span>
        </div>
      </div>

      {/* ── Rangée de KPI ── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        {KPIS.map((k, i) => (
          <div key={i} style={{
            flex: 1, height: 76, boxSizing: 'border-box',
            background: C.bgLight, border: `1px solid ${C.border}`, borderRadius: 10,
            padding: '11px 12px',
            animation: ANIM(`ld-kpi-${i}`),
          }}>
            <div style={{
              fontSize: 8.5, fontWeight: 700, letterSpacing: '1.1px',
              color: C.textMuted, textTransform: 'uppercase',
            }}>
              {k.label}
            </div>

            <div style={{ position: 'relative', height: 26, marginTop: 3 }}>
              {k.ticks
                ? k.ticks.map((t, j) => (
                    <div key={j} style={{
                      position: 'absolute', left: 0, top: 0,
                      fontFamily: F.display, fontSize: 19, fontWeight: 700,
                      lineHeight: '26px', color: C.textPrimary,
                      fontVariantNumeric: 'tabular-nums',
                      animation: ANIM(`ld-tick-${j}`),
                    }}>
                      {t}
                    </div>
                  ))
                : (
                  <div style={{
                    fontFamily: F.display, fontSize: 19, fontWeight: 700,
                    lineHeight: '26px', color: C.textPrimary,
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {k.value}
                  </div>
                )}
            </div>

            <div style={{
              fontSize: 9.5, fontWeight: 700, color: k.deltaColor,
              fontVariantNumeric: 'tabular-nums', marginTop: 1,
            }}>
              {k.delta}
            </div>
          </div>
        ))}
      </div>

      {/* ── Zone graphique ── */}
      <div style={{ display: 'flex', gap: 12, height: CHART_H }}>

        {/* Courbe principale */}
        <div style={{
          position: 'relative', width: LINE_W, height: CHART_H, boxSizing: 'border-box',
          background: C.bgLight, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12,
        }}>
          <PanelTitle left="Encaissements" right="7 derniers mois" />

          <svg width={SVG_W} height={SVG_H} style={{ display: 'block', overflow: 'visible' }}>
            <defs>
              <linearGradient id="ld-area-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.accent} stopOpacity="0.30" />
                <stop offset="100%" stopColor={C.accent} stopOpacity="0" />
              </linearGradient>
              <clipPath id="ld-area-clip">
                <rect
                  x="0" y="0" width={SVG_W} height={SVG_H}
                  style={{
                    transformBox: 'fill-box',
                    transformOrigin: 'left center',
                    animation: ANIM('ld-reveal'),
                  }}
                />
              </clipPath>
            </defs>

            {/* Grille */}
            {GRID_Y.map((y) => (
              <line key={y} x1="0" y1={y} x2={SVG_W} y2={y} stroke={C.border} strokeWidth="1" />
            ))}

            {/* Aire dégradée, révélée en même temps que le tracé */}
            <g clipPath="url(#ld-area-clip)">
              <path d={AREA} fill="url(#ld-area-grad)" />
            </g>

            {/* Courbe tracée progressivement */}
            <path
              d={CURVE}
              fill="none"
              stroke={C.accent}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={CURVE_LEN}
              style={{ animation: ANIM('ld-line') }}
            />

            {/* Libellés de mois */}
            {MONTHS.map(([m, x]) => (
              <text
                key={m} x={x} y={97} textAnchor="middle"
                fontSize="8" fontWeight="600" fill={C.textMuted} letterSpacing="0.4"
              >
                {m}
              </text>
            ))}
          </svg>

          {/* Point lumineux qui suit l'extrémité du tracé */}
          <div style={{
            position: 'absolute', left: SVG_X, top: SVG_Y, width: 0, height: 0,
            animation: ANIM('ld-dotfade'),
          }}>
            <div style={{ width: 0, height: 0, animation: ANIM('ld-dotmove') }}>
              <div style={{
                position: 'absolute', left: -5, top: -5, width: 10, height: 10, borderRadius: '50%',
                background: C.accent, border: `2px solid ${C.white}`,
                boxShadow: '0 0 0 5px rgba(255,135,83,0.18)',
              }} />
            </div>
          </div>

          {/* Annotation de tendance */}
          <div style={{
            position: 'absolute', left: SVG_X + 4, top: SVG_Y + 2,
            animation: ANIM('ld-badge'),
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: C.successLight, border: `1px solid ${C.border}`,
              padding: '3px 8px', borderRadius: 20,
            }}>
              <span style={{ fontSize: 8, color: C.success }}>▲</span>
              <span style={{
                fontSize: 9, fontWeight: 700, color: C.success, fontVariantNumeric: 'tabular-nums',
              }}>
                +18 % vs N-1
              </span>
            </div>
          </div>
        </div>

        {/* Mini histogramme */}
        <div style={{
          position: 'relative', width: BAR_W, height: CHART_H, boxSizing: 'border-box',
          background: C.bgLight, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12,
        }}>
          <PanelTitle left="Par lot" />

          <div style={{ position: 'relative', width: 140, height: 102 }}>
            {BARS.map(([h, label], i) => (
              <div key={label} style={{
                position: 'absolute', left: i * BAR_SLOT, bottom: 0, width: 18,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
              }}>
                <div style={{
                  width: 18, height: h, borderRadius: '4px 4px 2px 2px',
                  background: `linear-gradient(180deg, ${C.accent} 0%, ${C.accentSoft} 100%)`,
                  transformOrigin: 'bottom',
                  animation: ANIM(`ld-bar-${i}`),
                }} />
                <div style={{
                  fontSize: 8, fontWeight: 600, color: C.textMuted, marginTop: 5,
                  animation: ANIM(`ld-barlabel-${i}`),
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
