import React, { useState } from 'react';
import { C, F } from '../../tokens';

const DATA_2026 = [8000, 18000, 22000, 25000, 28000, 30000, 32000, 35000, 38000, 40000, 44000, 48000];
const DATA_2025 = [6000, 14000, 18000, 20000, 23000, 26000, 28000, 30000, 33000, 36000, 39000, 42000];
const DATA_2024 = [5000, 11000, 15000, 17000, 19000, 22000, 24000, 26000, 28000, 30000, 33000, 37000];

const MONTHS = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
const MAX_Y = 60000;
const W = 620; const H = 140; const PAD_L = 40; const PAD_B = 24; const PAD_R = 10; const PAD_T = 8;
const cW = W - PAD_L - PAD_R;
const cH = H - PAD_B - PAD_T;

const toXY = (data: number[]) =>
  data.map((v, i) => [
    PAD_L + (i / (data.length - 1)) * cW,
    PAD_T + cH - (v / MAX_Y) * cH,
  ] as [number, number]);

const pathD = (pts: [number, number][]) =>
  pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

const areaD = (pts: [number, number][]) => {
  const base = PAD_T + cH;
  return `${pathD(pts)} L${pts[pts.length - 1][0]},${base} L${pts[0][0]},${base} Z`;
};

export const LoyersChart: React.FC = () => {
  const [year, setYear] = useState<2024 | 2025 | 2026>(2026);
  const data = year === 2026 ? DATA_2026 : year === 2025 ? DATA_2025 : DATA_2024;
  const pts = toXY(data);
  const total = year === 2026 ? '560 300 €' : year === 2025 ? '374 000 €' : '293 000 €';
  const trend = year === 2026 ? '+6,3 %' : year === 2025 ? '+27,6 %' : '+12,4 %';

  return (
    <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary }}>Loyers &amp; facturations</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {([2024, 2025, 2026] as const).map(y => (
            <button key={y} onClick={() => setYear(y)} style={{
              padding: '4px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
              background: year === y ? C.accent : 'transparent',
              color: year === y ? 'white' : C.textSecondary,
            }}>{y}</button>
          ))}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textSecondary} strokeWidth="1.8" strokeLinecap="round"><polyline points="23,4 23,10 17,10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
        </div>
      </div>

      <div style={{ fontSize: 12, color: C.textSecondary, marginBottom: 16 }}>Situation des loyers — {year}</div>

      {/* Metric */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
          background: C.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round"><polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/></svg>
        </div>
        <div>
          <div style={{ fontSize: 11, color: C.textSecondary, marginBottom: 2 }}>Total loyers {year}</div>
          <div style={{ fontFamily: F.display, fontSize: 24, fontWeight: 700, color: C.textPrimary, letterSpacing: '-0.5px' }}>{total}</div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: C.textSecondary }}>vs année préc.</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.success }}>{trend}</div>
        </div>
      </div>

      {/* SVG Chart */}
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', overflow: 'visible' }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
          const y = PAD_T + cH * (1 - pct);
          return (
            <g key={i}>
              <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="#F3F0ED" strokeWidth="1"/>
              <text x={PAD_L - 6} y={y + 4} textAnchor="end" fontSize="9" fill={C.textSecondary}>
                {pct === 0 ? '0k' : `${Math.round(MAX_Y * pct / 1000)}k`}
              </text>
            </g>
          );
        })}
        {/* Area */}
        <path d={areaD(pts)} fill={`rgba(255,135,83,0.07)`}/>
        {/* Line */}
        <path d={pathD(pts)} stroke={C.accent} strokeWidth="2" fill="none" strokeLinejoin="round"/>
        {/* Dots at data points */}
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill={C.accent}/>
        ))}
        {/* X labels */}
        {MONTHS.map((m, i) => (
          <text key={m} x={PAD_L + (i / (MONTHS.length - 1)) * cW} y={H - 4}
            textAnchor="middle" fontSize="9" fill={C.textSecondary}>{m}</text>
        ))}
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.textSecondary }}>
          <div style={{ width: 16, height: 2, background: C.accent, borderRadius: 1 }}/>
          Loyers encaissés
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.textSecondary }}>
          <div style={{ width: 16, height: 2, background: 'rgba(255,135,83,0.4)', borderRadius: 1, backgroundImage: 'repeating-linear-gradient(to right, rgba(255,135,83,0.5) 0, rgba(255,135,83,0.5) 4px, transparent 4px, transparent 8px)' }}/>
          Charges refacturées
        </div>
      </div>
    </div>
  );
};
