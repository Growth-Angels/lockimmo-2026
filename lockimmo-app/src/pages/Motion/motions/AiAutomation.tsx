import React from 'react';
import { C, F } from '../../../tokens';

/**
 * Motion — IA / Automatisation des tâches répétitives
 * Format 4:3 (640×480), boucle infinie de 5 s, 100 % CSS.
 *
 * Même convention que DataTransfer : le décalage entre lignes est encodé DANS
 * les keyframes (jamais via animation-delay), pour que tous les éléments
 * partagent la même phase de boucle et se réinitialisent ensemble.
 */

const W = 640;
const H = 480;

const CARD_X = 160;
const CARD_W = 320;
const CARD_Y = 139;
const CARD_PAD = 15;
const ROW_H = 34;

/** Tâches récurrentes de gestion locative. */
const TASKS = [
  'Quittances de loyer',
  'Relances d’impayés',
  'Appels de charges',
  'Révisions de loyer',
  'Rapprochements bancaires',
];

const CARD_H = CARD_PAD * 2 + TASKS.length * ROW_H;
const SCAN_TRAVEL = (TASKS.length - 1) * ROW_H;

const START = 14; // % — traitement de la 1re tâche
const STEP = 8;   // % — écart entre deux tâches
const HOLD = 88;  // % — fin du maintien
const RESET = 94; // % — tout est revenu à l'état initial

const CSS = `
${TASKS.map((_, i) => {
  const s = START + i * STEP;
  return `
@keyframes ai-pending-${i} {
  0%, ${s}%          { opacity: 1; transform: translateY(0); }
  ${s + 5}%          { opacity: 0; transform: translateY(-5px); }
  ${HOLD}%           { opacity: 0; transform: translateY(-5px); }
  ${RESET}%, 100%    { opacity: 1; transform: translateY(0); }
}
@keyframes ai-done-${i} {
  0%, ${s + 2}%      { opacity: 0; transform: translateY(6px) scale(.9); animation-timing-function: cubic-bezier(.2,.8,.3,1); }
  ${s + 8}%          { opacity: 1; transform: translateY(0) scale(1); }
  ${HOLD}%           { opacity: 1; transform: translateY(0) scale(1); }
  ${RESET}%, 100%    { opacity: 0; transform: translateY(6px) scale(.9); }
}
@keyframes ai-flash-${i} {
  0%, ${s}%          { opacity: 0; }
  ${s + 3}%          { opacity: 1; }
  ${s + 12}%, 100%   { opacity: 0; }
}
@keyframes ai-accent-${i} {
  0%, ${s + 2}%      { opacity: 0; transform: scaleY(.2); }
  ${s + 8}%          { opacity: 1; transform: scaleY(1); }
  ${HOLD}%           { opacity: 1; transform: scaleY(1); }
  ${RESET}%, 100%    { opacity: 0; transform: scaleY(.2); }
}`;
}).join('')}
@keyframes ai-scan {
  0%, 10%      { opacity: 0; transform: translateY(0); }
  ${START}%    { opacity: 1; transform: translateY(0); animation-timing-function: cubic-bezier(.45,0,.55,1); }
  ${START + STEP * (TASKS.length - 1)}% { opacity: 1; transform: translateY(${SCAN_TRAVEL}px); }
  ${START + STEP * (TASKS.length - 1) + 6}%, 100% { opacity: 0; transform: translateY(${SCAN_TRAVEL}px); }
}
@keyframes ai-halo {
  0%, 8%       { opacity: 0; transform: scale(.75); }
  16%          { opacity: .45; transform: scale(1.15); }
  26%          { opacity: 0; transform: scale(1.55); }
  30%          { opacity: 0; transform: scale(.75); }
  38%          { opacity: .45; transform: scale(1.15); }
  48%          { opacity: 0; transform: scale(1.55); }
  52%, 100%    { opacity: 0; transform: scale(.75); }
}
@keyframes ai-spark {
  0%, 10%      { opacity: 0; transform: scale(.4) rotate(0deg); }
  20%          { opacity: 1; transform: scale(1) rotate(35deg); }
  46%          { opacity: 1; transform: scale(1) rotate(75deg); }
  56%, 100%    { opacity: 0; transform: scale(.4) rotate(110deg); }
}
@keyframes ai-badge {
  0%, 60%      { opacity: 0; transform: translateY(8px) scale(.92); animation-timing-function: cubic-bezier(.2,.8,.3,1); }
  66%          { opacity: 1; transform: translateY(0) scale(1); }
  ${HOLD - 2}% { opacity: 1; transform: translateY(0) scale(1); }
  ${RESET}%, 100% { opacity: 0; transform: translateY(0) scale(.98); }
}
`;

const Sparkle: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2.5l2.1 5.9 5.9 2.1-5.9 2.1-2.1 5.9-2.1-5.9L4 10.5l5.9-2.1z" />
  </svg>
);

