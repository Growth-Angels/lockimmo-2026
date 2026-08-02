import React from 'react';
import { C, F } from '../../../tokens';
import { LockimmoMark } from '../../../brand';

/**
 * Motion — Gestion de l'agenda.
 * Format 4:3 (640×480), boucle infinie de 10 s, 100 % CSS (aucun JS de timing).
 *
 * ── Approche : marquee bouclé + apparition séquentielle calculée ──
 * La journée est rendue DEUX FOIS de suite (piste = 2 × la série) et animée de
 * translateY(0) → translateY(-50 %) en `linear` : le raccord est strictement
 * invisible, le défilement parfaitement continu (aucun retour brutal).
 *
 * Chaque créneau existe d'abord à l'état « fantôme » (cadre pointillé) puis se
 * matérialise en événement complet lorsqu'il franchit la ligne « maintenant ».
 * La position d'une ligne étant une fonction affine du temps, l'instant de
 * franchissement est calculable — cf. `appear()`. Le décalage entre lignes est
 * donc encodé DANS LES POURCENTAGES des keyframes (jamais via animation-delay) :
 * tous les éléments partagent exactement la même phase de boucle.
 *
 * La bascule inverse (retour à l'état fantôme) est placée par `reset()` au
 * milieu de la fenêtre hors-cadre de la ligne : elle est donc invisible.
 */

const W = 640;
const H = 480;

/* ── Fenêtre applicative ── */
const WIN_X = 40;
const WIN_Y = 44;
const WIN_W = 560;
const WIN_H = 392;
const HEAD_H = 54;

/* ── Zone de défilement ── */
const VIEW_W = WIN_W;              // 560
const VIEW_H = WIN_H - HEAD_H;     // 338
const FADE_H = 44;

/* ── Colonne d'heures + rail ── */
const GUT = 62;

/* ── Lignes ── */
const ROW_H = 58;
const CARD_H = 50;
const CARD_L = GUT + 12;                    // 74
const CARD_W = VIEW_W - CARD_L - 16;        // 470

/* ── Ligne « maintenant » ──
 * TRIGGER = ordonnée du HAUT de la ligne au moment de sa matérialisation.
 * Choisi multiple de ROW_H (232 = 4 × 58) pour que tous les instants
 * `appear()` tombent sur un multiple exact du pas — condition nécessaire pour
 * qu'aucun d'eux ne déborde de la fenêtre [0 %, 100 % − FADE_IN]. */
const TRIGGER = 232;
const NOW_Y = TRIGGER + 4 + CARD_H / 2;     // 261 — centre de la carte au moment du pop

type Kind = 'edl' | 'visite' | 'signature' | 'reunion' | 'technique' | 'appel';
type Tag = 'confirme' | 'visio' | 'rappel';
type Ev = { h: string; d: string; title: string; sub: string; kind: Kind; tag?: Tag };

/** Pastille de couleur par type d'événement. */
const KIND_COLOR: Record<Kind, string> = {
  edl:       C.accent,
  visite:    C.info,
  signature: C.success,
  reunion:   C.purple,
  technique: C.error,
  appel:     C.textSecondary,
};

const TAGS: Record<Tag, { label: string; color: string; bg: string }> = {
  confirme: { label: 'Confirmé',    color: C.success,       bg: C.successLight },
  visio:    { label: 'Visio',       color: C.info,          bg: C.infoLight },
  rappel:   { label: 'Rappel auto', color: C.textSecondary, bg: C.bgApp },
};

/** Journée type d'un gestionnaire immobilier — 12 créneaux. */
const EVENTS: Ev[] = [
  { h: '08:30', d: '20 min', title: 'Réunion d’équipe',        sub: 'Agence — salle Tilleuls',      kind: 'reunion',   tag: 'visio' },
  { h: '09:00', d: '45 min', title: 'État des lieux d’entrée', sub: '14 rue Berthelot — T2',        kind: 'edl',       tag: 'confirme' },
  { h: '10:00', d: '30 min', title: 'Visite T3',               sub: 'Mme Delaunay — 8 pl. Carnot',  kind: 'visite' },
  { h: '10:45', d: '15 min', title: 'Appel propriétaire',      sub: 'M. Kessler — lot 12',          kind: 'appel',     tag: 'rappel' },
  { h: '11:15', d: '45 min', title: 'Signature de bail',       sub: 'Studio 4B — M. Ferrand',       kind: 'signature', tag: 'confirme' },
  { h: '12:15', d: '20 min', title: 'Remise des clés',         sub: 'Mme Ferrand — sur place',      kind: 'edl' },
  { h: '14:00', d: '1 h',    title: 'Intervention plombier',   sub: '8 av. Jaurès — colonne EF',    kind: 'technique' },
  { h: '15:15', d: '45 min', title: 'Expertise sinistre',      sub: 'Lot 7 — dégât des eaux',       kind: 'technique', tag: 'confirme' },
  { h: '16:15', d: '30 min', title: 'Contre-visite',           sub: 'M. et Mme Arnaud — T4',        kind: 'visite' },
  { h: '17:00', d: '20 min', title: 'Relance impayé',          sub: 'Locataire lot 3 — 2e rappel',  kind: 'appel',     tag: 'rappel' },
  { h: '17:30', d: '45 min', title: 'Rendez-vous notaire',     sub: 'Étude Vasseur — acte 12B',     kind: 'signature', tag: 'visio' },
  { h: '18:30', d: '2 h',    title: 'AG de copropriété',       sub: 'Résidence Les Tilleuls',       kind: 'reunion',   tag: 'confirme' },
];

