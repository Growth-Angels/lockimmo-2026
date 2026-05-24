import React from "react";
import { AbsoluteFill } from "remotion";
import { Dashboard } from "../components/dashboard/Dashboard";

export const DashboardFull: React.FC = () => (
  <AbsoluteFill style={{ width: 1440, height: 900 }}>
    <Dashboard />
  </AbsoluteFill>
);
