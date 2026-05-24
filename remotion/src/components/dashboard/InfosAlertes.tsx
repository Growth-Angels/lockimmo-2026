import React from "react";

const WHITE = "#FFFFFF";
const ACCENT = "#FF8753";
const TEXT_PRIMARY = "#353230";
const TEXT_SECONDARY = "#6A6A6A";
const BORDER_ALPHA = "rgba(59,52,47,0.1)";
const RED = "#EF5350";
const ORANGE = "#FF9800";
const GRAY_LIGHT = "#E0E0E0";

// ── Icônes SVG ───────────────────────────────────────────────────────────────

const IconRefresh: React.FC<{ color?: string; size?: number }> = ({ color = TEXT_SECONDARY, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23,4 23,10 17,10" />
    <polyline points="1,20 1,14 7,14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const IconWarning: React.FC<{ color?: string }> = ({ color = RED }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const IconCreditCard: React.FC<{ color?: string }> = ({ color = RED }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const IconZap: React.FC<{ color?: string }> = ({ color = RED }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" />
  </svg>
);

const IconShield: React.FC<{ color?: string }> = ({ color = ORANGE }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconTool: React.FC<{ color?: string }> = ({ color = ORANGE }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const IconFileText: React.FC<{ color?: string }> = ({ color = ORANGE }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const IconXCircle: React.FC<{ color?: string }> = ({ color = GRAY_LIGHT }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const IconHome: React.FC<{ color?: string }> = ({ color = TEXT_SECONDARY }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
  </svg>
);

const IconBuilding: React.FC<{ color?: string }> = ({ color = TEXT_SECONDARY }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="8" height="18" />
    <path d="M14 8h8v13H10" />
  </svg>
);

const IconTrendingUp: React.FC<{ color?: string }> = ({ color = TEXT_SECONDARY }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
    <polyline points="17,6 23,6 23,12" />
  </svg>
);

const IconAlertCircle: React.FC<{ color?: string }> = ({ color = TEXT_SECONDARY }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconDownload: React.FC<{ color?: string }> = ({ color = TEXT_SECONDARY }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7,10 12,15 17,10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const IconRefreshSm: React.FC<{ color?: string }> = ({ color = TEXT_SECONDARY }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23,4 23,10 17,10" />
    <polyline points="1,20 1,14 7,14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

// ── Sous-composants ───────────────────────────────────────────────────────────

interface AlertRowProps {
  icon: React.ReactNode;
  label: string;
  badge: string | number;
  badgeBg: string;
  badgeColor?: string;
  dimmed?: boolean;
}

const AlertRow: React.FC<AlertRowProps> = ({ icon, label, badge, badgeBg, badgeColor = WHITE, dimmed }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "7px 0",
      borderBottom: `1px solid ${BORDER_ALPHA}`,
      opacity: dimmed ? 0.4 : 1,
    }}
  >
    <span style={{ flexShrink: 0, display: "flex" }}>{icon}</span>
    <span style={{ flex: 1, fontSize: 12, color: TEXT_PRIMARY, lineHeight: 1.3 }}>{label}</span>
    <span
      style={{
        minWidth: 20,
        height: 20,
        borderRadius: 100,
        backgroundColor: badgeBg,
        color: badgeColor,
        fontSize: 11,
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 6px",
        flexShrink: 0,
      }}
    >
      {badge}
    </span>
  </div>
);

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  tag: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, tag }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "7px 0",
      borderBottom: `1px solid ${BORDER_ALPHA}`,
    }}
  >
    <span style={{ flexShrink: 0, display: "flex" }}>{icon}</span>
    <span style={{ flex: 1, fontSize: 12, color: TEXT_PRIMARY, lineHeight: 1.3 }}>{label}</span>
    <span
      style={{
        borderRadius: 6,
        backgroundColor: "#F0F0F0",
        color: TEXT_SECONDARY,
        fontSize: 11,
        fontWeight: 600,
        padding: "2px 8px",
        flexShrink: 0,
      }}
    >
      {tag}
    </span>
  </div>
);

const SectionHeader: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <div
    style={{
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.08em",
      color,
      textTransform: "uppercase",
      padding: "12px 0 4px",
    }}
  >
    {label}
  </div>
);

// ── Composant principal ───────────────────────────────────────────────────────

export const InfosAlertes: React.FC = () => (
  <div
    style={{
      backgroundColor: WHITE,
      borderRadius: 12,
      border: `1px solid ${BORDER_ALPHA}`,
      padding: 20,
    }}
  >
    {/* Header */}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
      <span style={{ fontSize: 15, fontWeight: 700, color: TEXT_PRIMARY }}>Infos & alertes</span>
      <span style={{ cursor: "pointer" }}><IconRefresh color={TEXT_SECONDARY} size={16} /></span>
    </div>

    {/* À traiter en priorité */}
    <SectionHeader label="À traiter en priorité" color={ACCENT} />
    <AlertRow icon={<IconWarning />} label="Nouveaux sinistres" badge="2" badgeBg={RED} />
    <AlertRow icon={<IconCreditCard />} label="Dossiers impayés" badge="5" badgeBg={RED} />
    <AlertRow icon={<IconZap />} label="Biens énergivores" badge="3" badgeBg={RED} />

    {/* À surveiller */}
    <SectionHeader label="À surveiller" color={TEXT_SECONDARY} />
    <AlertRow icon={<IconShield />} label="Attestations d'assurance" badge="6" badgeBg={ORANGE} />
    <AlertRow icon={<IconTool />} label="Attestations d'entretien" badge="3" badgeBg={ORANGE} />
    <AlertRow icon={<IconFileText />} label="Baux arrivant à expiration" badge="1" badgeBg={ORANGE} />
    <AlertRow icon={<IconRefreshSm color={ORANGE} />} label="Mandats à renouveler" badge="2" badgeBg={ORANGE} />
    <AlertRow icon={<IconXCircle />} label="Baux à dénoncer" badge="0" badgeBg={GRAY_LIGHT} badgeColor={TEXT_SECONDARY} dimmed />

    {/* Informations */}
    <SectionHeader label="Informations" color={TEXT_SECONDARY} />
    <InfoRow icon={<IconHome />} label="Biens loués" tag="10" />
    <InfoRow icon={<IconBuilding />} label="Biens vacants" tag="1" />
    <InfoRow icon={<IconTrendingUp />} label="Taux d'occupation" tag="90 %" />
    <InfoRow icon={<IconAlertCircle />} label="Révisions en anomalies" tag="5" />
    <InfoRow icon={<IconDownload />} label="Nouveaux documents reçus" tag="1" />
    <InfoRow icon={<IconRefreshSm />} label="Révisions de loyers" tag="0" />
  </div>
);
