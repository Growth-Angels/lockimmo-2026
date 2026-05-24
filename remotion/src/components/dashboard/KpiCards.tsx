import React from "react";

const WHITE = "#FFFFFF";
const ACCENT = "#FF8753";
const TEXT_PRIMARY = "#353230";
const TEXT_SECONDARY = "#6A6A6A";
const BORDER_ALPHA = "rgba(59,52,47,0.1)";
const GREEN = "#27AE60";
const RED = "#EF5350";

const IconTrendUp: React.FC<{ color?: string }> = ({ color = WHITE }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
    <polyline points="17,6 23,6 23,12" />
  </svg>
);

const IconHouse: React.FC<{ color?: string }> = ({ color = WHITE }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
  </svg>
);

const IconCreditCard: React.FC<{ color?: string }> = ({ color = WHITE }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const IconBuilding: React.FC<{ color?: string }> = ({ color = WHITE }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="8" height="18" />
    <path d="M14 8h8v13H10" />
    <path d="M6 7h.01M6 11h.01M6 15h.01M17 11h.01M17 15h.01" />
  </svg>
);

interface KpiCardProps {
  iconBg: string;
  icon: React.ReactNode;
  value: string;
  label: string;
  trend: string;
  trendColor: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ iconBg, icon, value, label, trend, trendColor }) => (
  <div
    style={{
      flex: 1,
      backgroundColor: WHITE,
      borderRadius: 12,
      border: `1px solid ${BORDER_ALPHA}`,
      padding: "20px 18px",
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}
  >
    {/* Icône */}
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        backgroundColor: iconBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {icon}
    </div>

    {/* Valeur + label */}
    <div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: TEXT_PRIMARY,
          fontFamily: "'Chillax', sans-serif",
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 12, color: TEXT_SECONDARY, lineHeight: 1.3 }}>{label}</div>
    </div>

    {/* Tendance */}
    <div style={{ fontSize: 12, color: trendColor, fontWeight: 600 }}>{trend}</div>
  </div>
);

export const KpiCards: React.FC = () => (
  <div style={{ display: "flex", gap: 16 }}>
    <KpiCard
      iconBg={ACCENT}
      icon={<IconTrendUp />}
      value="90 %"
      label="Taux d'occupation"
      trend="↑ +2 pts"
      trendColor={GREEN}
    />
    <KpiCard
      iconBg={TEXT_PRIMARY}
      icon={<IconHouse />}
      value="10"
      label="Biens loués"
      trend="↑ sur 11 biens"
      trendColor={GREEN}
    />
    <KpiCard
      iconBg="#EF5350"
      icon={<IconCreditCard />}
      value="5"
      label="Dossiers impayés"
      trend="↓ à régulariser"
      trendColor={RED}
    />
    <KpiCard
      iconBg={ACCENT}
      icon={<IconBuilding />}
      value="1"
      label="Biens vacants"
      trend="en mise en loc."
      trendColor={TEXT_SECONDARY}
    />
  </div>
);
