import React from 'react';
import { C, F } from '../../../tokens';

/**
 * Motion — Transfert de données : Logiciel X → LOCKimmo
 * Format 4:3 (640×480), boucle infinie de 5 s, 100 % CSS (pas de JS de timing).
 */

const W = 640;
const H = 480;

const CARD_W = 186;
const CARD_H = 244;
const CARD_Y = 89;
const LEFT_X = 52;
const RIGHT_X = W - 52 - CARD_W;          // 402
const TRAVEL = RIGHT_X - (LEFT_X + CARD_W); // 164 px parcourus par les paquets

/** 5 enregistrements : largeur de la barre source + libellé structuré à l'arrivée. */
const ROWS = [
  { srcW: 104, label: 'Locataires',   tag: '24' },
  { srcW: 82,  label: 'Baux',         tag: '18' },
  { srcW: 116, label: 'Quittances',   tag: '96' },
  { srcW: 70,  label: 'Propriétaires', tag: '12' },
  { srcW: 94,  label: 'Mandats',      tag: '11' },
];

/**
 * Le décalage entre lignes est encodé DANS les keyframes (et non via animation-delay) :
 * tous les éléments partagent ainsi la même phase de boucle et se réinitialisent
 * ensemble — sinon des restes du cycle précédent cohabitent avec les nouveaux paquets.
 * Ligne i : son action démarre à START + i * STEP (en % du cycle de 5 s).
 */
const START = 12; // %
const STEP = 7;   // %
const HOLD = 88;  // % — fin du maintien, début du fondu de reset
const RESET = 94; // % — tout est masqué, prêt pour le cycle suivant

const CSS = `
${ROWS.map((_, i) => {
  const s = START + i * STEP;
  return `
@keyframes mt-pkt-${i} {
  0%, ${s}%          { opacity: 0; transform: translateX(0) scale(.4); animation-timing-function: cubic-bezier(.4,0,.2,1); }
  ${s + 3}%          { opacity: 1; transform: translateX(10px) scale(1); animation-timing-function: cubic-bezier(.55,0,.35,1); }
  ${s + 13}%         { opacity: 1; transform: translateX(${TRAVEL - 10}px) scale(1); }
  ${s + 16}%, 100%   { opacity: 0; transform: translateX(${TRAVEL}px) scale(.4); }
}
@keyframes mt-src-${i} {
  0%, ${s}%          { opacity: 1; transform: translateX(0); }
  ${s + 8}%          { opacity: .16; transform: translateX(8px); }
  ${HOLD}%           { opacity: .16; transform: translateX(8px); }
  ${RESET}%, 100%    { opacity: 1; transform: translateX(0); }
}
@keyframes mt-dst-${i} {
  0%, ${s + 13}%     { opacity: 0; transform: translateX(-8px); animation-timing-function: cubic-bezier(.2,.8,.3,1); }
  ${s + 18}%         { opacity: 1; transform: translateX(0); }
  ${HOLD}%           { opacity: 1; transform: translateX(0); }
  ${RESET}%, 100%    { opacity: 0; transform: translateX(-8px); }
}`;
}).join('')}
@keyframes mt-badge {
  0%, 58%      { opacity: 0; transform: translateY(8px) scale(.92); animation-timing-function: cubic-bezier(.2,.8,.3,1); }
  64%          { opacity: 1; transform: translateY(0) scale(1); }
  ${HOLD - 2}% { opacity: 1; transform: translateY(0) scale(1); }
  ${RESET}%, 100% { opacity: 0; transform: translateY(0) scale(.98); }
}
@keyframes mt-flow  { to { stroke-dashoffset: -28; } }
@keyframes mt-pulse {
  0%, 56%      { opacity: 0; transform: scale(.92); }
  63%          { opacity: .5; transform: scale(1.14); }
  73%, 100%    { opacity: 0; transform: scale(1.26); }
}
`;

const Row: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ height: 30, display: 'flex', alignItems: 'center', ...style }}>{children}</div>
);