const N = EVENTS.length;               // 12
const SERIES_H = N * ROW_H;            // 696 — hauteur d'une série
const TRACK_H = SERIES_H * 2;          // 1392 — piste (2 séries) ⇒ -50 % = -SERIES_H

const FADE_IN = 4.5;   // % du cycle — durée de la matérialisation
const RESET_OFF = 21.5; // % du cycle — milieu de la fenêtre hors-cadre

const mod = (x: number) => ((x % 100) + 100) % 100;

/**
 * Instant (en % du cycle) où la ligne `i` se matérialise.
 * Piste à l'instant p : translateY(−p·SERIES_H) ⇒
 *   y_haut(p) = i·ROW_H − p·SERIES_H = TRIGGER  ⇒  p = (i·ROW_H − TRIGGER)/SERIES_H
 * La copie `i + 12` franchit la même ordonnée exactement un cycle plus tard :
 * même valeur modulo 100 %, elle réutilise donc le même jeu de keyframes.
 * Valeurs : 66.67 / 75 / 83.33 / 91.67 / 0 / 8.33 / 16.67 / 25 / 33.33 / 41.67 / 50 / 58.33.
 */
const appear = (i: number) => mod(((i * ROW_H - TRIGGER) / SERIES_H) * 100);

/**
 * Instant de retour à l'état fantôme. La ligne `i` sort par le haut à
 * (i+1)·ROW_H/SERIES_H et ne réapparaît par le bas qu'un peu moins d'un demi-
 * cycle plus tard : on bascule au milieu de cette fenêtre, hors cadre.
 */
const reset = (i: number) => mod((((i + 1) * ROW_H) / SERIES_H) * 100 + RESET_OFF);

const p = (n: number) => `${Math.round(n * 1000) / 1000}`;
/** Évite un `0%, 0%` dégénéré quand l'instant tombe pile sur le début du cycle. */
const head = (t: number) => (t < 0.005 ? '0%' : `0%, ${p(t)}%`);

const EASE = 'cubic-bezier(.2,.8,.3,1)';

const CSS = `
@keyframes ag-scroll {
  0%   { transform: translateY(0); }
  100% { transform: translateY(-50%); }
}
${EVENTS.map((_, i) => {
  const a = appear(i);
  const r = reset(i);

  /* r < a : au début du cycle la ligne est déjà matérialisée. */
  if (r < a) return `
@keyframes ag-in-${i} {
  ${head(r)}            { opacity: 1; transform: translateY(0); }
  ${p(r + 0.01)}%       { opacity: 0; transform: translateY(9px); }
  ${p(a)}%              { opacity: 0; transform: translateY(9px); }
  ${p(a + FADE_IN)}%, 100% { opacity: 1; transform: translateY(0); }
}
@keyframes ag-ghost-${i} {
  ${head(r)}            { opacity: 0; }
  ${p(r + 0.01)}%       { opacity: 1; }
  ${p(a)}%              { opacity: 1; }
  ${p(a + FADE_IN)}%, 100% { opacity: 0; }
}`;

  /* a < r : au début du cycle la ligne est encore à l'état fantôme. */
  return `
@keyframes ag-in-${i} {
  ${head(a)}            { opacity: 0; transform: translateY(9px); }
  ${p(a + FADE_IN)}%    { opacity: 1; transform: translateY(0); }
  ${p(r)}%              { opacity: 1; transform: translateY(0); }
  ${p(r + 0.01)}%, 100% { opacity: 0; transform: translateY(9px); }
}
@keyframes ag-ghost-${i} {
  ${head(a)}            { opacity: 1; }
  ${p(a + FADE_IN)}%    { opacity: 0; }
  ${p(r)}%              { opacity: 0; }
  ${p(r + 0.01)}%, 100% { opacity: 1; }
}`;
}).join('')}
`;

