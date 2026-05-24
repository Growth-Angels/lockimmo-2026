/**
 * LOCKimmo — Design Tokens Remotion
 * Source de vérité unique pour toutes les animations.
 * Référence : LOCKimmo Motion Reference.md
 */

// ─── Couleurs ───────────────────────────────────────────────────
export const C = {
  textPrimary:   "#353230",   // Titres, corps, UI
  accent:        "#FF8753",   // Bouton primaire, highlights
  bgLight:       "#F7F7F7",   // Backgrounds de section, pillules
  pillBorder:    "#3B342F",   // Bordures, contours
  textSecondary: "#6A6A6A",   // Texte secondaire
  white:         "#FFFFFF",   // Fond, texte sur orange
  borderAlpha:   "rgba(59,52,47,0.1)",
  // Dérivés utiles
  accentDim:     "rgba(255,135,83,0.12)",
  accentBorder:  "rgba(255,135,83,0.25)",
  inkDark:       "#0E0C0B",
} as const;

// ─── Typographie ────────────────────────────────────────────────
export const F = {
  display: "'Chillax', sans-serif",  // Titres — Medium 500, SemiBold 600, Bold 700
  body:    "'Inter', sans-serif",    // Corps — Regular 400, SemiBold 600
} as const;

// ─── Tailles de police ──────────────────────────────────────────
export const FS = {
  xs:   12,
  sm:   14,
  base: 16,
  md:   20,
  lg:   24,
  xl:   32,
  "2xl": 40,
  "3xl": 48,
  "4xl": 64,
  "5xl": 80,
  "6xl": 96,
} as const;

// ─── Tokens d'animation (base 30 fps) ──────────────────────────
export const A = {
  enter:     9,   // 0,3s  — Entrée standard (interpolate)
  exit:      6,   // 0,2s  — Sortie standard
  sceneTrans: 15, // 0,5s  — Transition de scène
  stagger:   3,   // 0,1s  — Décalage entre éléments d'une liste

  // Spring doux pour scale-in avec rebond léger
  spring: { damping: 18, stiffness: 120 },
} as const;

// ─── Formes ─────────────────────────────────────────────────────
export const R = {
  btn:  16,
  card: 12,
  pill: 100,
  tag:  8,
} as const;

// ─── Formats de composition ─────────────────────────────────────
export const COMPOSITIONS = {
  square:    { width: 1080, height: 1080, fps: 30, durationInFrames: 150 }, // 5s
  vertical:  { width: 1080, height: 1920, fps: 30, durationInFrames: 180 }, // 6s
  landscape: { width: 1920, height: 1080, fps: 30, durationInFrames: 180 }, // 6s
} as const;
