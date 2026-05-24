import React from "react";

const WHITE = "#FFFFFF";
const ACCENT = "#FF8753";
const ACCENT_AREA = "rgba(255,135,83,0.08)";
const ACCENT_LIGHT = "rgba(255,135,83,0.5)";
const TEXT_PRIMARY = "#353230";
const TEXT_SECONDARY = "#6A6A6A";
const BORDER_ALPHA = "rgba(59,52,47,0.1)";
const GRID_COLOR = "#F0F0F0";
const GREEN = "#27AE60";

const IconRefresh: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={TEXT_SECONDARY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23,4 23,10 17,10" />
    <polyline points="1,20 1,14 7,14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const IconTrendingUp: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
    <polyline points="17,6 23,6 23,12" />
  </svg>
);

// Données du graphique (valeurs en k€)
const DATA = [8, 18, 22, 25, 28, 30, 32, 35, 38, 40, 44, 48];
const MONTHS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
const Y_LABELS = [0, 15, 30, 45, 60];

// Dimensions du graphique SVG
const SVG_W = 640;
const SVG_H = 180;
const PAD_L = 44;
const PAD_R = 16;
const PAD_T = 12;
const PAD_B = 30;

const chartW = SVG_W - PAD_L - PAD_R;
const chartH = SVG_H - PAD_T - PAD_B;
const MAX_VAL = 60;

const toX = (i: number): number => PAD_L + (i / (DATA.length - 1)) * chartW;
const toY = (v: number): number => PAD_T + chartH - (v / MAX_VAL) * chartH;

const buildPath = (): string =>
  DATA.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(v)}`).join(" ");

const buildArea = (): string => {
  const linePath = buildPath();
  const lastX = toX(DATA.length - 1);
  const baseY = PAD_T + chartH;
  const firstX = toX(0);
  return `${linePath} L${lastX},${baseY} L${firstX},${baseY} Z`;
};

export const LoyersChart: React.FC = () => (
  <div
    style={{
      backgroundColor: WHITE,
      borderRadius: 12,
      border: `1px solid ${BORDER_ALPHA}`,
      padding: 20,
    }}
  >
    {/* Header */}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
      <span style={{ fontSize: 15, fontWeight: 700, color: TEXT_PRIMARY }}>Loyers & facturations</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Tabs années */}
        {(["2024", "2025"] as const).map((year) => (
          <span
            key={year}
            style={{
              fontSize: 12,
              color: TEXT_SECONDARY,
              padding: "4px 12px",
              borderRadius: 100,
              cursor: "pointer",
            }}
          >
            {year}
          </span>
        ))}
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: WHITE,
            backgroundColor: ACCENT,
            padding: "4px 12px",
            borderRadius: 100,
          }}
        >
          2026
        </span>
        <span style={{ marginLeft: 4, cursor: "pointer", display: "flex" }}>
          <IconRefresh />
        </span>
      </div>
    </div>

    {/* Sub-header */}
    <div style={{ fontSize: 12, color: TEXT_SECONDARY, marginBottom: 16 }}>
      Situation des loyers — 2026
    </div>

    {/* Metric row */}
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          backgroundColor: ACCENT,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <IconTrendingUp />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: TEXT_SECONDARY, marginBottom: 2 }}>Total loyers 2026</div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: TEXT_PRIMARY,
            fontFamily: "'Chillax', sans-serif",
            lineHeight: 1,
          }}
        >
          560 300 €
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 11, color: TEXT_SECONDARY, marginBottom: 2 }}>vs année préc.</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: GREEN }}>+6,3 %</div>
      </div>
    </div>

    {/* SVG Chart */}
    <svg
      width="100%"
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      style={{ display: "block", overflow: "visible" }}
    >
      {/* Lignes de grille horizontales */}
      {Y_LABELS.map((val) => {
        const y = toY(val);
        return (
          <g key={val}>
            <line x1={PAD_L} y1={y} x2={SVG_W - PAD_R} y2={y} stroke={GRID_COLOR} strokeWidth="1" />
            <text x={PAD_L - 6} y={y + 4} fontSize="10" fill={TEXT_SECONDARY} textAnchor="end">
              {val === 0 ? "0k" : `${val}k`}
            </text>
          </g>
        );
      })}

      {/* Area fill */}
      <path d={buildArea()} fill={ACCENT_AREA} />

      {/* Ligne principale */}
      <path d={buildPath()} fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

      {/* Points */}
      {DATA.map((v, i) => (
        <circle key={i} cx={toX(i)} cy={toY(v)} r="3.5" fill={ACCENT} stroke={WHITE} strokeWidth="1.5" />
      ))}

      {/* Labels mois */}
      {MONTHS.map((m, i) => (
        <text key={m} x={toX(i)} y={SVG_H - 6} fontSize="10" fill={TEXT_SECONDARY} textAnchor="middle">
          {m}
        </text>
      ))}
    </svg>

    {/* Légende */}
    <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <svg width="24" height="2">
          <line x1="0" y1="1" x2="24" y2="1" stroke={ACCENT} strokeWidth="2.5" />
        </svg>
        <span style={{ fontSize: 11, color: TEXT_SECONDARY }}>Loyers encaissés</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <svg width="24" height="2">
          <line x1="0" y1="1" x2="24" y2="1" stroke={ACCENT_LIGHT} strokeWidth="2" strokeDasharray="4 2" />
        </svg>
        <span style={{ fontSize: 11, color: TEXT_SECONDARY }}>Charges refacturées</span>
      </div>
    </div>
  </div>
);
