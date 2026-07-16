import React from 'react';
import { C, F } from '../../tokens';

const KpiCard: React.FC<{ icon: string; label: string; value: string | number; color: string }> = ({ icon, label, value, color }) => (
  <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }}>
    <div style={{ fontSize: 24, marginBottom: 10 }}>{icon}</div>
    <div style={{ fontFamily: F.display, fontSize: 28, fontWeight: 700, color, letterSpacing: '-0.5px' }}>{value}</div>
    <div style={{ fontSize: 13, color: C.textSecondary, marginTop: 4 }}>{label}</div>
  </div>
);

const BienCard: React.FC<{ address: string; type: string; surface: string; loyer: string; status: string; statusColor: string }> = ({ address, type, surface, loyer, status, statusColor }) => (
  <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
    <div style={{ width: 48, height: 48, borderRadius: 10, background: C.bgLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🏠</div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, marginBottom: 2 }}>{address}</div>
      <div style={{ fontSize: 12, color: C.textSecondary }}>{type} · {surface}</div>
    </div>
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>{loyer}</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: statusColor, marginTop: 2 }}>{status}</div>
    </div>
  </div>
);

export const MiseEnLocation: React.FC = () => (
  <div>
    <div style={{ marginBottom: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, margin: 0 }}>Mise en location</h1>
      <p style={{ fontSize: 13, color: C.textSecondary, marginTop: 4 }}>Gérez vos biens disponibles à la location</p>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
      <KpiCard icon="🏠" label="Biens à louer" value={2} color={C.accent}/>
      <KpiCard icon="📥" label="Candidatures reçues" value={7} color="#3B7DF8"/>
      <KpiCard icon="📅" label="Visites planifiées" value={3} color="#8B5CF6"/>
      <KpiCard icon="✍️" label="Baux en signature" value={1} color="#28A566"/>
    </div>
    <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, margin: 0 }}>Biens disponibles</h2>
      <button style={{ padding: '8px 16px', borderRadius: 20, border: 'none', background: C.accent, color: 'white', fontSize: 12, fontWeight: 600 }}>+ Ajouter un bien</button>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <BienCard address="45 rue Championnet, Paris 17e" type="T3" surface="68 m²" loyer="1 450 €/mois" status="● Disponible" statusColor="#28A566"/>
      <BienCard address="12 avenue Niel, Paris 17e" type="Studio" surface="32 m²" loyer="890 €/mois" status="● Visite prévue" statusColor={C.accent}/>
    </div>
  </div>
);
