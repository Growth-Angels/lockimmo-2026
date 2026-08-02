import React from 'react';
import { C, F } from '../../../tokens';

/**
 * Motion — LOCK'Académie : plateforme de formation en ligne
 * Format 4:3 (640×480), boucle infinie de 12 s, 100 % CSS (pas de JS de timing).
 *
 * Technique de boucle : marquee classique. La série de 6 vignettes est rendue
 * DEUX fois dans une piste de largeur fixe (2 × SERIES) ; la piste est animée
 * de translateX(0) à translateX(-50%) en `linear`. Au bouclage, la vignette i
 * de la 2e copie occupe exactement la place de la vignette i de la 1re : le
 * raccord est invisible.
 *
 * Mise en avant au centre : comme pour les autres motions, AUCUN animation-delay.
 * Le décalage est encodé DANS les pourcentages des keyframes — la position de
 * chaque vignette est une fonction affine du temps, donc l'instant où elle passe
 * au centre est calculable, et la « bosse » de scale est échantillonnée sur tout
 * le cycle. Les vignettes i et i+6 partagent les mêmes keyframes (leur passage
 * au centre est décalé d'exactement un cycle entier).
 */

const W = 640;
const H = 480;

const CARD_W = 172;
const CARD_H = 170;
const GAP = 18;
const PITCH = CARD_W + GAP;              // 190

const BAND_TOP = 140;
const BAND_H = 226;
const CARD_TOP = (BAND_H - CARD_H) / 2;  // 28
const FADE_W = 72;

/** 6 formations en gestion locative. */
const COURSES = [
  { title: 'Rédiger un bail conforme',      duration: '4:12', progress: 100 },
  { title: 'Gérer un impayé sans conflit',  duration: '6:38', progress: 65 },
  { title: 'Révision annuelle du loyer',    duration: '3:24', progress: 40 },
  { title: 'Établir un état des lieux',     duration: '5:07', progress: 100 },
  { title: 'Optimiser la fiscalité LMNP',   duration: '8:15', progress: 25 },
  { title: 'Déclarer un sinistre habitation', duration: '4:48', progress: 80 },
];

const N = COURSES.length;
const SERIES = N * PITCH;                // 1140 — translation exacte de -50 %

/* ── Mise en avant : bosse en cosinus surélevé autour du passage au centre ── */
const HL_W = 0.16;    // demi-largeur de la bosse, en fraction de cycle
const HL_SCALE = 0.055;
const HL_LIFT = 7;    // px

/** Vignette i au centre du cadre (x = W/2) quand t = (PITCH*i - (W/2 - CARD_W/2)) / SERIES. */
const centerPhase = (i: number) => {
  const raw = (PITCH * i - (W / 2 - CARD_W / 2)) / SERIES;
  return ((raw % 1) + 1) % 1;
};

const bump = (t: number, p: number) => {
  let d = Math.abs(t - p);
  if (d > 0.5) d = 1 - d;               // distance circulaire
  if (d >= HL_W) return 0;
  return 0.5 * (1 + Math.cos((Math.PI * d) / HL_W));
};

const highlightKeyframes = (i: number) => {
  const p = centerPhase(i);
  const stops = new Set<number>();
  for (let k = 0; k <= 25; k++) stops.add(k * 4);            // échantillonnage régulier
  stops.add(Number((p * 100).toFixed(2)));                    // sommet exact
  const frames = Array.from(stops)
    .sort((a, b) => a - b)
    .map((s) => {
      const f = bump(s / 100, p);
      const scale = (1 + HL_SCALE * f).toFixed(4);
      const lift = (HL_LIFT * f).toFixed(2);
      const sy = (6 + 10 * f).toFixed(1);
      const sb = (18 + 16 * f).toFixed(1);
      const sa = (0.05 + 0.08 * f).toFixed(3);
      return `  ${s}% { transform: translateY(-${lift}px) scale(${scale}); box-shadow: 0 ${sy}px ${sb}px rgba(53,50,48,${sa}); }`;
    })
    .join('\n');
  return `@keyframes acad-hl-${i} {\n${frames}\n}`;
};

const CSS = `
@keyframes acad-scroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
${COURSES.map((_, i) => highlightKeyframes(i)).join('\n')}
`;

const PlayGlyph: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M9 6.8l9 5.2-9 5.2z" />
  </svg>
);

