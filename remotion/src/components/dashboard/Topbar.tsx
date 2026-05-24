import React from "react";

const WHITE = "#FFFFFF";
const BG_LIGHT = "#F7F7F7";
const ACCENT = "#FF8753";
const TEXT_PRIMARY = "#353230";
const TEXT_SECONDARY = "#6A6A6A";
const BORDER_ALPHA = "rgba(59,52,47,0.1)";

const IconSearch: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={TEXT_SECONDARY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconBell: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={TEXT_PRIMARY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

export const Topbar: React.FC = () => (
  <div
    style={{
      height: 56,
      backgroundColor: WHITE,
      borderBottom: `1px solid ${BORDER_ALPHA}`,
      display: "flex",
      alignItems: "center",
      padding: "0 24px",
      gap: 16,
      flexShrink: 0,
    }}
  >
    {/* Recherche */}
    <div
      style={{
        flex: 1,
        maxWidth: 440,
        display: "flex",
        alignItems: "center",
        gap: 10,
        backgroundColor: BG_LIGHT,
        borderRadius: 8,
        padding: "8px 14px",
        border: `1px solid ${BORDER_ALPHA}`,
      }}
    >
      <IconSearch />
      <span style={{ fontSize: 13, color: TEXT_SECONDARY, userSelect: "none" }}>
        Rechercher un bien, locataire, dossier...
      </span>
    </div>

    {/* Spacer */}
    <div style={{ flex: 1 }} />

    {/* Cloche */}
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        backgroundColor: BG_LIGHT,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: `1px solid ${BORDER_ALPHA}`,
        cursor: "pointer",
        position: "relative",
      }}
    >
      <IconBell />
      {/* Badge notification */}
      <div
        style={{
          position: "absolute",
          top: 4,
          right: 4,
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "#EF5350",
          border: `2px solid ${WHITE}`,
        }}
      />
    </div>

    {/* Avatar + infos */}
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          backgroundColor: ACCENT,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: WHITE,
          fontWeight: 700,
          fontSize: 15,
          flexShrink: 0,
        }}
      >
        L
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: TEXT_PRIMARY, lineHeight: 1.2 }}>
          Léona
        </span>
        <span style={{ fontSize: 11, color: TEXT_SECONDARY, lineHeight: 1.2 }}>
          Agence Welcome
        </span>
      </div>
    </div>
  </div>
);
