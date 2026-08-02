import React from 'react';
import { C, F } from '../../../tokens';

/**
 * Motion — Contrôle / Audit des pièces d'un dossier de gestion locative.
 * Format 4:3 (640×480), boucle infinie de 10 s, 100 % CSS (aucun JS de timing).
 *
 * Principe : une piste verticale défile vers le haut en continu. La liste est
 * rendue DEUX FOIS de suite (piste = 2 × la série) et animée de translateY(0)
 * à translateY(-50 %) en `linear` ⇒ raccord strictement invisible.
 *
 * Bascule de statut : la position d'une ligne est une fonction affine du temps,
 * l'instant de franchissement de la ligne de scan est donc calculable —
 * cf. `cross()` ci-dessous. Le décalage entre lignes est encodé DANS LES
 * POURCENTAGES des keyframes (jamais via animation-delay), pour que tous les
 * éléments partagent exactement la même phase de boucle.
 */

const W = 640;
const H = 480;

/* ── Fenêtre de défilement ── */
const VIEW_X = 120;
const VIEW_Y = 144;
const VIEW_W = 400;
const VIEW_H = 252;

/* ── Lignes ── */
const ROW_H = 42;          // pas vertical d'une ligne
const ROW_W = 372;         // largeur de la carte
const CARD_H = 36;
const FADE_H = 60;

/* ── Zone de scan (bande fixe, centrée dans la fenêtre) ── */
const BAND_H = 42;
const SCAN_Y = VIEW_H / 2; // 126 — ordonnée de la ligne de contrôle
const BAND_Y = SCAN_Y - BAND_H / 2;

/* ── Faisceau lumineux ── */
const BEAM_W = 110;
const BEAM_TRAVEL = VIEW_W + BEAM_W;

type Item = { label: string; flagged?: boolean };

/** 8 pièces de dossier ; 2 ressortent en anomalie (index 1 et 5). */
const ITEMS: Item[] = [
  { label: 'Bail — Appt. 3B' },
  { label: 'Attestation d’assurance', flagged: true },
  { label: 'Quittance mars 2026' },
  { label: 'Dépôt de garantie' },
  { label: 'Diagnostic DPE' },
  { label: 'Régularisation charges', flagged: true },
  { label: 'État des lieux d’entrée' },
  { label: 'Mandat de gestion' },
];

const SERIES_H = ITEMS.length * ROW_H; // 336 — hauteur d'une série
const TRACK_H = SERIES_H * 2;          // 672 — hauteur de la piste (2 séries)

/**
 * Instant (en % du cycle) où la ligne `i` franchit la ligne de scan.
 * Centre de la ligne dans la piste : i·ROW_H + ROW_H/2.
 * Piste à l'instant p : translateY(−p·SERIES_H) ⇒
 *   y_écran(p) = i·ROW_H + ROW_H/2 − p·SERIES_H  =  SCAN_Y
 *   ⇒ p = (i·ROW_H + ROW_H/2 − SCAN_Y) / SERIES_H   (modulo 1)
 * La copie `i + 8` franchit le scan exactement un cycle plus tard :
 * même valeur modulo 100 %, elle réutilise donc le même jeu de keyframes.
 * Valeurs obtenues ici : 68.75 / 81.25 / 93.75 / 6.25 / 18.75 / 31.25 / 43.75 / 56.25.
 */
const cross = (i: number) =>
  (((((i * ROW_H + ROW_H / 2 - SCAN_Y) / SERIES_H) * 100) % 100) + 100) % 100;

/**
 * Instant de remise à zéro du statut : exactement un demi-cycle après le
 * franchissement. À cet instant la ligne `i` est hors cadre (sortie par le haut
 * à c+43.75 %, la copie ne réapparaît par le bas qu'à c+56.25 %) : la bascule
 * inverse verte → neutre est donc strictement invisible.
 */
const reset = (c: number) => (c + 50) % 100;

const p = (n: number) => `${Math.round(n * 1000) / 1000}`;

const CSS = `
@keyframes as-scroll {
  0%   { transform: translateY(0); }
  100% { transform: translateY(-50%); }
}
@keyframes as-beam {
  0%        { transform: translateX(0); }
  22%, 25%  { transform: translateX(${BEAM_TRAVEL}px); }
  25.01%    { transform: translateX(0); }
  47%, 50%  { transform: translateX(${BEAM_TRAVEL}px); }
  50.01%    { transform: translateX(0); }
  72%, 75%  { transform: translateX(${BEAM_TRAVEL}px); }
  75.01%    { transform: translateX(0); }
  97%, 100% { transform: translateX(${BEAM_TRAVEL}px); }
}
${ITEMS.map((_, i) => {
  const c = cross(i);
  const r = reset(c);
  /* Éclair au passage sous la bande : toujours contenu dans [c, c+6.25] ⊂ [0,100]. */
  const flash = `