export const AiAutomation: React.FC = () => (
  <div style={{
    width: W, height: H, position: 'relative', overflow: 'hidden',
    background: C.bgApp, borderRadius: 18, fontFamily: F.body,
  }}>
    <style>{CSS}</style>

    {/* Noyau IA */}
    <div style={{
      position: 'absolute', left: '50%', top: 73, transform: 'translateX(-50%)',
      width: 46, height: 46,
    }}>
      {/* Halo pulsé */}
      <div style={{
        position: 'absolute', inset: -6, borderRadius: '50%',
        border: `2px solid ${C.accent}`,
        animation: 'ai-halo 5s ease-out 0s infinite both',
      }} />
      {/* Pastille */}
      <div style={{
        width: 46, height: 46, borderRadius: '50%', background: C.accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 8px 22px rgba(255,135,83,0.32)',
      }}>
        <Sparkle size={22} color="#fff" />
      </div>
      {/* Étincelles satellites */}
      <div style={{ position: 'absolute', top: -4, right: -10, animation: 'ai-spark 5s ease-in-out 0s infinite both' }}>
        <Sparkle size={11} color={C.accent} />
      </div>
      <div style={{ position: 'absolute', bottom: -2, left: -11, animation: 'ai-spark 5s ease-in-out 0s infinite both' }}>
        <Sparkle size={8} color={C.accentSoft} />
      </div>
      {/* Étiquette IA */}
      <div style={{
        position: 'absolute', top: 52, left: '50%', transform: 'translateX(-50%)',
        fontSize: 10, fontWeight: 700, letterSpacing: '1px',
        color: C.accent, whiteSpace: 'nowrap',
      }}>
        IA
      </div>
    </div>

    {/* Carte des tâches */}
    <div style={{
      position: 'absolute', left: CARD_X, top: CARD_Y, width: CARD_W, height: CARD_H,
      background: C.white, borderRadius: 14, border: `1px solid ${C.border}`,
      padding: CARD_PAD, boxSizing: 'border-box',
      boxShadow: '0 10px 30px rgba(53,50,48,0.06)',
    }}>
      {/* Faisceau de balayage */}
      <div style={{
        position: 'absolute', left: 1, right: 1, top: CARD_PAD, height: ROW_H,
        borderRadius: 8, pointerEvents: 'none',
        background: `linear-gradient(90deg, rgba(255,135,83,0) 0%, rgba(255,135,83,.14) 50%, rgba(255,135,83,0) 100%)`,
        borderTop: `1px solid ${C.accentSoft}`,
        borderBottom: `1px solid ${C.accentSoft}`,
        animation: 'ai-scan 5s linear 0s infinite both',
      }} />

      {TASKS.map((task, i) => (
        <div key={i} style={{
          position: 'relative', height: ROW_H,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          {/* Flash au passage de l'IA */}
          <div style={{
            position: 'absolute', left: -7, right: -7, top: 2, bottom: 2, borderRadius: 8,
            background: 'rgba(255,135,83,0.10)', pointerEvents: 'none',
            animation: `ai-flash-${i} 5s linear 0s infinite both`,
          }} />
          {/* Liseré orange une fois automatisé */}
          <div style={{
            position: 'absolute', left: -7, top: 6, bottom: 6, width: 2.5, borderRadius: 2,
            background: C.accent,
            animation: `ai-accent-${i} 5s cubic-bezier(.2,.8,.3,1) 0s infinite both`,
          }} />

          <span style={{ flex: 1, fontSize: 12, color: C.textPrimary, position: 'relative' }}>
            {task}
          </span>

          {/* Statut : les deux pastilles se croisent au même endroit */}
          <div style={{ position: 'relative', width: 92, height: 20, flexShrink: 0 }}>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 600, color: C.textMuted,
              background: C.bgApp, borderRadius: 20,
              animation: `ai-pending-${i} 5s linear 0s infinite both`,
            }}>
              En attente
            </div>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              fontSize: 10, fontWeight: 700, color: C.success,
              background: C.successLight, borderRadius: 20,
              animation: `ai-done-${i} 5s linear 0s infinite both`,
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.success} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Automatisé
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Badge de synthèse */}
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 79,
      display: 'flex', justifyContent: 'center',
      animation: 'ai-badge 5s linear 0s infinite both',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 9,
        background: C.white, border: `1px solid ${C.border}`,
        padding: '9px 18px', borderRadius: 30,
        boxShadow: '0 6px 20px rgba(53,50,48,0.08)',
      }}>
        <Sparkle size={14} color={C.accent} />
        <span style={{ fontSize: 12.5, fontWeight: 600, color: C.textPrimary }}>
          5 tâches traitées sans intervention
        </span>
      </div>
    </div>
  </div>
);
