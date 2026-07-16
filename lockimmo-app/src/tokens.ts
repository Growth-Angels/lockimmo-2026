/**
 * Design system tokens — aligned with /tokens.css
 * Source de vérité : lockimmo-tokens.json → build-tokens.py → tokens.css
 */

export const C = {
  /* ── Brand (orange) ── */
  accent:        "#FF8753",   // brand-500
  accentLight:   "#FFF0E8",   // brand-100
  accentSubtle:  "#FFF4EE",   // brand-50
  accentSoft:    "#FFE0CC",   // brand-200

  /* ── Ink (text) ── */
  textPrimary:   "#353230",   // ink-800
  textSecondary: "#6C6057",   // ink-600
  textMuted:     "#AAA09A",   // ink-400
  inkDark:       "#0E0C0B",   // ink-900

  /* ── Surface ── */
  white:         "#FFFFFF",   // surface-100
  bgLight:       "#FAFAF9",   // surface-200 — inner subtle bg (cards inside cards)
  bgPage:        "#F3F0ED",   // surface-300
  bgApp:         "#EDE9E5",   // surface-400 — MAIN APP BG
  bgWarm:        "#F8F5F2",   // surface-500
  bgSidebar:     "#353230",   // ink-800

  /* ── Status ── */
  success:       "#28A566",   // success-500
  successLight:  "#EDFBF4",   // success-50
  error:         "#E05252",   // error-500
  errorLight:    "#FFF0F0",   // error-50
  info:          "#3B7DF8",   // info-500
  infoLight:     "#EEF4FF",   // info-50
  blue:          "#3B7DF8",   // alias info
  blueLight:     "#EEF4FF",   // alias infoLight
  purple:        "#8B5CF6",   // purple-500
  purpleLight:   "#F4EEFF",   // purple-50

  /* ── Borders ── */
  border:        "rgba(53,50,48,0.08)",   // border-default
  borderStrong:  "rgba(53,50,48,0.15)",   // border-strong
  borderSubtle:  "rgba(53,50,48,0.06)",   // border-subtle
};

export const F = {
  display: "'Chillax', sans-serif",
  body:    "'Alan Sans', sans-serif",
};

export const R = {
  sm:   6,
  md:   10,
  lg:   14,
  card: 12,
  btn:  16,
  xl:   24,
  pill: 100,
};

export const FS = {
  xs:    10,
  sm:    12,
  base:  16,
  md:    15,
  lg:    18,
  xl:    22,
  '2xl': 28,
  '3xl': 32,
  '4xl': 48,
  '5xl': 64,
  '6xl': 84,
};
