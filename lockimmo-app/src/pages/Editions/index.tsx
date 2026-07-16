import React from 'react';
import { C } from '../../tokens';

const DocCard: React.FC<{ icon: string; title: string; count: number; color: string }> = ({ icon, title, count, color }) => (
  <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{icon}</div>
      <span style={{ fontSize: 11, color: C.textSecondary }}>{count} doc{count > 1 ? 's' : ''}</span>
    </div>
    <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, marginBottom: 12 }}>{title}</div>
    <button style={{ width: '100%', padding: '8px', borderRadius: 8, border: `1px solid ${color}`, background: 'transparent', color, fontSize: 12, fontWeight: 600 }}>Générer</button>
  </div>
);

export const Editions: React.FC = () => (
  <div>
    <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, margin: 0 }}>Éditions</h1>
        <p style={{ fontSize: 13, color: C.textSecondary, marginTop: 4 }}>Générez et téléchargez vos documents</p>
      </div>
      <button style={{ padding: '8px 16px', borderRadius: 20, border: 'none', background: C.accent, color: 'white', fontSize: 12, fontWeight: 600 }}>📥 Tout exporter</button>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      <DocCard icon="🧾" title="Quittances de loyer" count={10} color={C.accent}/>
      <DocCard icon="📋" title="Appels de loyer" count={10} color="#3B7DF8"/>
      <DocCard icon="📄" title="Contrats de bail" count={11} color="#8B5CF6"/>
      <DocCard icon="✉️" title="Courriers & relances" count={5} color="#FF8753"/>
      <DocCard icon="📊" title="Rapports de gestion" count={2} color="#28A566"/>
      <DocCard icon="🏅" title="Attestations diverses" count={8} color="#8B5CF6"/>
    </div>
  </div>
);
