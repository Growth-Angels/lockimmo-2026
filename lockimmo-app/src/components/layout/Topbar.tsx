import React from 'react';
import { C } from '../../tokens';

export const Topbar: React.FC = () => (
  <div style={{
    height: 56, flexShrink: 0,
    background: C.white, borderBottom: `1px solid ${C.border}`,
    display: 'flex', alignItems: 'center',
    padding: '0 24px', gap: 16,
  }}>
    {/* Search */}
    <div style={{
      flex: 1, maxWidth: 400,
      display: 'flex', alignItems: 'center', gap: 10,
      background: C.bgLight, borderRadius: 8,
      padding: '0 14px', height: 36,
    }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.textSecondary} strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        placeholder="Rechercher un bien, locataire, dossier..."
        style={{ flex: 1, fontSize: 13, color: C.textPrimary, background: 'transparent' }}
      />
    </div>

    <div style={{ flex: 1 }} />

    {/* Bell */}
    <div style={{ position: 'relative', cursor: 'pointer' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.textSecondary} strokeWidth="1.6" strokeLinecap="round">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
      </svg>
      <div style={{
        position: 'absolute', top: -4, right: -4,
        width: 16, height: 16, borderRadius: '50%',
        background: C.error, border: `2px solid ${C.white}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 9, fontWeight: 700, color: 'white',
      }}>3</div>
    </div>

    {/* User */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: C.accent, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontWeight: 700, fontSize: 13, color: 'white',
      }}>L</div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, lineHeight: 1.2 }}>Léona</div>
        <div style={{ fontSize: 11, color: C.textSecondary, lineHeight: 1.2 }}>Agence Welcome</div>
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textSecondary} strokeWidth="2" strokeLinecap="round">
        <polyline points="6,9 12,15 18,9"/>
      </svg>
    </div>
  </div>
);
