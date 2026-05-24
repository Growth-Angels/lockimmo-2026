import React from "react";

const WHITE = "#FFFFFF";
const ACCENT = "#FF8753";
const TEXT_PRIMARY = "#353230";
const TEXT_SECONDARY = "#6A6A6A";
const BORDER_ALPHA = "rgba(59,52,47,0.1)";
const BG_LIGHT = "#F7F7F7";

const PURPLE = "#9B59B6";
const BLUE = "#3498DB";

interface DayProps {
  num: number;
  short: string;
  active?: boolean;
}

const DayCell: React.FC<DayProps> = ({ num, short, active }) => (
  <div
    style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4,
    }}
  >
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        backgroundColor: active ? ACCENT : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: active ? WHITE : TEXT_PRIMARY,
          lineHeight: 1,
        }}
      >
        {num}
      </span>
    </div>
    <span style={{ fontSize: 10, color: active ? ACCENT : TEXT_SECONDARY, fontWeight: active ? 600 : 400 }}>
      {short}
    </span>
  </div>
);

interface EventCardProps {
  borderColor: string;
  title: string;
  time: string;
  location?: string;
  badge: string;
  badgeBg: string;
}

const EventCard: React.FC<EventCardProps> = ({ borderColor, title, time, location, badge, badgeBg }) => (
  <div
    style={{
      borderLeft: `3px solid ${borderColor}`,
      borderRadius: 6,
      backgroundColor: BG_LIGHT,
      padding: "10px 12px",
      marginBottom: 8,
    }}
  >
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_PRIMARY, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 11, color: TEXT_SECONDARY }}>
          <span>⏰ {time}</span>
          {location && <span> · 📍 {location}</span>}
        </div>
      </div>
      <span
        style={{
          backgroundColor: badgeBg,
          color: WHITE,
          borderRadius: 6,
          fontSize: 10,
          fontWeight: 700,
          padding: "2px 7px",
          flexShrink: 0,
        }}
      >
        {badge}
      </span>
    </div>
  </div>
);

export const Agenda: React.FC = () => (
  <div
    style={{
      backgroundColor: WHITE,
      borderRadius: 12,
      border: `1px solid ${BORDER_ALPHA}`,
      padding: 20,
    }}
  >
    {/* Header */}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
      <span style={{ fontSize: 15, fontWeight: 700, color: TEXT_PRIMARY }}>Votre agenda</span>
      <span style={{ fontSize: 13, color: ACCENT, fontWeight: 600, cursor: "pointer" }}>
        Voir le planning ›
      </span>
    </div>

    {/* Bouton nouveau RDV */}
    <button
      style={{
        width: "100%",
        backgroundColor: WHITE,
        color: ACCENT,
        border: `1.5px solid ${ACCENT}`,
        borderRadius: 8,
        padding: "10px 0",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        marginBottom: 16,
        fontFamily: "Inter, sans-serif",
      }}
    >
      + Nouveau rendez-vous
    </button>

    {/* Calendrier hebdomadaire */}
    <div
      style={{
        display: "flex",
        gap: 0,
        borderBottom: `1px solid ${BORDER_ALPHA}`,
        paddingBottom: 14,
        marginBottom: 16,
      }}
    >
      <DayCell num={16} short="lun" />
      <DayCell num={17} short="mar" />
      <DayCell num={18} short="mer" />
      <DayCell num={19} short="jeu" active />
      <DayCell num={20} short="ven" />
      <DayCell num={21} short="sam" />
      <DayCell num={22} short="dim" />
    </div>

    {/* Événements */}
    <EventCard
      borderColor={PURPLE}
      title="État des lieux – Dupont"
      time="09:00"
      location="12 rue de la Paix"
      badge="EDL"
      badgeBg={PURPLE}
    />
    <EventCard
      borderColor={ACCENT}
      title="Rendez-vous propriétaire"
      time="11:30"
      badge="RDV"
      badgeBg={ACCENT}
    />
    <EventCard
      borderColor={BLUE}
      title="Visite appartement T3"
      time="14:00"
      location="45 bd Haussmann"
      badge="Visite"
      badgeBg={BLUE}
    />
  </div>
);
