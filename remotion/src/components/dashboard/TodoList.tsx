import React from "react";

const WHITE = "#FFFFFF";
const ACCENT = "#FF8753";
const TEXT_PRIMARY = "#353230";
const TEXT_SECONDARY = "#6A6A6A";
const BORDER_ALPHA = "rgba(59,52,47,0.1)";

interface Task {
  id: number;
  label: string;
  date: string;
}

const TASKS: Task[] = [
  { id: 1, label: "Renvoi des documents", date: "22/06/2023" },
  { id: 2, label: "Réimprimer document locataire X", date: "16/08/2024" },
  { id: 3, label: "Tâche sur appartement à réaliser", date: "16/08/2024" },
  { id: 4, label: "Départ locataire", date: "16/08/2024" },
  { id: 5, label: "Paiement propriétaire à réaliser", date: "16/08/2024" },
  { id: 6, label: "Prendre RDV pour état des lieux de sortie", date: "31/10/2025" },
];

const TaskRow: React.FC<{ task: Task; last?: boolean }> = ({ task, last }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 0",
      borderBottom: last ? "none" : `1px solid ${BORDER_ALPHA}`,
    }}
  >
    {/* Checkbox vide */}
    <div
      style={{
        width: 18,
        height: 18,
        borderRadius: "50%",
        border: `2px solid ${BORDER_ALPHA}`,
        flexShrink: 0,
        backgroundColor: WHITE,
      }}
    />
    {/* Label */}
    <span style={{ flex: 1, fontSize: 13, color: TEXT_PRIMARY, lineHeight: 1.3 }}>{task.label}</span>
    {/* Date */}
    <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
      </svg>
      <span style={{ fontSize: 12, color: ACCENT, fontWeight: 600 }}>{task.date}</span>
    </div>
  </div>
);

export const TodoList: React.FC = () => (
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
      <span style={{ fontSize: 15, fontWeight: 700, color: TEXT_PRIMARY }}>To do list</span>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          style={{
            backgroundColor: ACCENT,
            color: WHITE,
            border: "none",
            borderRadius: 20,
            padding: "6px 14px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
          }}
        >
          + Action
        </button>
        <button
          style={{
            backgroundColor: TEXT_PRIMARY,
            color: WHITE,
            border: "none",
            borderRadius: 20,
            padding: "6px 14px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
          }}
        >
          + Process
        </button>
      </div>
    </div>

    {/* Tabs */}
    <div
      style={{
        display: "flex",
        gap: 4,
        borderBottom: `1px solid ${BORDER_ALPHA}`,
        marginBottom: 4,
        paddingBottom: 0,
      }}
    >
      {/* Onglet actif */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 12px",
          borderBottom: `2px solid ${ACCENT}`,
          marginBottom: -1,
          cursor: "pointer",
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: ACCENT }}>À faire</span>
        <span
          style={{
            backgroundColor: ACCENT,
            color: WHITE,
            borderRadius: 100,
            fontSize: 11,
            fontWeight: 700,
            padding: "1px 7px",
          }}
        >
          6
        </span>
      </div>
      {["Robot", "Terminées"].map((tab) => (
        <div
          key={tab}
          style={{
            padding: "8px 12px",
            borderBottom: "2px solid transparent",
            marginBottom: -1,
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: 13, color: TEXT_SECONDARY }}>{tab}</span>
        </div>
      ))}
    </div>

    {/* Liste des tâches */}
    <div>
      {TASKS.map((task, idx) => (
        <TaskRow key={task.id} task={task} last={idx === TASKS.length - 1} />
      ))}
    </div>
  </div>
);