@keyframes as-flash-${i} {
  0%, ${p(c)}%                        { opacity: 0; }
  ${p(c + 1.5)}%                      { opacity: 1; }
  ${p(Math.min(c + 6.25, 99.99))}%, 100% { opacity: 0; }
}`;

  /* c < r : la ligne démarre le cycle EN DESSOUS du scan (état neutre). */
  if (c < r) return `
@keyframes as-in-${i} {
  0%, ${p(c)}%              { opacity: 0; }
  ${p(c + 3.5)}%            { opacity: 1; }
  ${p(r)}%                  { opacity: 1; }
  ${p(r + 0.01)}%, 100%     { opacity: 0; }
}
@keyframes as-out-${i} {
  0%, ${p(c)}%              { opacity: 1; }
  ${p(c + 3.5)}%            { opacity: 0; }
  ${p(r)}%                  { opacity: 0; }
  ${p(r + 0.01)}%, 100%     { opacity: 1; }
}
@keyframes as-pop-${i} {
  0%, ${p(c)}%              { transform: scale(.62); }
  ${p(c + 2.2)}%            { transform: scale(1.09); }
  ${p(c + 4.5)}%            { transform: scale(1); }
  ${p(r)}%                  { transform: scale(1); }
  ${p(r + 0.01)}%, 100%     { transform: scale(.62); }
}${flash}`;

  /* c > r : la ligne démarre le cycle AU-DESSUS du scan (déjà vérifiée). */
  return `
@keyframes as-in-${i} {
  0%, ${p(r)}%              { opacity: 1; }
  ${p(r + 0.01)}%           { opacity: 0; }
  ${p(c)}%                  { opacity: 0; }
  ${p(c + 3.5)}%, 100%      { opacity: 1; }
}
@keyframes as-out-${i} {
  0%, ${p(r)}%              { opacity: 0; }
  ${p(r + 0.01)}%           { opacity: 1; }
  ${p(c)}%                  { opacity: 1; }
  ${p(c + 3.5)}%, 100%      { opacity: 0; }
}
@keyframes as-pop-${i} {
  0%, ${p(r)}%              { transform: scale(1); }
  ${p(r + 0.01)}%           { transform: scale(.62); }
  ${p(c)}%                  { transform: scale(.62); }
  ${p(c + 2.2)}%            { transform: scale(1.09); }
  ${p(c + 4.5)}%, 100%      { transform: scale(1); }
}${flash}`;
}).join('')}
`;

const EASE = 'cubic-bezier(.2,.8,.3,1)';

const DocIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const Check: React.FC<{ size: number; color: string; width: number }> = ({ size, color, width }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/** Une ligne de contrôle. `i` = index dans la série (identique pour l'original et sa copie). */
const Line: React.FC<{ item: Item; i: number }> = ({ item, i }) => (
  <div style={{ height: ROW_H, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{
      position: 'relative', width: ROW_W, height: CARD_H,
      background: C.white, borderRadius: 10, border: `1px solid ${C.border}`,
      boxShadow: '0 2px 6px rgba(53,50,48,0.04)',
      display: 'flex', alignItems: 'center', gap: 9,
      padding: '0 11px', boxSizing: 'border-box',
    }}>
      {/* Teinte de la ligne une fois contrôlée */}
      <div style={{
        position: 'absolute', inset: -1, borderRadius: 11, boxSizing: 'border-box',
        background: item.flagged ? C.accentSubtle : C.successLight,
        border: `1px solid ${item.flagged ? C.accentSoft : 'rgba(40,165,102,0.22)'}`,
        pointerEvents: 'none',
        animation: `as-in-${i} 10s ${EASE} 0s infinite both`,
      }} />
      {/* Éclair au franchissement de la bande de scan */}
      <div style={{
        position: 'absolute', inset: -1, borderRadius: 11,
        background: 'rgba(255,135,83,0.18)', pointerEvents: 'none',
        animation: `as-flash-${i} 10s linear 0s infinite both`,
      }} />

      {/* Icône document */}
      <div style={{
        position: 'relative', width: 22, height: 22, borderRadius: 7, flexShrink: 0,
        background: C.bgApp, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <DocIcon />
      </div>

      {/* Libellé */}
      <span style={{
        position: 'relative', flex: 1, fontSize: 12, fontWeight: 500,
        color: C.textPrimary, whiteSpace: 'nowrap',
      }}>
        {item.label}
      </span>

      {/* Slot de statut : vide → coche verte / badge orange */}
      <div style={{ position: 'relative', width: 92, height: 22, flexShrink: 0 }}>
        {/* Avant scan : emplacement vide */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          animation: `as-out-${i} 10s ${EASE} 0s infinite both`,
        }}>
          <div style={{ width: 17, height: 17, borderRadius: '50%', border: `1.5px dashed ${C.borderStrong}` }} />
        </div>

        {/* Après scan : conforme ou à vérifier */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          transformOrigin: 'center right',
          animation: `as-in-${i} 10s ${EASE} 0s infinite both, as-pop-${i} 10s ${EASE} 0s infinite both`,
        }}>
          {item.flagged ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: C.accent, borderRadius: 20, padding: '3.5px 9px',
              boxShadow: '0 3px 9px rgba(255,135,83,0.30)',
            }}>
              <span style={{
                width: 12, height: 12, borderRadius: '50%', background: 'rgba(255,255,255,0.28)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 700, color: C.white, lineHeight: 1,
              }}>
                !
              </span>
              <span style={{ fontSize: 9.5, fontWeight: 700, color: C.white, letterSpacing: '0.1px' }}>
                À vérifier
              </span>
            </div>
          ) : (
            <div style={{
              width: 19, height: 19, borderRadius: '50%', background: C.success,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 3px 9px rgba(40,165,102,0.28)',
            }}>
              <Check size={10} color={C.white} width={3.6} />
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export const AuditScan: React.FC = () => (
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
        Contrôle
      </div>
      <div style={{ fontFamily: F.display, fontSize: 25, fontWeight: 700, color: C.textPrimary, letterSpacing: '-0.4px' }}>
        Chaque pièce est vérifiée
      </div>
    </div>

    {/* Fenêtre de défilement */}
    <div style={{
      position: 'absolute', left: VIEW_X, top: VIEW_Y,
      width: VIEW_W, height: VIEW_H, overflow: 'hidden',
    }}>
      {/* Piste : la série est rendue deux fois ⇒ translateY(-50%) reboucle sans couture */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: TRACK_H,
        animation: 'as-scroll 10s linear 0s infinite both',
      }}>
        {[...ITEMS, ...ITEMS].map((item, n) => (
          <Line key={n} item={item} i={n % ITEMS.length} />
        ))}
      </div>

      {/* Zone de scan fixe */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: BAND_Y, height: BAND_H,
        borderTop: `1.5px solid ${C.accent}`,
        borderBottom: `1.5px solid ${C.accent}`,
        background: 'linear-gradient(180deg, rgba(255,135,83,0.13) 0%, rgba(255,135,83,0.04) 50%, rgba(255,135,83,0.13) 100%)',
        boxShadow: '0 0 28px rgba(255,135,83,0.24)',
        overflow: 'hidden', pointerEvents: 'none',
      }}>
        {/* Faisceau lumineux balayant la bande */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: -BEAM_W, width: BEAM_W,
          background: 'linear-gradient(90deg, rgba(255,135,83,0) 0%, rgba(255,135,83,0.32) 50%, rgba(255,135,83,0) 100%)',
          animation: 'as-beam 10s linear 0s infinite both',
        }} />
      </div>

      {/* Repères de la ligne de contrôle */}
      <div style={{
        position: 'absolute', left: 4, top: SCAN_Y - 3, width: 6, height: 6,
        borderRadius: '50%', background: C.accent, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: 4, top: SCAN_Y - 3, width: 6, height: 6,
        borderRadius: '50%', background: C.accent, pointerEvents: 'none',
      }} />

      {/* Fondus haut / bas */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 0, height: FADE_H, pointerEvents: 'none',
        background: 'linear-gradient(180deg, #EDE9E5 0%, rgba(237,233,229,0) 100%)',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: FADE_H, pointerEvents: 'none',
        background: 'linear-gradient(0deg, #EDE9E5 0%, rgba(237,233,229,0) 100%)',
      }} />
    </div>

    {/* Badge permanent */}
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 36, display: 'flex', justifyContent: 'center' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 9,
        background: C.white, border: `1px solid ${C.border}`,
        padding: '9px 18px', borderRadius: 30,
        boxShadow: '0 6px 20px rgba(53,50,48,0.08)',
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.success} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.5l7.5 3v6c0 4.6-3.1 8.4-7.5 10-4.4-1.6-7.5-5.4-7.5-10v-6z" />
          <polyline points="9 12 11.2 14.2 15.4 9.6" />
        </svg>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: C.textPrimary }}>
          Conformité vérifiée en continu
        </span>
      </div>
    </div>
  </div>
);