/* ── Icônes ── */

const Chevron: React.FC<{ dir: 'left' | 'right' }> = ({ dir }) => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={C.textSecondary} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points={dir === 'left' ? '15 5 8 12 15 19' : '9 5 16 12 9 19'} />
  </svg>
);

const TagIcon: React.FC<{ tag: Tag; color: string }> = ({ tag, color }) => {
  const common = { width: 10, height: 10, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (tag === 'confirme') return <svg {...common}><polyline points="20 6 9 17 4 12" /></svg>;
  if (tag === 'visio') return (
    <svg {...common}>
      <path d="M22 8.5l-6 3.5 6 3.5z" />
      <rect x="2" y="6" width="14" height="12" rx="2.5" />
    </svg>
  );
  return (
    <svg {...common}>
      <path d="M18 8.5a6 6 0 10-12 0c0 6.5-2.5 8.5-2.5 8.5h17S18 15 18 8.5" />
      <path d="M13.6 20.5a2 2 0 01-3.2 0" />
    </svg>
  );
};

const Badge: React.FC<{ tag: Tag }> = ({ tag }) => {
  const t = TAGS[tag];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4.5, flexShrink: 0,
      background: t.bg, borderRadius: 20, padding: '4px 9px',
    }}>
      <TagIcon tag={tag} color={t.color} />
      <span style={{ fontSize: 9.5, fontWeight: 700, color: t.color, letterSpacing: '0.1px', whiteSpace: 'nowrap' }}>
        {t.label}
      </span>
    </div>
  );
};

/* ── Une ligne d'agenda. `i` = index dans la série (identique pour l'original et sa copie). ── */

const Row: React.FC<{ ev: Ev; i: number }> = ({ ev, i }) => {
  const col = KIND_COLOR[ev.kind];
  return (
    <div style={{ position: 'relative', height: ROW_H }}>

      {/* État fantôme : le créneau existe, l'événement n'est pas encore posé */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        animation: `ag-ghost-${i} 10s ${EASE} 0s infinite both`,
      }}>
        <div style={{ position: 'absolute', left: 12, top: 11, width: 32, height: 8, borderRadius: 4, background: 'rgba(53,50,48,0.10)' }} />
        <div style={{ position: 'absolute', left: 20, top: 25, width: 24, height: 6, borderRadius: 3, background: 'rgba(53,50,48,0.06)' }} />
        <div style={{
          position: 'absolute', left: GUT - 4.5, top: 15, width: 9, height: 9, borderRadius: '50%',
          background: C.bgPage, border: `1.5px solid ${C.borderStrong}`, boxSizing: 'border-box',
          boxShadow: `0 0 0 3px ${C.bgPage}`,
        }} />
        <div style={{
          position: 'absolute', left: CARD_L, top: 4, width: CARD_W, height: CARD_H,
          borderRadius: 10, border: `1.5px dashed ${C.borderStrong}`,
          background: 'rgba(255,255,255,0.45)', boxSizing: 'border-box',
        }}>
          <div style={{ position: 'absolute', left: 15, top: 14, width: 148, height: 8, borderRadius: 4, background: 'rgba(53,50,48,0.10)' }} />
          <div style={{ position: 'absolute', left: 15, top: 30, width: 96, height: 6.5, borderRadius: 3.5, background: 'rgba(53,50,48,0.06)' }} />
        </div>
      </div>

      {/* Événement matérialisé */}
      <div style={{
        position: 'absolute', inset: 0,
        animation: `ag-in-${i} 10s ${EASE} 0s infinite both`,
      }}>
        {/* Colonne d'heures */}
        <div style={{
          position: 'absolute', left: 0, top: 8, width: 44, textAlign: 'right',
          fontSize: 12, fontWeight: 600, color: C.textPrimary,
          fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.2px',
        }}>
          {ev.h}
        </div>
        <div style={{
          position: 'absolute', left: 0, top: 24.5, width: 44, textAlign: 'right',
          fontSize: 9.5, fontWeight: 500, color: C.textMuted,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {ev.d}
        </div>

        {/* Pastille de type, posée sur le rail */}
        <div style={{
          position: 'absolute', left: GUT - 4.5, top: 15, width: 9, height: 9, borderRadius: '50%',
          background: col, boxShadow: `0 0 0 3px ${C.bgPage}`,
        }} />

        {/* Carte de l'événement */}
        <div style={{
          position: 'absolute', left: CARD_L, top: 4, width: CARD_W, height: CARD_H,
          background: C.white, borderRadius: 10, border: `1px solid ${C.border}`,
          boxShadow: '0 2px 8px rgba(53,50,48,0.05)', overflow: 'hidden',
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '0 12px 0 15px', boxSizing: 'border-box',
        }}>
          {/* Liseré de type */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3.5, background: col }} />

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: C.textPrimary, whiteSpace: 'nowrap' }}>
              {ev.title}
            </div>
            <div style={{ fontSize: 10.5, fontWeight: 500, color: C.textSecondary, whiteSpace: 'nowrap', marginTop: 3 }}>
              {ev.sub}
            </div>
          </div>

          {ev.tag ? <Badge tag={ev.tag} /> : null}
        </div>
      </div>
    </div>
  );
};

