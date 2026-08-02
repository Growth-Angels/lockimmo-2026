import React from 'react';
import { C, F } from '../../../tokens';

/**
 * Motion — Support LOCKimmo : une conversation de chat qui se joue message par message.
 * Format 4:3 (640×480), boucle infinie de 7 s, 100 % CSS (aucun JS de timing).
 *
 * Même convention que DataTransfer / AiAutomation : le décalage temporel entre les
 * éléments est encodé DANS LES POURCENTAGES des keyframes — jamais via animation-delay.
 * Toutes les animations partagent donc la même phase (7s linear 0s infinite both) et se
 * réinitialisent ensemble : à RESET la conversation est entièrement vide.
 */

/**
 * AVATAR — remplacement trivial par une vraie photo.
 * Laisser `null` affiche le fallback (pastille dégradée avec les initiales « SL »).
 * Pour activer une photo : `import avatar from '../../../assets/support.jpg';`
 * puis `const AVATAR_PHOTO: string | null = avatar;` (une URL fonctionne aussi).
 */
const AVATAR_PHOTO: string | null = null;

const W = 640;
const H = 480;

const CARD_W = 452;
const CARD_X = (W - CARD_W) / 2; // 94
const CARD_Y = 77;
const HEADER_H = 52;
const PAD = 18;
const GAP = 12;
const CONTENT_TOP = CARD_Y + HEADER_H + 14; // 182

type Msg = {
  from: 'support' | 'client';
  text: string;
  slot: number;     // hauteur réservée à la ligne (bulle 1 ou 2 lignes)
  typeAt: number;   // % — apparition de l'indicateur de saisie
  bubbleAt: number; // % — l'indicateur cède la place à la bulle de texte
};

const MSGS: Msg[] = [
  { from: 'support', text: 'Bonjour, que puis-je faire pour vous ?',       slot: 42, typeAt: 4,  bubbleAt: 13 },
  { from: 'client',  text: 'J’ai un souci avec ma quittance n°398845-239', slot: 62, typeAt: 17, bubbleAt: 28 },
  { from: 'support', text: 'Très bien, on va regarder cela ensemble…',     slot: 62, typeAt: 32, bubbleAt: 44 },
  { from: 'client',  text: 'Merci !',                                      slot: 42, typeAt: 48, bubbleAt: 57 },
];

let cursor = CONTENT_TOP;
const ROW_TOPS = MSGS.map((m) => {
  const top = cursor;
  cursor += m.slot + GAP;
  return top;
});

const CARD_H = HEADER_H + 14 + MSGS.reduce((s, m) => s + m.slot + GAP, 0) - GAP + 16; // 326

const HOLD = 88;  // % — fin du maintien de la conversation complète
const RESET = 94; // % — tout est masqué, prêt pour le cycle suivant

/**
 * Pulsation des 3 points de saisie. Le rythme est étalé sur tout le cycle de 7 s
 * (période de 10 % ≈ 0,7 s) pour respecter la règle « une seule durée, aucun delay ».
 * Le décalage entre les points est encodé dans les pourcentages.
 */
const dotKeyframes = (d: number) => {
  const PERIOD = 10;
  const OFFSET = d * 2.2;
  const rest = '{ opacity: .26; transform: translateY(0); }';
  const up = '{ opacity: 1; transform: translateY(-3px); }';
  const stops: string[] = [];
  if (OFFSET > 0) stops.push(`0% ${rest}`);
  let last = OFFSET;
  for (let p = OFFSET; p <= 100.001; p += PERIOD) {
    stops.push(`${p.toFixed(2)}% ${rest}`);
    if (p + 4 <= 100) stops.push(`${(p + 4).toFixed(2)}% ${up}`);
    last = p;
  }
  if (last < 100) stops.push(`100% ${rest}`);
  return `@keyframes sc-dot-${d} {\n  ${stops.join('\n  ')}\n}`;
};

const CSS = `
${[0, 1, 2].map(dotKeyframes).join('\n')}
${MSGS.map((m, i) => `
@keyframes sc-av-${i} {
  0%, ${m.typeAt}%        { opacity: 0; transform: scale(.55); animation-timing-function: cubic-bezier(.2,.8,.3,1); }
  ${m.typeAt + 3}%        { opacity: 1; transform: scale(1); }
  ${HOLD}%                { opacity: 1; transform: scale(1); }
  ${RESET}%, 100%         { opacity: 0; transform: scale(.55); }
}
@keyframes sc-typ-${i} {
  0%, ${m.typeAt}%        { opacity: 0; transform: translateY(7px) scale(.82); animation-timing-function: cubic-bezier(.2,.8,.3,1); }
  ${m.typeAt + 3}%        { opacity: 1; transform: translateY(0) scale(1); }
  ${m.bubbleAt - 1}%      { opacity: 1; transform: translateY(0) scale(1); }
  ${m.bubbleAt + 1}%, 100% { opacity: 0; transform: translateY(0) scale(.82); }
}
@keyframes sc-bub-${i} {
  0%, ${m.bubbleAt}%      { opacity: 0; transform: translateY(8px) scale(.94); animation-timing-function: cubic-bezier(.2,.8,.3,1); }
  ${m.bubbleAt + 4}%      { opacity: 1; transform: translateY(0) scale(1); }
  ${HOLD}%                { opacity: 1; transform: translateY(0) scale(1); }
  ${RESET}%, 100%         { opacity: 0; transform: translateY(8px) scale(.94); }
}`).join('')}
`;

