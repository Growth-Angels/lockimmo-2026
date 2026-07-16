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

interface KpiProps {
  iconBg: string;
  icon: React.ReactNode;
  value: string;
  label: string;
  trend: string;
  trendColor: string;
}
const KpiCard: React.FC<KpiProps> = ({ iconBg, icon, value, label, trend, trendColor }) => (
  <div style={{
    flex: 1, background: C.white, borderRadius: 12,
    border: `1px solid ${C.border}`, padding: '18px 20px',
    display: 'flex', flexDirection: 'column', gap: 10,
  }}>
    <div style={{
      width: 42, height: 42, borderRadius: 10,
      background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontFamily: F.display, fontSize: 28, fontWeight: 700, color: C.textPrimary, letterSpacing: '-0.5px', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, color: C.textSecondary, marginTop: 4 }}>{label}</div>
    </div>
    <div style={{ fontSize: 12, fontWeight: 600, color: trendColor }}>{trend}</div>
  </div>
);

const PORTFOLIO_BREAKDOWN = [
  { label: 'Appartements', value: 8, pct: 73 },
  { label: 'Maisons',      value: 2, pct: 18 },
  { label: 'Locaux com.',  value: 1, pct: 9  },
];

const TOP_BIENS = [
  { label: 'Apt. 3B · Paris 11e',     occ: 100, rev: '1 250 €' },
  { label: 'Studio · Lyon Croix-R.',   occ: 100, rev: '790 €'   },
  { label: 'Maison · Bordeaux',        occ: 92,  rev: '1 100 €' },
  { label: 'Local · Nantes centre',    occ: 100, rev: '1 800 €' },
  { label: 'Parking · Montpellier',    occ: 75,  rev: '220 €'   },
];

export const TableauDeBordGlobal: React.FC = () => {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, margin: 0 }}>
            Tableau de bord global
          </h1>
          <p style={{ fontSize: 13, color: C.textSecondary, marginTop: 4 }}>
            Vue d'ensemble consolidée de votre portefeuille — mai 2026
          </p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '9px 18px', borderRadius: 20, border: 'none',
          background: C.accent, color: 'white',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(255,135,83,0.35)',
        }}>
          <span style={{ color: 'white' }}><Svg size={14}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></Svg></span>
          Personnaliser
        </button>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <KpiCard
          iconBg="rgba(255,135,83,0.12)"
          icon={<span style={{ color: C.accent }}><Svg><polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/><polyline points="17,6 23,6 23,12"/></Svg></span>}
          value="+92 %"
          label="Taux d'occupation"
          trend="↑ +32 pts"
          trendColor={C.success}
        />
        <KpiCard
          iconBg="rgba(53,50,48,0.08)"
          icon={<span style={{ color: C.textPrimary }}><Svg><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></Svg></span>}
          value="11"
          label="Biens en portefeuille"
          trend="↑ +1 ce mois"
          trendColor={C.success}
        />
        <KpiCard
          iconBg="rgba(59,125,248,0.10)"
          icon={<span style={{ color: C.blue }}><Svg><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></Svg></span>}
          value="269 700 €"
          label="Revenus annuels"
          trend="↑ +8,4 %"
          trendColor={C.success}
        />
        <KpiCard
          iconBg="rgba(139,92,246,0.10)"
          icon={<span style={{ color: C.purple }}><Svg><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></Svg></span>}
          value="6,4 %"
          label="Rendement moyen"
          trend="↑ +0,2 pt"
          trendColor={C.success}
        />
      </div>

      {/* 2-col block */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'flex-start' }}>
        {/* Left — répartition */}
        <div style={{
          flex: '0 0 38%', background: C.white, borderRadius: 12,
          border: `1px solid ${C.border}`, padding: 20,
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary, marginBottom: 18 }}>
            Répartition du portefeuille
          </div>

          {/* Bar empilée */}
          <div style={{ display: 'flex', height: 10, borderRadius: 100, overflow: 'hidden', marginBottom: 18 }}>
            <div style={{ width: '73%', background: C.accent }} />
            <div style={{ width: '18%', background: C.blue }} />
            <div style={{ width: '9%',  background: C.purple }} />
          </div>

          {PORTFOLIO_BREAKDOWN.map((b, i) => (
            <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: i === 0 ? 'none' : `1px solid ${C.border}` }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: [C.accent, C.blue, C.purple][i] }} />
              <span style={{ flex: 1, fontSize: 13, color: C.textPrimary }}>{b.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{b.value}</span>
              <span style={{ fontSize: 12, color: C.textSecondary, width: 36, textAlign: 'right' }}>{b.pct}%</span>
            </div>
          ))}
        </div>

        {/* Right — performance par bien */}
        <div style={{
          flex: 1, background: C.white, borderRadius: 12,
          border: `1px solid ${C.border}`, padding: 20,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>
              Performance par bien
            </div>
            <div style={{ fontSize: 12, color: C.textSecondary }}>Taux d'occupation</div>
          </div>

          {TOP_BIENS.map((b, i) => (
            <div key={b.label} style={{ padding: '10px 0', borderTop: i === 0 ? 'none' : `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: C.textPrimary, fontWeight: 500 }}>{b.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{b.rev}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, height: 6, background: 'rgba(53,50,48,0.06)', borderRadius: 100, overflow: 'hidden' }}>
                  <div style={{ width: `${b.occ}%`, height: '100%', background: b.occ === 100 ? C.success : C.accent }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: b.occ === 100 ? C.success : C.textSecondary, width: 42, textAlign: 'right' }}>
                  {b.occ}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activité récente — skeleton */}
      <div style={{
        background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20,
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary, marginBottom: 18 }}>
          Activité récente
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(53,50,48,0.06)', flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <Skel w={['68%', '54%', '72%', '46%'][i]} />
                <Skel w={['40%', '32%', '50%', '28%'][i]} h={8} />
              </div>
              <Skel w="60px" h={8} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
