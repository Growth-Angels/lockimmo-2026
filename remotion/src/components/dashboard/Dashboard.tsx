import React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { KpiCards } from "./KpiCards";
import { InfosAlertes } from "./InfosAlertes";
import { LoyersChart } from "./LoyersChart";
import { TodoList } from "./TodoList";
import { Agenda } from "./Agenda";

const TEXT_PRIMARY = "#353230";
const TEXT_SECONDARY = "#6A6A6A";
const BG_LIGHT = "#F7F7F7";

export const Dashboard: React.FC = () => (
  <div
    style={{
      display: "flex",
      width: 1440,
      height: 900,
      fontFamily: "Inter, sans-serif",
      background: BG_LIGHT,
      overflow: "hidden",
    }}
  >
    <Sidebar />

    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
      <Topbar />

      <main
        style={{
          flex: 1,
          overflow: "auto",
          padding: 24,
          display: "flex",
          gap: 20,
        }}
      >
        {/* Colonne gauche ~65% */}
        <div
          style={{
            flex: "0 0 calc(65% - 10px)",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            minWidth: 0,
          }}
        >
          {/* Bonjour header */}
          <div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: TEXT_PRIMARY,
                margin: 0,
                fontFamily: "'Chillax', sans-serif",
              }}
            >
              Bonjour, Léona 👋
            </h1>
            <p
              style={{
                fontSize: 13,
                color: TEXT_SECONDARY,
                margin: "4px 0 0",
              }}
            >
              Voici un résumé de votre activité du jour — jeudi 19 mars 2026
            </p>
          </div>

          <KpiCards />
          <InfosAlertes />
          <LoyersChart />
        </div>

        {/* Colonne droite ~35% */}
        <div
          style={{
            flex: "0 0 calc(35% - 10px)",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            minWidth: 0,
          }}
        >
          <TodoList />
          <Agenda />
        </div>
      </main>
    </div>
  </div>
);