export const DataTransfer: React.FC = () => (
  <div style={{
    width: W, height: H, position: 'relative', overflow: 'hidden',
    background: C.bgApp, borderRadius: 18, fontFamily: F.body,
  }}>
    <style>{CSS}</style>

    {/* Trait de liaison animé */}
    <svg width={TRAVEL} height="2" style={{ position: 'absolute', left: LEFT_X + CARD_W, top: CARD_Y + CARD_H / 2 }}>
      <line
        x1="0" y1="1" x2={TRAVEL} y2="1"
        stroke={C.accentSoft} strokeWidth="2" strokeLinecap="round"
        strokeDasharray="5 9"
        style={{ animation: 'mt-flow 0.9s linear infinite' }}
      />
    </svg>

    {/* ── Carte source : Logiciel X ── */}
    <div style={{
      position: 'absolute', left: LEFT_X, top: CARD_Y, width: CARD_W, height: CARD_H,
      background: C.white, borderRadius: 14, border: `1px solid ${C.border}`,
      padding: '16px 16px 0', boxSizing: 'border-box',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 16 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 8, background: '#E6E1DC',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9A918A" strokeWidth="2.2" strokeLinecap="round">
            <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </div>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: C.textSecondary }}>Logiciel X</div>
      </div>

      {ROWS.map((r, i) => (
        <Row key={i} style={{ animation: `mt-src-${i} 5s linear 0s infinite both` }}>
          <div style={{ height: 7, width: r.srcW, borderRadius: 4, background: '#D9D3CE' }} />
        </Row>
      ))}
    </div>

    {/* ── Paquets en transit ── */}
    {ROWS.map((_, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: LEFT_X + CARD_W - 6,
          top: CARD_Y + 58 + i * 30 + 11,
          width: 12, height: 8, borderRadius: 4,
          background: C.accent,
          boxShadow: `0 0 0 4px rgba(255,135,83,0.16)`,
          animation: `mt-pkt-${i} 5s linear 0s infinite both`,
        }}
      />
    ))}

    {/* ── Carte cible : LOCKimmo ── */}
    <div style={{
      position: 'absolute', left: RIGHT_X, top: CARD_Y, width: CARD_W, height: CARD_H,
      background: C.white, borderRadius: 14, border: `1px solid ${C.accentSoft}`,
      padding: '16px 16px 0', boxSizing: 'border-box',
      boxShadow: '0 10px 30px rgba(255,135,83,0.13)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 16 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 8, background: C.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="11" width="14" height="9" rx="2" fill="white" />
            <path d="M8 11V7.5a4 4 0 018 0V11" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </div>
        <div style={{ fontFamily: F.display, fontSize: 13, fontWeight: 700, color: C.textPrimary }}>LOCKimmo</div>
      </div>

      {ROWS.map((r, i) => (
        <Row key={i} style={{
          justifyContent: 'space-between',
          animation: `mt-dst-${i} 5s linear 0s infinite both`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 5, height: 5, borderRadius: 3, background: C.accent }} />
            <span style={{ fontSize: 11.5, fontWeight: 500, color: C.textPrimary }}>{r.label}</span>
          </div>
          <span style={{
            fontSize: 10.5, fontWeight: 700, color: C.accent,
            background: C.accentLight, padding: '2px 7px', borderRadius: 20,
          }}>
            {r.tag}
          </span>
        </Row>
      ))}
    </div>

    {/* Halo de confirmation */}
    <div style={{
      position: 'absolute', left: RIGHT_X - 10, top: CARD_Y - 10,
      width: CARD_W + 20, height: CARD_H + 20, borderRadius: 20,
      border: `2px solid ${C.accent}`, pointerEvents: 'none',
      animation: 'mt-pulse 5s ease-out 0s infinite',
    }} />

    {/* Badge « transfert terminé » */}
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 95,
      display: 'flex', justifyContent: 'center',
      animation: 'mt-badge 5s cubic-bezier(.2,.8,.3,1) 0s infinite',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: C.white, border: `1px solid ${C.border}`,
        padding: '9px 18px', borderRadius: 30,
        boxShadow: '0 6px 20px rgba(53,50,48,0.08)',
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.success} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: C.textPrimary }}>Transfert terminé</span>
      </div>
    </div>
  </div>
);
