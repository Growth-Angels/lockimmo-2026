import React, { useState } from 'react';
import { C, F } from '../../tokens';
import { TransferModal } from '../../components/ui/TransferModal';

const StatCard: React.FC<{ emoji: string; label: string; value: string | number; color?: string }> = ({ emoji, label, value, color = C.accent }) => (
  <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: '20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
    <div style={{ fontSize: 28 }}>{emoji}</div>
    <div style={{ fontFamily: F.display, fontSize: 32, fontWeight: 700, color, letterSpacing: '-0.5px' }}>{value}</div>
    <div style={{ fontSize: 13, color: C.textSecondary }}>{label}</div>
  </div>
);

const TABS = ['Aperçu', 'Assistance'] as const;
type Tab = typeof TABS[number];

export const VosDonnees: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Aperçu');
  const [transferOpen, setTransferOpen] = useState(false);

  return (
    <div>
      <TransferModal open={transferOpen} onClose={() => setTransferOpen(false)} />

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, margin: 0 }}>Vos données</h1>
        <p style={{ fontSize: 13, color: C.textSecondary, marginTop: 4 }}>Vue d'ensemble de votre patrimoine géré</p>
      </div>

      {/* Onglets */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: `1px solid ${C.border}`, paddingBottom: 0 }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '9px 20px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: activeTab === tab ? 700 : 500,
              color: activeTab === tab ? C.accent : C.textSecondary,
              borderBottom: activeTab === tab ? `2px solid ${C.accent}` : '2px solid transparent',
              marginBottom: -1,
              transition: 'all 0.15s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Contenu Aperçu */}
      {activeTab === 'Aperçu' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 28 }}>
            <StatCard emoji="👤" label="Propriétaires" value={12} color={C.accent}/>
            <StatCard emoji="🏠" label="Locataires actifs" value={24} color="#3B7DF8"/>
            <StatCard emoji="🏢" label="Biens gérés" value={11} color="#8B5CF6"/>
            <StatCard emoji="📄" label="Mandats actifs" value={11} color="#28A566"/>
            <StatCard emoji="📋" label="Contrats en cours" value={10} color="#FF8753"/>
          </div>
          <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, marginBottom: 16 }}>Répartition du patrimoine</h2>
            <div style={{ display: 'flex', gap: 20 }}>
              {[
                { label: 'Appartements', n: 7, color: C.accent },
                { label: 'Maisons', n: 2, color: '#8B5CF6' },
                { label: 'Locaux commerciaux', n: 1, color: '#3B7DF8' },
                { label: 'Parkings', n: 1, color: '#28A566' },
              ].map(item => (
                <div key={item.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ height: 8, borderRadius: 4, background: item.color, opacity: 0.8 }}/>
                  <div style={{ fontSize: 20, fontWeight: 700, color: C.textPrimary }}>{item.n}</div>
                  <div style={{ fontSize: 12, color: C.textSecondary }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Contenu Assistance */}
      {activeTab === 'Assistance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Card transfert */}
          <div style={{
            background: C.white, borderRadius: 14,
            border: `1px solid ${C.border}`,
            padding: 28,
            display: 'flex', alignItems: 'center', gap: 24,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14, flexShrink: 0,
              background: 'rgba(40,165,102,0.10)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#28A566" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="17,1 21,5 17,9"/>
                <path d="M3 11V9a4 4 0 014-4h14"/>
                <polyline points="7,23 3,19 7,15"/>
                <path d="M21 13v2a4 4 0 01-4 4H3"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, marginBottom: 5 }}>
                Demande de transfert
              </div>
              <div style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.55 }}>
                Importez vos données existantes (CSV, Excel, ancien logiciel) et laissez LOCKimmo les structurer automatiquement dans votre espace.
              </div>
            </div>
            <button
              onClick={() => setTransferOpen(true)}
              style={{
                padding: '10px 22px', borderRadius: 20, border: 'none',
                background: '#28A566', color: 'white',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                flexShrink: 0,
                boxShadow: '0 4px 14px rgba(40,165,102,0.3)',
              }}
            >
              Lancer le transfert
            </button>
          </div>

          {/* Cards secondaires */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                ),
                title: 'Export de vos données',
                desc: 'Téléchargez l\'ensemble de vos données au format CSV ou PDF.',
                cta: 'Exporter',
                bg: C.accentLight,
                ctaColor: C.accent,
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B7DF8" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8v4l3 3"/>
                  </svg>
                ),
                title: 'Historique des imports',
                desc: 'Consultez tous vos transferts précédents et leur statut.',
                cta: 'Voir l\'historique',
                bg: 'rgba(59,125,248,0.10)',
                ctaColor: '#3B7DF8',
              },
            ].map((card, i) => (
              <div key={i} style={{
                background: C.white, borderRadius: 14,
                border: `1px solid ${C.border}`, padding: 22,
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, marginBottom: 14,
                  background: card.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {card.icon}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary, marginBottom: 6 }}>{card.title}</div>
                <div style={{ fontSize: 12, color: C.textSecondary, lineHeight: 1.55, marginBottom: 16 }}>{card.desc}</div>
                <button style={{
                  padding: '7px 16px', borderRadius: 16, border: `1.5px solid ${card.ctaColor}`,
                  background: 'none', color: card.ctaColor,
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}>
                  {card.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
