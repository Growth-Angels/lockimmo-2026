import React, { useState } from 'react';
import { C } from '../../tokens';
import { KpiCards } from './KpiCards';
import { InfosAlertes } from './InfosAlertes';
import { LoyersChart } from './LoyersChart';
import { TodoList } from './TodoList';
import { Agenda } from './Agenda';
import { AILoaderModal } from '../../components/ui/AILoaderModal';

export const Dashboard: React.FC = () => {
  const [aiOpen, setAiOpen] = useState(false);

  return (
  <div>
    <AILoaderModal open={aiOpen} onClose={() => setAiOpen(false)} />

    {/* Header */}
    <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, margin: 0 }}>
          Bonjour, Léona 👋
        </h1>
        <p style={{ fontSize: 13, color: C.textSecondary, marginTop: 4 }}>
          Voici un résumé de votre activité du jour — jeudi 19 mars 2026
        </p>
      </div>
      <button onClick={() => setAiOpen(true)} style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '9px 18px', borderRadius: 20, border: 'none',
        background: C.accent, color: 'white',
        fontSize: 13, fontWeight: 600, cursor: 'pointer',
        boxShadow: '0 4px 14px rgba(255,135,83,0.35)',
        flexShrink: 0,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
          <path d="M12 1.5 L13.8 10.2 L22.5 12 L13.8 13.8 L12 22.5 L10.2 13.8 L1.5 12 L10.2 10.2 Z"/>
        </svg>
        Analyser avec l'IA
      </button>
    </div>

    {/* 2-column layout */}
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
      {/* Left column */}
      <div style={{ flex: '0 0 63%', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <KpiCards />
        <InfosAlertes />
        <LoyersChart />
      </div>

      {/* Right column */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <TodoList />
        <Agenda />
      </div>
    </div>
  </div>
  );
};
