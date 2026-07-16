import React from 'react';
import { C } from '../../tokens';

interface ActionCard {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  count: string;
  countColor?: string;
}

const SectionCard: React.FC<ActionCard> = ({ icon, iconBg, title, count, countColor = C.accent }) => (
  <div style={{
    background: C.white, borderRadius: 12, border: `1px solid ${C.border}`,
    padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
  }}>
    <div style={{
      width: 40, height: 40, borderRadius: 10, background: iconBg,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>{icon}</div>
    <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{title}</div>
    <div style={{
      padding: '3px 10px', borderRadius: 20, background: `${countColor}18`,
      color: countColor, fontSize: 12, fontWeight: 700,
    }}>{count}</div>
  </div>
);

const Svg: React.FC<{ color: string; children: React.ReactNode }> = ({ color, children }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div style={{ marginBottom: 14 }}>
    <h2 style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, margin: 0 }}>{title}</h2>
    {subtitle && <p style={{ fontSize: 12, color: C.textSecondary, marginTop: 3 }}>{subtitle}</p>}
  </div>
);

const BankRow: React.FC<{ bank: string; ref_: string; amount: string }> = ({ bank, ref_, amount }) => (
  <div style={{
    display: 'flex', alignItems: 'center', padding: '14px 18px',
    borderBottom: `1px solid ${C.border}`,
  }}>
    <div style={{
      width: 36, height: 36, borderRadius: 8, background: C.bgLight,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, marginRight: 12, fontSize: 11, fontWeight: 700, color: C.textSecondary,
    }}>🏦</div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{bank}</div>
      <div style={{ fontSize: 11, color: C.textSecondary, marginTop: 2 }}>{ref_}</div>
    </div>
    <div style={{ fontSize: 14, fontWeight: 700, color: C.error }}>{amount}</div>
  </div>
);

export const Gestion: React.FC = () => (
  <div>
    {/* Header */}
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 12, color: C.textSecondary, marginBottom: 4 }}>
        Tableau de bord &rsaquo; <span style={{ color: C.textPrimary, fontWeight: 500 }}>Gestion</span>
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, margin: 0 }}>Gestion</h1>
    </div>

    {/* Section 1: Calendrier */}
    <div style={{ marginBottom: 28 }}>
      <SectionHeader title="Calendrier de travail" subtitle="Actions à traiter ce mois-ci" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        <SectionCard icon={<Svg color={C.accent}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/></Svg>} iconBg={C.accentLight} title="Loyers & facturations" count="8 actions"/>
        <SectionCard icon={<Svg color="#3B7DF8"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></Svg>} iconBg="rgba(59,125,248,0.10)" title="Encaissements" count="3 actions" countColor="#3B7DF8"/>
        <SectionCard icon={<Svg color="#28A566"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6"/></Svg>} iconBg="rgba(40,165,102,0.10)" title="Dépenses" count="2 actions" countColor="#28A566"/>
        <SectionCard icon={<Svg color={C.accent}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></Svg>} iconBg={C.accentLight} title="Suivi & relances" count="5 actions"/>
        <SectionCard icon={<Svg color="#8B5CF6"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></Svg>} iconBg="rgba(139,92,246,0.10)" title="Paiements propriétaires" count="4 actions" countColor="#8B5CF6"/>
        <SectionCard icon={<Svg color="#FF8753"><polyline points="17,1 21,5 17,9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7,23 3,19 7,15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></Svg>} iconBg="rgba(243,156,18,0.10)" title="Transferts d'honoraires" count="1 action" countColor="#FF8753"/>
      </div>
    </div>

    {/* Section 2 */}
    <div style={{ display: 'flex', gap: 20, marginBottom: 28 }}>
      {/* Comptabilité */}
      <div style={{ flex: '0 0 60%' }}>
        <SectionHeader title="Comptabilité" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <SectionCard icon={<Svg color="#3B7DF8"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17,8 12,3 7,8"/><line x1="12" y1="3" x2="12" y2="15"/></Svg>} iconBg="rgba(59,125,248,0.10)" title="Synchro bancaire" count="À jour" countColor="#28A566"/>
          <SectionCard icon={<Svg color="#28A566"><polyline points="9,11 12,14 22,4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></Svg>} iconBg="rgba(40,165,102,0.10)" title="Checking" count="3 alertes" countColor={C.error}/>
          <SectionCard icon={<Svg color="#8B5CF6"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="10" x2="12" y2="16"/><line x1="9" y1="13" x2="15" y2="13"/></Svg>} iconBg="rgba(139,92,246,0.10)" title="Comptabilité" count="0 écart" countColor="#28A566"/>
          <SectionCard icon={<Svg color={C.accent}><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></Svg>} iconBg={C.accentLight} title="Audit" count="Conforme" countColor="#28A566"/>
        </div>
        <div style={{ background: "rgba(59,125,248,0.07)", border: "1px solid rgba(59,125,248,0.2)", borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B7DF8" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span style={{ fontSize: 12, color: "#3B7DF8" }}>Dernière synchronisation bancaire : il y a <strong>2 minutes</strong></span>
        </div>
      </div>

      {/* Mouvements locataires */}
      <div style={{ flex: 1 }}>
        <SectionHeader title="Mouvements locataires" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <SectionCard icon={<Svg color="#28A566"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></Svg>} iconBg="rgba(40,165,102,0.10)" title="Arrivée locataire" count="2 entrées" countColor="#28A566"/>
          <SectionCard icon={<Svg color={C.accent}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6"/></Svg>} iconBg={C.accentLight} title="Dernier loyer" count="Avr 2026"/>
          <SectionCard icon={<Svg color={C.error}><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></Svg>} iconBg="rgba(224,82,82,0.10)" title="Solde tout compte" count="1 en cours" countColor={C.error}/>
        </div>
      </div>
    </div>

    {/* Section 3 */}
    <div style={{ display: 'flex', gap: 20 }}>
      {/* Actions annuelles */}
      <div style={{ flex: '0 0 60%' }}>
        <SectionHeader title="Actions annuelles" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <SectionCard icon={<Svg color="#8B5CF6"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></Svg>} iconBg="rgba(139,92,246,0.10)" title="Régularisations de charges" count="À traiter" countColor="#8B5CF6"/>
          <SectionCard icon={<Svg color="#FF8753}"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></Svg>} iconBg="rgba(243,156,18,0.10)" title="Déclarations fiscales" count="2026 · Juin" countColor="#FF8753"/>
          <SectionCard icon={<Svg color="#3B7DF8"><polyline points="17,1 21,5 17,9"/><path d="M3 11V9a4 4 0 014-4h14"/></Svg>} iconBg="rgba(59,125,248,0.10)" title="Transfert dépenses" count="Planifié" countColor="#3B7DF8"/>
        </div>
      </div>

      {/* Comptes bancaires */}
      <div style={{ flex: 1 }}>
        <SectionHeader title="Comptes bancaires" />
        <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
          <BankRow bank="BNP Paribas" ref_="512-000001" amount="-46 153,54 €"/>
          <BankRow bank="Caisse d'épargne" ref_="512-000002" amount="-166,58 €"/>
          <div style={{ padding: '12px 18px' }}>
            <button style={{
              width: '100%', padding: '10px', border: `1px dashed ${C.border}`,
              borderRadius: 8, background: 'transparent', color: C.textSecondary,
              fontSize: 13, cursor: 'pointer',
            }}>+ Ajouter un compte</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