export const Agenda: React.FC = () => (
  <div style={{
    width: W, height: H, position: 'relative', overflow: 'hidden',
    background: C.bgApp, borderRadius: 18, fontFamily: F.body,
  }}>
    <style>{CSS}</style>

    {/* Fenêtre applicative */}
    <div style={{
      position: 'absolute', left: WIN_X, top: WIN_Y, width: WIN_W, height: WIN_H,
      background: C.white, borderRadius: 16, border: `1px solid ${C.border}`,
      boxShadow: '0 18px 44px rgba(53,50,48,0.10)', overflow: 'hidden',
    }}>

      {/* ── En-tête (décor fixe) ── */}
      <div style={{
        position: 'absolute', left: 0, top: 0, width: '100%', height: HEAD_H,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 18px', boxSizing: 'border-box',
        background: C.white, borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <LockimmoMark size={22} />
          <span style={{ fontFamily: F.display, fontSize: 15, fontWeight: 600, color: C.textPrimary }}>
            Agenda
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 20, height: 20, borderRadius: 6, background: C.bgPage,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Chevron dir="left" />
          </div>
          <span style={{
            fontSize: 12.5, fontWeight: 600, color: C.textPrimary,
            fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap',
          }}>
            Jeudi 12 mars 2026
          </span>
          <div style={{
            width: 20, height: 20, borderRadius: 6, background: C.bgPage,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Chevron dir="right" />
          </div>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: C.accentSubtle, border: `1px solid ${C.accentSoft}`,
          borderRadius: 20, padding: '4.5px 11px',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent }} />
          <span style={{
            fontSize: 10.5, fontWeight: 700, color: C.accent,
            fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap',
          }}>
            12 événements
          </span>
        </div>
      </div>

      {/* ── Zone de défilement ── */}
      <div style={{
        position: 'absolute', left: 0, top: HEAD_H, width: VIEW_W, height: VIEW_H,
        overflow: 'hidden', background: C.bgPage,
      }}>
        {/* Rail de la colonne d'heures (décor fixe, passe sous les pastilles) */}
        <div style={{
          position: 'absolute', left: GUT, top: 0, bottom: 0, width: 1,
          background: C.borderStrong, pointerEvents: 'none',
        }} />

        {/* Piste : la journée est rendue deux fois ⇒ translateY(-50%) reboucle sans couture */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: TRACK_H,
          animation: 'ag-scroll 10s linear 0s infinite both',
        }}>
          {[...EVENTS, ...EVENTS].map((ev, n) => (
            <Row key={n} ev={ev} i={n % N} />
          ))}
        </div>

        {/* Fondus haut / bas — entrée et sortie en douceur (C.bgPage = #F3F0ED) */}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 0, height: FADE_H, pointerEvents: 'none',
          background: 'linear-gradient(180deg, #F3F0ED 0%, rgba(243,240,237,0) 100%)',
        }} />
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, height: FADE_H, pointerEvents: 'none',
          background: 'linear-gradient(0deg, #F3F0ED 0%, rgba(243,240,237,0) 100%)',
        }} />

        {/* Trait « maintenant » (décor fixe) */}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: NOW_Y, height: 1.5,
          background: 'linear-gradient(90deg, rgba(255,135,83,0.85) 0%, rgba(255,135,83,0.85) 78%, rgba(255,135,83,0) 100%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', left: GUT - 4.5, top: NOW_Y - 4, width: 10, height: 10,
          borderRadius: '50%', background: C.accent,
          boxShadow: '0 0 0 3.5px rgba(255,135,83,0.22)', pointerEvents: 'none',
        }} />
      </div>
    </div>
  </div>
);
