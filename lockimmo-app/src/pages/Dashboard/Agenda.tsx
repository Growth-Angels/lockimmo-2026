import React from 'react';
import { C } from '../../tokens';

const DAYS = [
  { n: 16, d: 'lun' }, { n: 17, d: 'mar' }, { n: 18, d: 'mer' },
  { n: 19, d: 'jeu', today: true },
  { n: 20, d: 'ven' }, { n: 21, d: 'sam' }, { n: 22, d: 'dim' },
];

const EVENTS = [
  { color: '#8B5CF6', bg: 'rgba(139,92,246,0.06)', title: 'État des lieux – Dupont', time: '09:00', location: '12 rue de la Paix', tag: 'EDL', tagColor: '#8B5CF6', tagBg: 'rgba(139,92,246,0.12)' },
  { color: '#FF8753', bg: 'rgba(255,135,83,0.06)', title: 'Rendez-vous propriétaire', time: '11:30', location: '', tag: 'RDV', tagColor: '#FF8753', tagBg: 'rgba(255,135,83,0.12)' },
  { color: '#3B7DF8', bg: 'rgba(59,125,248,0.06)', title: 'Visite appartement T3', time: '14:00', location: '45 bd Haussmann', tag: 'Visite', tagColor: '#3B7DF8', tagBg: 'rgba(59,125,248,0.12)' },
];

export const Agenda: React.FC = () => (
  <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }}>
    {/* Header */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <span style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary }}>Votre agenda</span>
      <span style={{ fontSize: 12, color: C.accent, fontWeight: 600, cursor: 'pointer' }}>Voir le planning ›</span>
    </div>

    {/* New RDV button */}
    <button style={{
      width: '100%', padding: '10px', border: `1px solid ${C.accent}`,
      borderRadius: 8, background: 'white', color: C.accent,
      fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 16,
    }}>+ Nouveau rendez-vous</button>

    {/* Week strip */}
    <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
      {DAYS.map(({ n, d, today }) => (
        <div key={n} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: today ? C.accent : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: today ? 'white' : C.textPrimary,
          }}>{n}</div>
          <div style={{ fontSize: 10, color: today ? C.accent : C.textSecondary, fontWeight: today ? 600 : 400 }}>{d}</div>
        </div>
      ))}
    </div>

    {/* Events */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {EVENTS.map((ev, i) => (
        <div key={i} style={{
          borderLeft: `3px solid ${ev.color}`,
          background: ev.bg, borderRadius: '0 8px 8px 0',
          padding: '10px 12px',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8,
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, marginBottom: 3 }}>{ev.title}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: C.textSecondary }}>
              <span>⏰ {ev.time}</span>
              {ev.location && <span>📍 {ev.location}</span>}
            </div>
          </div>
          <div style={{
            padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700,
            color: ev.tagColor, background: ev.tagBg, flexShrink: 0,
          }}>{ev.tag}</div>
        </div>
      ))}
    </div>
  </div>
);
