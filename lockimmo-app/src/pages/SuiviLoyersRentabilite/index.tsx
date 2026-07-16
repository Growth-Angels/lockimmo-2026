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

const MONTHS  = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
const ENCAISSE = [17800, 18600, 21000, 19400, 21800, 22600, 21100, 22000, 23400, 22900, 24200, 25500];
const PREVU    = [18500, 19400, 21800, 20600, 22600, 23200, 22000, 22800, 24000, 23600, 24800, 26000];
const MAX_V = 28000;

const LOYERS_PAR_BIEN = [
  { bien: 'Apt. 3B · Paris 11e',     loyer: '1 250 €', encaisse: 100, rentab: 7.2 },
  { bien: 'Studio · Lyon Croix-R.',  loyer: '790 €',   encaisse: 100, rentab: 6.8 },
  { bien: 'Maison · Bordeaux',       loyer: '1 100 €', encaisse: 100, rentab: 6.1 },
  { bien: 'Local · Nantes centre',   loyer: '1 800 €', encaisse: 100, rentab: 5.8 },
  { bien: 'Parking · Montpellier',   loyer: '220 €',   encaisse: 0,   rentab: 5.2 },
];

const FILTERS = ['12 mois', '6 mois', '3 mois', 'Cette année'];

export const SuiviLoyersRentabilite: React.FC = () => {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, margin: 0 }}>
            Suivi loyers &amp; rentabilité
          </h1>
          <p style={{ fontSize: 13, color: C.textSecondary, marginTop: 4 }}>
            Encaissements, rendements et impayés en temps réel
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6, background: C.white, padding: 4, borderRadius: 20, border: `1px solid ${C.border}` }}>
          {FILTERS.map((f, i) => (
            <button key={f} style={{
              padding: '7px 14px', borderRadius: 16, border: 'none',
              background: i === 0 ? C.accent : 'transparent',
              color: i === 0 ? 'white' : C.textSecondary,
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>
              {f}
            </button>
          ))}
        </div>
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
          iconBg="rgba(40,165,102,0.10)"
          icon={<span style={{ color: C.success }}><Svg><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></Svg></span>}
          value="25 500 €"
          label="Loyers encaissés (mois)"
          trend="↑ +5,4 %"
          trendColor={C.success}
        />
        <KpiCard
          iconBg="rgba(224,82,82,0.10)"
          icon={<span style={{ color: C.error }}><Svg><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></Svg></span>}
          value="1 250 €"
          label="Loyers impayés"
          trend="2 dossiers"
          trendColor={C.error}
        />
        <KpiCard
          iconBg="rgba(139,92,246,0.10)"
          icon={<span style={{ color: C.purple }}><Svg><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></Svg></span>}
          value="6,4 %"
          label="Rentabilité moyenne"
          trend="↑ +0,2 pt"
          trendColor={C.success}
        />
      </div>

      {/* Chart card */}
      <div style={{
        background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20, marginBottom: 16,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>Évolution des loyers encaissés</div>
            <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 2 }}>vs. loyers attendus — 12 derniers mois</div>
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: C.accent }} />
              <span style={{ color: C.textSecondary }}>Encaissé</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(53,50,48,0.15)' }} />
              <span style={{ color: C.textSecondary }}>Attendu</span>
            </div>
          </div>
        </div>

        {/* Bars */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 200, padding: '0 4px' }}>
          {MONTHS.map((m, i) => {
            const hEnc = (ENCAISSE[i] / MAX_V) * 100;
            const hPrev = (PREVU[i] / MAX_V) * 100;
            return (
              <div key={m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 3, width: '100%', justifyContent: 'center' }}>
                  <div style={{ width: 10, height: `${hPrev}%`, background: 'rgba(53,50,48,0.15)', borderRadius: '3px 3px 0 0' }} />
                  <div style={{ width: 10, height: `${hEnc}%`,  background: C.accent,                borderRadius: '3px 3px 0 0' }} />
                </div>
                <span style={{ fontSize: 11, color: C.textSecondary }}>{m}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Loyers par bien — table */}
      <div style={{
        background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20, marginBottom: 16,
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary, marginBottom: 14 }}>
          Loyers par bien
        </div>

        {/* Header row */}
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 1.4fr 1fr',
          padding: '8px 0', borderBottom: `1px solid ${C.border}`,
          fontSize: 11, fontWeight: 600, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em',
        }}>
          <span>Bien</span>
          <span>Loyer</span>
          <span>Encaissement</span>
          <span style={{ textAlign: 'right' }}>Rentabilité</span>
        </div>

        {LOYERS_PAR_BIEN.map((r) => (
          <div key={r.bien} style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 1.4fr 1fr',
            padding: '14px 0', borderBottom: `1px solid ${C.border}`,
            fontSize: 13, color: C.textPrimary, alignItems: 'center',
          }}>
            <span style={{ fontWeight: 500 }}>{r.bien}</span>
            <span style={{ fontWeight: 600 }}>{r.loyer}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, maxWidth: 120, height: 5, background: 'rgba(53,50,48,0.06)', borderRadius: 100, overflow: 'hidden' }}>
                <div style={{ width: `${r.encaisse}%`, height: '100%', background: r.encaisse === 100 ? C.success : C.error }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: r.encaisse === 100 ? C.success : C.error }}>
                {r.encaisse}%
              </span>
            </div>
            <span style={{ textAlign: 'right', fontWeight: 600, color: C.purple }}>{r.rentab.toFixed(1)} %</span>
          </div>
        ))}
      </div>

      {/* Analyse IA — skeleton */}
      <div style={{
        background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'rgba(255,135,83,0.12)', color: C.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1.5 L13.8 10.2 L22.5 12 L13.8 13.8 L12 22.5 L10.2 13.8 L1.5 12 L10.2 10.2 Z"/></svg>
          </span>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>Analyse IA</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Skel w="92%" />
          <Skel w="86%" />
          <Skel w="74%" />
          <Skel w="40%" />
        </div>
      </div>
    </div>
  );
};