const Thumbnail: React.FC<{ index: number; duration: string }> = ({ index, duration }) => (
  <div style={{
    position: 'relative', width: '100%', height: 86, borderRadius: 10,
    overflow: 'hidden', border: `1px solid ${C.border}`,
    background: `linear-gradient(140deg, ${C.accentSubtle} 0%, ${C.bgPage} 55%, ${C.accentLight} 100%)`,
  }}>
    {/* Numéro de module */}
    <div style={{
      position: 'absolute', top: 6, left: 6,
      background: 'rgba(255,255,255,0.82)', color: C.textSecondary,
      fontSize: 8, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase',
      padding: '2px 6px', borderRadius: 5,
    }}>
      {`Module ${String(index + 1).padStart(2, '0')}`}
    </div>

    {/* Bouton play */}
    <div style={{
      position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
      width: 32, height: 32, borderRadius: '50%', background: C.accent,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 5px 14px rgba(255,135,83,0.38)',
    }}>
      <PlayGlyph size={15} color="#fff" />
    </div>

    {/* Durée */}
    <div style={{
      position: 'absolute', right: 6, bottom: 6,
      background: 'rgba(14,12,11,0.55)', color: C.white,
      fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 5,
    }}>
      {duration}
    </div>
  </div>
);

const Card: React.FC<{ index: number; keyIndex: number }> = ({ index, keyIndex }) => {
  const c = COURSES[index];
  const done = c.progress >= 100;
  return (
    <div style={{
      width: CARD_W, height: CARD_H, flexShrink: 0, marginRight: GAP,
      background: C.white, borderRadius: 14, border: `1px solid ${C.border}`,
      padding: 10, boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column',
      boxShadow: '0 6px 18px rgba(53,50,48,0.05)',
      animation: `acad-hl-${keyIndex} 12s linear 0s infinite both`,
    }}>
      <Thumbnail index={index} duration={c.duration} />

      {/* Titre de la formation (1-2 lignes) */}
      <div style={{
        marginTop: 9, height: 32, overflow: 'hidden',
        fontSize: 12.5, lineHeight: '16px', fontWeight: 600,
        color: C.textPrimary, letterSpacing: '-0.1px',
      }}>
        {c.title}
      </div>

      {/* Progression */}
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          flex: 1, height: 4, borderRadius: 3,
          background: C.bgApp, overflow: 'hidden',
        }}>
          <div style={{
            width: `${c.progress}%`, height: '100%', borderRadius: 3,
            background: done ? C.success : C.accent,
          }} />
        </div>
        {done ? (
          <div style={{
            width: 14, height: 14, borderRadius: '50%', background: C.successLight,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={C.success} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        ) : (
          <span style={{
            width: 26, textAlign: 'right', flexShrink: 0,
            fontSize: 9.5, fontWeight: 700, color: C.textMuted,
          }}>
            {`${c.progress}%`}
          </span>
        )}
      </div>
    </div>
  );
};

export const Academie: React.FC = () => (
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
        LOCK'Académie
      </div>
      <div style={{ fontFamily: F.display, fontSize: 25, fontWeight: 700, color: C.textPrimary, letterSpacing: '-0.4px' }}>
        Progressez à votre rythme
      </div>
    </div>

    {/* Bande de vignettes défilantes */}
    <div style={{
      position: 'absolute', left: 0, right: 0, top: BAND_TOP, height: BAND_H,
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', left: 0, top: CARD_TOP,
        width: SERIES * 2, display: 'flex', alignItems: 'flex-start',
        animation: 'acad-scroll 12s linear 0s infinite both',
      }}>
        {/* Série dupliquée : la translation de -50 % boucle sans couture */}
        {COURSES.map((_, i) => <Card key={`a-${i}`} index={i} keyIndex={i} />)}
        {COURSES.map((_, i) => <Card key={`b-${i}`} index={i} keyIndex={i} />)}
      </div>

      {/* Fondus latéraux */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: FADE_W, pointerEvents: 'none',
        background: `linear-gradient(90deg, ${C.bgApp} 0%, rgba(237,233,229,0.86) 42%, rgba(237,233,229,0) 100%)`,
      }} />
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: FADE_W, pointerEvents: 'none',
        background: `linear-gradient(270deg, ${C.bgApp} 0%, rgba(237,233,229,0.86) 42%, rgba(237,233,229,0) 100%)`,
      }} />
    </div>

    {/* Badge de synthèse */}
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 36,
      display: 'flex', justifyContent: 'center',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 9,
        background: C.white, border: `1px solid ${C.border}`,
        padding: '9px 18px', borderRadius: 30,
        boxShadow: '0 6px 20px rgba(53,50,48,0.08)',
      }}>
        <div style={{
          width: 18, height: 18, borderRadius: '50%', background: C.accentLight,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <PlayGlyph size={11} color={C.accent} />
        </div>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: C.textPrimary }}>
          24 modules · accès illimité
        </span>
      </div>
    </div>
  </div>
);
