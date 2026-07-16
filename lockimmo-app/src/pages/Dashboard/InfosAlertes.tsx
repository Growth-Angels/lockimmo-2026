import React from 'react';
import { C } from '../../tokens';

const Badge: React.FC<{ n: string | number; color: string; bg: string }> = ({ n, color, bg }) => (
  <div style={{
    minWidth: 22, height: 22, borderRadius: 11,
    background: bg, color, fontSize: 11, fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '0 6px',
  }}>{n}</div>
);

const Tag: React.FC<{ label: string }> = ({ label }) => (
  <div style={{
    background: '#F3F0ED', color: C.textPrimary,
    fontSize: 11, fontWeight: 600, borderRadius: 6,
    padding: '2px 8px',
  }}>{label}</div>
);

interface RowProps {
  icon: React.ReactNode;
  label: string;
  right: React.ReactNode;
  dimmed?: boolean;
}

const Row: React.FC<RowProps> = ({ icon, label, right, dimmed }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '9px 0', opacity: dimmed ? 0.42 : 1,
    borderBottom: `1px solid ${C.border}`,
  }}>
    <span style={{ flexShrink: 0, display: 'flex' }}>{icon}</span>
    <span style={{ flex: 1, fontSize: 13, color: C.textPrimary }}>{label}</span>
    {right}
  </div>
);

const SectionLabel: React.FC<{ label: string; color?: string }> = ({ label, color = C.textSecondary }) => (
  <div style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '16px 0 4px' }}>
    {label}
  </div>
);

const Ico: React.FC<{ d: string; color: string; size?: number }> = ({ d, color, size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
);

export const InfosAlertes: React.FC = () => (
  <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }}>
    {/* Header */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
      <span style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary }}>Infos &amp; alertes</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textSecondary} strokeWidth="1.8" strokeLinecap="round"><polyline points="23,4 23,10 17,10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
    </div>

    <SectionLabel label="À traiter en priorité" color={C.error} />
    <Row icon={<Ico d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" color={C.error}/>} label="Nouveaux sinistres" right={<Badge n={2} color="white" bg={C.error}/>}/>
    <Row icon={<Ico d="M1 4h22v4H1zM1 8h22v12H1z" color={C.error}/>} label="Dossiers impayés" right={<Badge n={5} color="white" bg={C.error}/>}/>
    <Row icon={<Ico d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" color={C.error}/>} label="Biens énergivores" right={<Badge n={3} color="white" bg={C.error}/>}/>

    <SectionLabel label="À surveiller" />
    <Row icon={<Ico d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" color={C.accent}/>} label="Attestations d'assurance" right={<Badge n={6} color="white" bg={C.accent}/>}/>
    <Row icon={<Ico d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" color={C.accent}/>} label="Attestations d'entretien" right={<Badge n={3} color="white" bg={C.accent}/>}/>
    <Row icon={<Ico d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" color={C.accent}/>} label="Baux arrivant à expiration" right={<Badge n={1} color="white" bg={C.accent}/>}/>
    <Row icon={<Ico d="M23 4l-10 8L3 4" color={C.accent}/>} label="Mandats à renouveler" right={<Badge n={2} color="white" bg={C.accent}/>}/>
    <Row icon={<Ico d="M18 6L6 18M6 6l12 12" color={C.textSecondary}/>} label="Baux à dénoncer" right={<Badge n={0} color={C.textSecondary} bg="#F3F0ED"/>} dimmed/>

    <SectionLabel label="Informations" />
    <Row icon={<Ico d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" color={C.textSecondary}/>} label="Biens loués" right={<Tag label="10"/>}/>
    <Row icon={<Ico d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" color={C.textSecondary}/>} label="Biens vacants" right={<Tag label="1"/>}/>
    <Row icon={<Ico d="M23 6l-9.5 9.5-5-5L1 18" color={C.textSecondary}/>} label="Taux d'occupation" right={<Tag label="90 %"/>}/>
    <Row icon={<Ico d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" color={C.textSecondary}/>} label="Révisions en anomalies" right={<Tag label="5"/>}/>
    <Row icon={<Ico d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" color={C.textSecondary}/>} label="Nouveaux documents reçus" right={<Tag label="1"/>}/>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', opacity: 0.42 }}>
      <Ico d="M20.49 15a9 9 0 11-2.12-9.36L23 10M23 4v6h-6" color={C.textSecondary}/>
      <span style={{ flex: 1, fontSize: 13, color: C.textPrimary }}>Révisions de loyers</span>
      <Tag label="0"/>
    </div>
  </div>
);
