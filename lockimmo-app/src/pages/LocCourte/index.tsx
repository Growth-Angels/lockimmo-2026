import React from 'react';
import { C, F } from '../../tokens';

export const LocCourte: React.FC = () => (
  <div>
    <div style={{ marginBottom: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, margin: 0 }}>Location courte durée</h1>
      <p style={{ fontSize: 13, color: C.textSecondary, marginTop: 4 }}>Gérez vos locations saisonnières et courte durée</p>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
      {[
        { icon: '🏠', label: 'Logements actifs', value: '0', color: C.textSecondary },
        { icon: '📅', label: 'Réservations ce mois', value: '0', color: C.textSecondary },
        { icon: '📊', label: "Taux d'occupation", value: '—', color: C.textSecondary },
        { icon: '💶', label: 'Revenu moy./nuit', value: '—', color: C.textSecondary },
      ].map(k => (
        <div key={k.label} style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }}>
          <div style={{ fontSize: 24, marginBottom: 10 }}>{k.icon}</div>
          <div style={{ fontFamily: F.display, fontSize: 28, fontWeight: 700, color: k.color, letterSpacing: '-0.5px' }}>{k.value}</div>
          <div style={{ fontSize: 13, color: C.textSecondary, marginTop: 4 }}>{k.label}</div>
        </div>
      ))}
    </div>
    <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: 48, textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🏖️</div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: C.textPrimary, marginBottom: 8 }}>Aucun logement configuré</h2>
      <p style={{ fontSize: 13, color: C.textSecondary, marginBottom: 20 }}>Ajoutez un bien en location courte durée pour commencer à gérer vos réservations.</p>
      <button style={{ padding: '10px 24px', borderRadius: 20, border: 'none', background: C.accent, color: 'white', fontSize: 14, fontWeight: 600 }}>+ Ajouter un logement</button>
    </div>
  </div>
);