/** Avatar du support : vraie photo si AVATAR_PHOTO est renseigné, sinon fallback initiales. */
const Avatar: React.FC<{ size: number }> = ({ size }) => {
  if (AVATAR_PHOTO) {
    return (
      <img
        src={AVATAR_PHOTO}
        alt="Support LOCKimmo"
        style={{
          width: size, height: size, borderRadius: '50%',
          objectFit: 'cover', display: 'block', flexShrink: 0,
          border: `1px solid ${C.border}`,
        }}
      />
    );
  }
  return (
    <div
      aria-label="Support LOCKimmo"
      style={{
        width: size, height: size, borderRadius: '50%', flexShrink: 0,
        background: `linear-gradient(145deg, #FFA57A 0%, ${C.accent} 52%, #E86A38 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: C.white, fontFamily: F.display, fontWeight: 600,
        fontSize: Math.round(size * 0.38), letterSpacing: '0.2px',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), 0 2px 6px rgba(232,106,56,0.28)',
      }}
    >
      SL
    </div>
  );
};

/** Bulle des 3 points de saisie. */
const Typing: React.FC<{ support: boolean }> = ({ support }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '11px 13px',
    background: support ? C.white : C.accent,
    border: `1px solid ${support ? C.border : C.accent}`,
    borderRadius: support ? '14px 14px 14px 4px' : '14px 14px 4px 14px',
    boxShadow: support ? '0 2px 8px rgba(53,50,48,0.05)' : '0 4px 12px rgba(255,135,83,0.20)',
  }}>
    {[0, 1, 2].map((d) => (
      <span key={d} style={{
        width: 5, height: 5, borderRadius: '50%',
        background: support ? C.textMuted : C.white,
        animation: `sc-dot-${d} 7s linear 0s infinite both`,
      }} />
    ))}
  </div>
);

export const SupportChat: React.FC = () => (
  <div style={{
    width: W, height: H, position: 'relative', overflow: 'hidden',
    background: C.bgApp, borderRadius: 18, fontFamily: F.body,
  }}>
    <style>{CSS}</style>

    {/* Fenêtre de chat */}
    <div style={{
      position: 'absolute', left: CARD_X, top: CARD_Y, width: CARD_W, height: CARD_H,
      background: C.white, borderRadius: 16, border: `1px solid ${C.border}`,
      boxShadow: '0 12px 34px rgba(53,50,48,0.08)',
    }} />

    {/* En-tête de la fenêtre */}
    <div style={{
      position: 'absolute', left: CARD_X, top: CARD_Y, width: CARD_W, height: HEADER_H,
      boxSizing: 'border-box', padding: `0 ${PAD}px`,
      display: 'flex', alignItems: 'center', gap: 10,
      borderBottom: `1px solid ${C.border}`,
    }}>
      <Avatar size={30} />
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, lineHeight: 1.2 }}>
          Support LOCKimmo
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.success }} />
          <span style={{ fontSize: 10.5, fontWeight: 500, color: C.textSecondary }}>En ligne</span>
        </div>
      </div>
    </div>

    {/* Messages — indicateur de saisie puis bulle, dans l'ordre 1 → 4 */}
    {MSGS.map((m, i) => {
      const support = m.from === 'support';
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: CARD_X + PAD,
            width: CARD_W - PAD * 2,
            top: ROW_TOPS[i],
            display: 'flex',
            flexDirection: support ? 'row' : 'row-reverse',
            alignItems: 'flex-start',
            gap: 9,
          }}
        >
          {support && (
            <div style={{
              flexShrink: 0, marginTop: 5,
              animation: `sc-av-${i} 7s linear 0s infinite both`,
            }}>
              <Avatar size={28} />
            </div>
          )}

          <div style={{ position: 'relative', maxWidth: 330 }}>
            {/* Bulle de texte */}
            <div style={{
              padding: '10px 14px',
              fontSize: 13,
              lineHeight: 1.4,
              fontWeight: support ? 400 : 500,
              color: support ? C.textPrimary : C.white,
              background: support ? C.white : C.accent,
              border: `1px solid ${support ? C.border : C.accent}`,
              borderRadius: support ? '14px 14px 14px 4px' : '14px 14px 4px 14px',
              boxShadow: support ? '0 2px 8px rgba(53,50,48,0.05)' : '0 4px 14px rgba(255,135,83,0.22)',
              transformOrigin: support ? 'left bottom' : 'right bottom',
              animation: `sc-bub-${i} 7s linear 0s infinite both`,
            }}>
              {m.text}
            </div>

            {/* Indicateur de saisie, superposé au même emplacement */}
            <div style={{
              position: 'absolute', top: 0,
              ...(support ? { left: 0 } : { right: 0 }),
              transformOrigin: support ? 'left bottom' : 'right bottom',
              animation: `sc-typ-${i} 7s linear 0s infinite both`,
            }}>
              <Typing support={support} />
            </div>
          </div>
        </div>
      );
    })}
  </div>
);
