import React from 'react';
import { C, F } from '../../tokens';

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
      width: 42, height: 42, borderRadius: '50%',
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

const Svg: React.FC<{ children: React.ReactNode; size?: number }> = ({ children, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export const KpiCards: React.FC = () => (
  <div style={{ display: 'flex', gap: 16 }}>
    <KpiCard
      iconBg="rgba(255,135,83,0.12)"
      icon={<span style={{ color: C.accent }}><Svg><polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/><polyline points="17,6 23,6 23,12"/></Svg></span>}
      value="90 %"
      label="Taux d'occupation"
      trend="↑ +2 pts"
      trendColor={C.success}
    />
    <KpiCard
      iconBg="rgba(53,50,48,0.08)"
      icon={<span style={{ color: C.textPrimary }}><Svg><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></Svg></span>}
      value="10"
      label="Biens loués"
      trend="↑ sur 11 biens"
      trendColor={C.success}
    />
    <KpiCard
      iconBg="rgba(224,82,82,0.10)"
      icon={<span style={{ color: C.error }}><Svg><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></Svg></span>}
      value="5"
      label="Dossiers impayés"
      trend="↓ à régulariser"
      trendColor={C.error}
    />
    <KpiCard
      iconBg="rgba(255,135,83,0.12)"
      icon={<span style={{ color: C.accent }}><Svg><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></Svg></span>}
      value="1"
      label="Biens vacants"
      trend="en mise en loc."
      trendColor={C.textSecondary}
    />
  </div>
);
