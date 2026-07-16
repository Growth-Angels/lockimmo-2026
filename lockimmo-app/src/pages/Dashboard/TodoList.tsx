import React, { useState } from 'react';
import { C } from '../../tokens';

const TASKS = [
  { label: 'Renvoi des documents',                    date: '22/06/2023' },
  { label: 'Réimprimer document locataire X',         date: '16/08/2024' },
  { label: 'Tâche sur appartement à réaliser',        date: '16/08/2024' },
  { label: 'Départ locataire',                        date: '16/08/2024' },
  { label: 'Paiement propriétaire à réaliser',        date: '16/08/2024' },
  { label: 'Prendre RDV pour état des lieux de sortie', date: '31/10/2025' },
];

type Tab = 'faire' | 'robot' | 'terminees';

export const TodoList: React.FC = () => {
  const [tab, setTab] = useState<Tab>('faire');
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    const s = new Set(checked);
    s.has(i) ? s.delete(i) : s.add(i);
    setChecked(s);
  };

  return (
    <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary }}>To do list</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{
            padding: '6px 14px', borderRadius: 20, border: 'none',
            background: C.accent, color: 'white', fontSize: 12, fontWeight: 600,
          }}>+ Action</button>
          <button style={{
            padding: '6px 14px', borderRadius: 20, border: 'none',
            background: C.textPrimary, color: 'white', fontSize: 12, fontWeight: 600,
          }}>+ Process</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${C.border}`, marginBottom: 12 }}>
        {(['faire', 'robot', 'terminees'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 16px', border: 'none', background: 'transparent',
            fontSize: 13, fontWeight: tab === t ? 600 : 400,
            color: tab === t ? C.textPrimary : C.textSecondary,
            borderBottom: tab === t ? `2px solid ${C.accent}` : '2px solid transparent',
            marginBottom: -1, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {t === 'faire' ? 'À faire' : t === 'robot' ? 'Robot' : 'Terminées'}
            {t === 'faire' && (
              <span style={{
                background: C.accent, color: 'white', fontSize: 10, fontWeight: 700,
                borderRadius: 10, padding: '1px 6px',
              }}>{TASKS.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tasks */}
      {tab === 'faire' && TASKS.map((task, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '10px 0', borderBottom: i < TASKS.length - 1 ? `1px solid ${C.border}` : 'none',
        }}>
          <div onClick={() => toggle(i)} style={{
            width: 18, height: 18, borderRadius: '50%',
            border: `1.5px solid ${checked.has(i) ? C.accent : 'rgba(53,50,48,0.15)'}`,
            background: checked.has(i) ? C.accent : 'transparent',
            flexShrink: 0, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {checked.has(i) && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20,6 9,17 4,12"/></svg>}
          </div>
          <span style={{ flex: 1, fontSize: 13, color: checked.has(i) ? C.textSecondary : C.textPrimary, textDecoration: checked.has(i) ? 'line-through' : 'none' }}>
            {task.label}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
            <span style={{ fontSize: 11, color: C.accent, fontWeight: 500 }}>{task.date}</span>
          </div>
        </div>
      ))}

      {tab !== 'faire' && (
        <div style={{ textAlign: 'center', padding: '32px 0', color: C.textSecondary, fontSize: 13 }}>
          Aucun élément
        </div>
      )}
    </div>
  );
};
