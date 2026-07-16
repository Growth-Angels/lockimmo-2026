import React from 'react';
import { C, F } from '../../tokens';

const MsgRow: React.FC<{ avatar: string; name: string; msg: string; time: string; unread?: boolean }> = ({ avatar, name, msg, time, unread }) => (
  <div style={{
    display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 0',
    borderBottom: `1px solid ${C.border}`, cursor: 'pointer',
  }}>
    <div style={{ width: 38, height: 38, borderRadius: '50%', background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: 'white', flexShrink: 0 }}>{avatar}</div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: 13, fontWeight: unread ? 700 : 600, color: C.textPrimary }}>{name}</span>
        <span style={{ fontSize: 11, color: C.textSecondary }}>{time}</span>
      </div>
      <div style={{ fontSize: 12, color: unread ? C.textPrimary : C.textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg}</div>
    </div>
    {unread && <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.accent, flexShrink: 0, marginTop: 6 }}/>}
  </div>
);

export const Communication: React.FC = () => (
  <div>
    <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, margin: 0 }}>Communication</h1>
        <p style={{ fontSize: 13, color: C.textSecondary, marginTop: 4 }}>Messagerie et notifications</p>
      </div>
      <button style={{ padding: '8px 16px', borderRadius: 20, border: 'none', background: C.accent, color: 'white', fontSize: 12, fontWeight: 600 }}>+ Nouveau message</button>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
      {[
        { icon: '💬', label: 'Messages non lus', value: 3, color: C.accent },
        { icon: '🔔', label: 'Notifications envoyées', value: 12, color: '#3B7DF8' },
        { icon: '🤖', label: 'Relances automatiques', value: 5, color: '#8B5CF6' },
        { icon: '📧', label: 'Emails programmés', value: 2, color: '#28A566' },
      ].map(k => (
        <div key={k.label} style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }}>
          <div style={{ fontSize: 22, marginBottom: 8 }}>{k.icon}</div>
          <div style={{ fontFamily: F.display, fontSize: 26, fontWeight: 700, color: k.color, letterSpacing: '-0.5px' }}>{k.value}</div>
          <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 4 }}>{k.label}</div>
        </div>
      ))}
    </div>

    <div style={{ display: 'flex', gap: 20 }}>
      <div style={{ flex: 1, background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>Messages récents</h2>
        <MsgRow avatar="M" name="Martin Dubois" msg="Bonjour, j'ai bien reçu ma quittance de mars..." time="10:24" unread/>
        <MsgRow avatar="S" name="Sophie Laurent" msg="Est-ce possible de décaler le RDV état des lieux ?" time="09:15" unread/>
        <MsgRow avatar="P" name="Pierre Moreau" msg="Merci pour l'attestation de loyer !" time="Hier" unread/>
        <MsgRow avatar="C" name="Claire Petit" msg="Quand sera effectué le virement de ce mois ?" time="Hier"/>
        <MsgRow avatar="J" name="Jean Bernard" msg="Votre équipe est très réactive, merci !" time="Lun"/>
      </div>
      <div style={{ flex: 1, background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary, marginBottom: 16 }}>Relances automatiques actives</h2>
        {[
          { label: 'Relance loyer impayé J+5', status: 'Active', color: '#28A566' },
          { label: 'Rappel renouvellement bail', status: 'Active', color: '#28A566' },
          { label: 'Demande attestation assurance', status: 'En pause', color: C.textSecondary },
          { label: "Rappel révision annuelle loyer", status: 'Active', color: '#28A566' },
          { label: 'Alerte expiration mandat', status: 'Active', color: '#28A566' },
        ].map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 4 ? `1px solid ${C.border}` : 'none' }}>
            <span style={{ fontSize: 13, color: C.textPrimary }}>🤖 {r.label}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: r.color }}>{r.status}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);
