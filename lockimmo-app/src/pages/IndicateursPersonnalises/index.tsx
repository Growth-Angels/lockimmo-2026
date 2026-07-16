import React from 'react';
import { C, F } from '../../tokens';

const Svg: React.FC<{ children: React.ReactNode; size?: number }> = ({ children, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const Skel: React.FC<{ w: string; h?: number }> = ({ w, h = 10 }) => (
  <span style={{ display: 'block', width: w, height: h, borderRadius: 100, background: 'rgba(53,50,48,0.08)' }} />
);

/* Sparkline — area + line */
const Sparkline: React.FC<{ values: number[]; color: string }> = ({ values, color }) => {
  const W = 140, H = 36;
  const min = Math.min(...values), max = Math.max(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => [
    (i / (values.length - 1)) * W,
    H - ((v - min) / range) * (H - 4) - 2,
  ] as [number, number]);
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const area = `${line} L ${W} ${H} L 0 ${H} Z`;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`g-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.24" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#g-${color.replace('#','')})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

interface IndicatorCard {
  id: string;
  iconBg: string;
  iconColor: string;
  iconPath: React.ReactNode;
  value: string;
  label: string;
  trend: string;
  trendColor: string;
  sparkValues: number[];
  sparkColor: string;
}

const INDICATORS: IndicatorCard[] = [
  {
    id: 'occ',
    iconBg: 'rgba(255,135,83,0.12)', iconColor: C.accent,
    iconPath: <Svg><polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/><polyline points="17,6 23,6 23,12"/></Svg>,
    value: '+92 %', label: "Taux d'occupation", trend: '↑ +32 pts', trendColor: C.success,
    sparkValues: [60, 64, 68, 72, 75, 80, 82, 85, 88, 90, 91, 92], sparkColor: C.accent,
  },
  {
    id: 'revenue',
    iconBg: 'rgba(40,165,102,0.10)', iconColor: C.success,
    iconPath: <Svg><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></Svg>,
    value: '25 500 €', label: 'Revenus mensuels', trend: '↑ +5,4 %', trendColor: C.success,
    sparkValues: [17800, 18600, 21000, 19400, 21800, 22600, 21100, 22000, 23400, 22900, 24200, 25500], sparkColor: C.success,
  },
  {
    id: 'yield',
    iconBg: 'rgba(139,92,246,0.10)', iconColor: C.purple,
    iconPath: <Svg><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></Svg>,
    value: '6,4 %', label: 'Rendement moyen', trend: '↑ +0,2 pt', trendColor: C.success,
    sparkValues: [5.8, 5.9, 6.0, 6.0, 6.1, 6.2, 6.2, 6.3, 6.3, 6.4, 6.4, 6.4], sparkColor: C.purple,
  },
  {
    id: 'delay',
    iconBg: 'rgba(224,82,82,0.10)', iconColor: C.error,
    iconPath: <Svg><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></Svg>,
    value: '4,2 j', label: 'Délai moyen encaissement', trend: '↓ −1,1 j', trendColor: C.success,
    sparkValues: [6.8, 6.5, 6.0, 5.8, 5.5, 5.4, 5.0, 4.8, 4.6, 4.4, 4.3, 4.2], sparkColor: C.error,
  },
  {
    id: 'turn',
    iconBg: 'rgba(59,125,248,0.10)', iconColor: C.blue,
    iconPath: <Svg><polyline points="23,4 23,10 17,10"/><polyline points="1,20 1,14 7,14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></Svg>,
    value: '11,4 %', label: 'Rotation locataires', trend: '↓ −2,1 pts', trendColor: C.success,
    sparkValues: [14, 13.6, 13.2, 12.8, 12.5, 12.2, 12, 11.8, 11.6, 11.5, 11.4, 11.4], sparkColor: C.blue,
  },
  {
    id: 'sat',
    iconBg: 'rgba(255,135,83,0.12)', iconColor: C.accent,
    iconPath: <Svg><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></Svg>,
    value: '4,8 / 5', label: 'Satisfaction locataires', trend: '↑ +0,3', trendColor: C.success,
    sparkValues: [4.2, 4.3, 4.3, 4.4, 4.5, 4.5, 4.6, 4.6, 4.7, 4.7, 4.8, 4.8], sparkColor: C.accent,
  },
];

const SUGGESTIONS = [
  { title: 'Coût moyen par intervention',   desc: 'Suivi des dépenses d\'entretien' },
  { title: 'Ratio charges / loyers',         desc: 'Indicateur clé de rentabilité nette' },
  { title: 'Taux de relance',                desc: 'Efficacité des recouvrements' },
];

const KpiCard: React.FC<{ ind: IndicatorCard }> = ({ ind }) => (
  <div style={{
    flex: '1 1 calc(33.333% - 11px)', minWidth: 240,
    background: C.white, borderRadius: 12,
    border: `1px solid ${C.border}`, padding: '18px 20px',
    display: 'flex', flexDirection: 'column', gap: 14,
    position: 'relative',
  }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div style={{
        width: 42, height: 42, borderRadius: 10,
        background: ind.iconBg, color: ind.iconColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {ind.iconPath}
      </div>
      <button style={{
        background: 'transparent', border: 'none', cursor: 'pointer',
        color: C.textSecondary, padding: 4, borderRadius: 6,
      }} title="Configurer">
        <Svg size={16}><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></Svg>
      </button>
    </div>
    <div>
      <div style={{ fontFamily: F.display, fontSize: 28, fontWeight: 700, color: C.textPrimary, letterSpacing: '-0.5px', lineHeight: 1 }}>{ind.value}</div>
      <div style={{ fontSize: 13, color: C.textSecondary, marginTop: 4 }}>{ind.label}</div>
    </div>
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: ind.trendColor }}>{ind.trend}</span>
      <Sparkline values={ind.sparkValues} color={ind.sparkColor} />
    </div>
  </div>
);

export const IndicateursPersonnalises: React.FC = () => {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, margin: 0 }}>
            Indicateurs personnalisés
          </h1>
          <p style={{ fontSize: 13, color: C.textSecondary, marginTop: 4 }}>
            Composez votre tableau de bord avec les métriques qui comptent pour vous
          </p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '9px 18px', borderRadius: 20, border: 'none',
          background: C.accent, color: 'white',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(255,135,83,0.35)',
        }}>
          <Svg size={14}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Svg>
          Ajouter un indicateur
        </button>
      </div>

      {/* Grid of indicators */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
        {INDICATORS.map((ind) => (
          <KpiCard key={ind.id} ind={ind} />
        ))}
      </div>

      {/* Suggestions */}
      <div style={{
        background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>Suggestions d'indicateurs</div>
          <button style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: C.accent, fontSize: 12, fontWeight: 600,
          }}>Voir tout →</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {SUGGESTIONS.map((s) => (
            <div key={s.title} style={{
              border: `1px dashed ${C.border}`, borderRadius: 10,
              padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8,
              cursor: 'pointer', transition: 'background 0.15s',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{s.title}</div>
                <span style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: 'rgba(255,135,83,0.12)', color: C.accent,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Svg size={12}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Svg>
                </span>
              </div>
              <div style={{ fontSize: 12, color: C.textSecondary }}>{s.desc}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                <Skel w="80%" h={6} />
                <Skel w="56%" h={6} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
