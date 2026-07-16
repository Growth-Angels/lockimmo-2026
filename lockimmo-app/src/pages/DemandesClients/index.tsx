import React, { useState } from 'react';
import { C, F } from '../../tokens';

/* ─── Types ─── */
type Stage = 'nouvelles' | 'qualifiees' | 'visite' | 'offre';

interface Demand {
  id:        string;
  name:      string;
  meta:      string;          // ex: "32 ans · couple"
  initials:  string;
  avatarHue: string;          // gradient color
  type:      string;          // ex: "T3 · 60-70 m²"
  zone:      string;          // ex: "Paris 9e / 10e"
  budget:    string;
  source:    string;
  sourceColor: string;
  age:       string;          // ex: "il y a 2 j"
  hot?:      boolean;
  matched?:  number;          // nb de biens matchés
  lastAction?: string;        // ex: "Visite prévue · jeu 28 mai"
}

/* ─── Données mockées ─── */
const DEMANDS: Record<Stage, Demand[]> = {
  nouvelles: [
    {
      id: 'd1', name: 'Sophie Martin', meta: '32 ans · couple', initials: 'SM',
      avatarHue: 'linear-gradient(135deg,#FFB37D,#FF8753)',
      type: 'T3 · 60-70 m²', zone: 'Paris 9e / 10e', budget: '450 000 €',
      source: 'Leboncoin', sourceColor: '#EC5A13', age: 'il y a 2 h', hot: true, matched: 4,
    },
    {
      id: 'd2', name: 'Antoine Bernard', meta: '41 ans · investisseur', initials: 'AB',
      avatarHue: 'linear-gradient(135deg,#A8C5FF,#3B7DF8)',
      type: 'Studio rentable', zone: 'Paris 18e / 19e', budget: '180 000 €',
      source: 'SeLoger', sourceColor: '#E1251B', age: 'il y a 5 h', matched: 7,
    },
    {
      id: 'd3', name: 'Camille Lopez', meta: '28 ans · primo-accédant', initials: 'CL',
      avatarHue: 'linear-gradient(135deg,#D4B4FF,#8B5CF6)',
      type: 'T2 · 40-50 m²', zone: 'Boulogne / Issy', budget: '320 000 €',
      source: 'Site direct', sourceColor: '#FF8753', age: 'il y a 1 j', matched: 2,
    },
  ],
  qualifiees: [
    {
      id: 'd4', name: 'Marc Dubois', meta: '45 ans · famille', initials: 'MD',
      avatarHue: 'linear-gradient(135deg,#A4F4C8,#28A566)',
      type: 'Maison 4 ch.', zone: 'Vincennes', budget: '780 000 €',
      source: 'Logic-Immo', sourceColor: '#1E5BB0', age: 'il y a 3 j', hot: true, matched: 1,
      lastAction: 'Appelé il y a 1h',
    },
    {
      id: 'd5', name: 'Léa Garnier', meta: '36 ans · solo', initials: 'LG',
      avatarHue: 'linear-gradient(135deg,#FFC4E0,#E05252)',
      type: 'T2 lumineux', zone: 'Paris 11e', budget: '395 000 €',
      source: 'Leboncoin', sourceColor: '#EC5A13', age: 'il y a 4 j', matched: 5,
      lastAction: 'Critères validés',
    },
    {
      id: 'd6', name: 'Pierre Roux', meta: '52 ans · couple', initials: 'PR',
      avatarHue: 'linear-gradient(135deg,#FFE4A8,#FF8753)',
      type: 'T4 · 90+ m²', zone: 'Neuilly / Levallois', budget: '1 200 000 €',
      source: 'PàP', sourceColor: '#D32027', age: 'il y a 6 j', matched: 3,
      lastAction: 'Email envoyé',
    },
  ],
  visite: [
    {
      id: 'd7', name: 'Julien Moreau', meta: '38 ans · couple', initials: 'JM',
      avatarHue: 'linear-gradient(135deg,#A8C5FF,#3B7DF8)',
      type: 'T3 · 65 m²', zone: 'Paris 12e', budget: '520 000 €',
      source: 'SeLoger', sourceColor: '#E1251B', age: 'il y a 8 j', matched: 1,
      lastAction: 'Visite · jeu. 28 mai · 14h',
    },
    {
      id: 'd8', name: 'Nadia El Amrani', meta: '34 ans · famille', initials: 'NE',
      avatarHue: 'linear-gradient(135deg,#D4B4FF,#8B5CF6)',
      type: 'T4 · jardin', zone: 'Montrouge', budget: '680 000 €',
      source: 'Recommandation', sourceColor: '#28A566', age: 'il y a 10 j', hot: true, matched: 2,
      lastAction: 'Visite · ven. 29 mai · 11h',
    },
  ],
  offre: [
    {
      id: 'd9', name: 'Étienne Berger', meta: '47 ans · couple', initials: 'EB',
      avatarHue: 'linear-gradient(135deg,#FFB37D,#FF8753)',
      type: 'Appartement T3', zone: 'Paris 16e', budget: '885 000 €',
      source: 'Site direct', sourceColor: '#FF8753', age: 'il y a 14 j', hot: true, matched: 1,
      lastAction: 'Offre 850 000 € · en attente',
    },
  ],
};

/* ─── Stages config ─── */
const STAGES: { key: Stage; label: string; color: string; bg: string }[] = [
  { key: 'nouvelles',  label: 'Nouvelles',         color: C.accent,  bg: C.accentLight },
  { key: 'qualifiees', label: 'Qualifiées',        color: C.blue,    bg: C.blueLight   },
  { key: 'visite',     label: 'Visite planifiée',  color: C.purple,  bg: C.purpleLight },
  { key: 'offre',      label: 'Offre en cours',    color: C.success, bg: C.successLight },
];

/* ─── Animations ─── */
const ANIM_CSS = `
@keyframes dc-pulse-dot {
  0%, 100% { transform: scale(1);   opacity: 1;   }
  50%      { transform: scale(1.4); opacity: 0.6; }
}
@keyframes dc-fade-up {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0);   }
}
`;

/* ─── Carte demande ─── */
const DemandCard: React.FC<{ d: Demand; stageColor: string }> = ({ d, stageColor }) => (
  <div style={{
    background: C.white, borderRadius: 12,
    border: `1px solid ${C.border}`, padding: 14,
    display: 'flex', flexDirection: 'column', gap: 10,
    cursor: 'pointer', transition: 'all 0.15s',
    boxShadow: '0 1px 2px rgba(53,50,48,0.04)',
    animation: 'dc-fade-up 0.3s ease-out',
  }}
  onMouseEnter={e => {
    e.currentTarget.style.boxShadow = '0 4px 16px rgba(53,50,48,0.10)';
    e.currentTarget.style.transform = 'translateY(-2px)';
  }}
  onMouseLeave={e => {
    e.currentTarget.style.boxShadow = '0 1px 2px rgba(53,50,48,0.04)';
    e.currentTarget.style.transform = 'translateY(0)';
  }}
  >
    {/* Top — badges */}
    {d.hot && (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '2px 8px', borderRadius: 100, alignSelf: 'flex-start',
        background: C.errorLight, color: C.error,
        fontSize: 10, fontWeight: 800, letterSpacing: '0.04em',
      }}>
        🔥 HOT LEAD
      </div>
    )}

    {/* Header — avatar + name */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 38, height: 38, borderRadius: '50%',
        background: d.avatarHue, color: C.white,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 700, letterSpacing: '-0.02em',
        flexShrink: 0,
      }}>{d.initials}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13.5, fontWeight: 700, color: C.textPrimary,
          letterSpacing: '-0.01em', whiteSpace: 'nowrap',
          overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{d.name}</div>
        <div style={{ fontSize: 11, color: C.textSecondary, marginTop: 1 }}>{d.meta}</div>
      </div>
    </div>

    {/* Criteria */}
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
      <span style={{
        fontSize: 11, fontWeight: 600,
        padding: '4px 9px', borderRadius: 100,
        background: C.bgLight, color: C.textPrimary,
        border: `1px solid ${C.border}`,
      }}>{d.type}</span>
      <span style={{
        fontSize: 11, fontWeight: 600,
        padding: '4px 9px', borderRadius: 100,
        background: C.bgLight, color: C.textPrimary,
        border: `1px solid ${C.border}`,
      }}>📍 {d.zone}</span>
    </div>

    {/* Budget */}
    <div style={{
      padding: '8px 12px', borderRadius: 10,
      background: `${stageColor}12`, border: `1px solid ${stageColor}25`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <span style={{ fontSize: 10.5, fontWeight: 700, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Budget</span>
      <span style={{
        fontFamily: F.display, fontSize: 16, fontWeight: 700,
        color: stageColor, letterSpacing: '-0.02em',
      }}>{d.budget}</span>
    </div>

    {/* Last action (si présent) */}
    {d.lastAction && (
      <div style={{
        fontSize: 11, color: C.textSecondary,
        padding: '6px 10px', background: C.bgLight,
        borderRadius: 8, borderLeft: `2px solid ${stageColor}`,
      }}>
        {d.lastAction}
      </div>
    )}

    {/* Footer */}
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      paddingTop: 8, borderTop: `1px solid ${C.border}`,
      fontSize: 11, color: C.textSecondary,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: d.sourceColor, flexShrink: 0 }} />
      <span>{d.source}</span>
      <span style={{ color: C.borderStrong }}>·</span>
      <span>{d.age}</span>
      {d.matched !== undefined && (
        <span style={{ marginLeft: 'auto', fontSize: 10.5, fontWeight: 700, color: C.accent, background: C.accentLight, padding: '2px 7px', borderRadius: 100 }}>
          ✦ {d.matched} match
        </span>
      )}
    </div>

    {/* Quick actions */}
    <div style={{ display: 'flex', gap: 6 }}>
      <IconBtn icon="phone"    color={C.success} />
      <IconBtn icon="mail"     color={C.blue}    />
      <IconBtn icon="calendar" color={C.purple}  />
      <IconBtn icon="more"     color={C.textSecondary} ml="auto" />
    </div>
  </div>
);

/* ─── Bouton icône ─── */
const IconBtn: React.FC<{ icon: string; color: string; ml?: string }> = ({ icon, color, ml }) => (
  <button style={{
    width: 28, height: 28, borderRadius: 8,
    background: `${color}12`, border: 'none', color,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', marginLeft: ml,
  }}>
    {icon === 'phone' && (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.91.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0122 16.92z"/>
      </svg>
    )}
    {icon === 'mail' && (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    )}
    {icon === 'calendar' && (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    )}
    {icon === 'more' && (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
      </svg>
    )}
  </button>
);

/* ─── Page ─── */
export const DemandesClients: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'achat' | 'location'>('all');

  const totalDemands = Object.values(DEMANDS).reduce((acc, arr) => acc + arr.length, 0);
  const totalHot     = Object.values(DEMANDS).flat().filter(d => d.hot).length;

  return (
    <div>
      <style>{ANIM_CSS}</style>

      {/* ─── Header ─── */}
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, margin: 0, fontFamily: F.body }}>
            Demandes clients
          </h1>
          <p style={{ fontSize: 13, color: C.textSecondary, marginTop: 4 }}>
            Pilotez vos demandes entrantes — de la prise de contact à la signature.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 18px', borderRadius: 100,
            background: C.white, color: C.textPrimary,
            border: `1px solid ${C.border}`,
            fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: F.body,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Exporter
          </button>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 100, border: 'none',
            background: C.accent, color: C.white,
            fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: F.body,
            boxShadow: '0 4px 14px rgba(255,135,83,0.30)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nouvelle demande
          </button>
        </div>
      </div>

      {/* ─── KPI Row ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        <KpiCard
          icon="📥" iconBg={C.accentLight} iconColor={C.accent}
          value={String(totalDemands)} label="Demandes en cours"
          trend="↗ +4 cette semaine" trendColor={C.success}
        />
        <KpiCard
          icon="🔥" iconBg={C.errorLight} iconColor={C.error}
          value={String(totalHot)} label="Hot leads à traiter"
          trend="⚠ Action requise" trendColor={C.error}
        />
        <KpiCard
          icon="📅" iconBg={C.purpleLight} iconColor={C.purple}
          value="3" label="Visites cette semaine"
          trend="Mar / Jeu / Ven" trendColor={C.textSecondary}
        />
        <KpiCard
          icon="🎯" iconBg={C.successLight} iconColor={C.success}
          value="14 %" label="Taux de conversion"
          trend="↗ +2,3 pts vs. mois dern." trendColor={C.success}
        />
      </div>

      {/* ─── Filter bar ─── */}
      <div style={{
        background: C.white, borderRadius: 12,
        border: `1px solid ${C.border}`, padding: '10px 14px',
        marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12,
      }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, padding: 4, background: C.bgLight, borderRadius: 100 }}>
          {(['all', 'achat', 'location'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '7px 16px', borderRadius: 100, border: 'none',
              background: activeTab === tab ? C.white : 'transparent',
              color: activeTab === tab ? C.textPrimary : C.textSecondary,
              fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: F.body,
              boxShadow: activeTab === tab ? '0 1px 3px rgba(53,50,48,0.08)' : 'none',
            }}>
              {tab === 'all' ? `Toutes (${totalDemands})` : tab === 'achat' ? 'Achat (12)' : 'Location (6)'}
            </button>
          ))}
        </div>

        <div style={{ width: 1, height: 20, background: C.border, margin: '0 4px' }} />

        {/* Source filter */}
        <button style={filterBtn}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          Source
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><polyline points="6,9 12,15 18,9"/></svg>
        </button>
        <button style={filterBtn}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Période · 30 j
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><polyline points="6,9 12,15 18,9"/></svg>
        </button>
        <button style={filterBtn}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
          Statut
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><polyline points="6,9 12,15 18,9"/></svg>
        </button>

        {/* Search */}
        <div style={{
          marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8,
          padding: '7px 14px', background: C.bgLight,
          borderRadius: 100, width: 240,
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.textSecondary} strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input placeholder="Rechercher un client…" style={{
            flex: 1, fontSize: 12, color: C.textPrimary,
            background: 'transparent', border: 'none', outline: 'none',
          }} />
        </div>

        {/* View toggle */}
        <div style={{ display: 'flex', gap: 2, padding: 3, background: C.bgLight, borderRadius: 8 }}>
          <button style={{ ...viewBtn, background: C.white, color: C.accent, boxShadow: '0 1px 3px rgba(53,50,48,0.08)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="18" rx="1"/></svg>
          </button>
          <button style={viewBtn}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          </button>
        </div>
      </div>

      {/* ─── Kanban Board ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {STAGES.map(stage => {
          const items = DEMANDS[stage.key];
          return (
            <div key={stage.key} style={{
              background: stage.bg, borderRadius: 14,
              padding: 14, display: 'flex', flexDirection: 'column',
              gap: 10, minHeight: 400,
              border: `1px solid ${stage.color}20`,
            }}>
              {/* Column header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                paddingBottom: 10, borderBottom: `1px dashed ${stage.color}33`,
              }}>
                {stage.key === 'nouvelles' && (
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: stage.color,
                    animation: 'dc-pulse-dot 1.4s ease-in-out infinite',
                  }} />
                )}
                <div style={{
                  fontSize: 13, fontWeight: 700, color: stage.color,
                  letterSpacing: '-0.01em', flex: 1,
                }}>{stage.label}</div>
                <span style={{
                  fontSize: 11, fontWeight: 800, padding: '2px 9px',
                  borderRadius: 100, background: C.white, color: stage.color,
                  border: `1px solid ${stage.color}33`,
                  letterSpacing: '-0.01em',
                }}>{items.length}</span>
              </div>

              {/* Cards */}
              {items.map(d => (
                <DemandCard key={d.id} d={d} stageColor={stage.color} />
              ))}

              {/* Add button */}
              <button style={{
                padding: '10px 12px', borderRadius: 10,
                background: 'transparent', border: `1.5px dashed ${stage.color}40`,
                color: stage.color, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', fontFamily: F.body,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Ajouter
              </button>
            </div>
          );
        })}
      </div>

      {/* ─── Activité récente ─── */}
      <div style={{
        background: C.white, borderRadius: 14,
        border: `1px solid ${C.border}`, padding: 22,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary, margin: 0, flex: 1 }}>
            Activité récente
          </h2>
          <span style={{ fontSize: 11, color: C.textSecondary }}>Aujourd'hui · 8 événements</span>
        </div>
        {[
          { ic: '📥', t: 'Nouvelle demande — Sophie Martin (T3 Paris 9e · 450 K€)', date: 'Il y a 2 h',  col: C.accent  },
          { ic: '📞', t: 'Marc Dubois rappelé — qualifié pour visite',              date: 'Il y a 1 h',  col: C.success },
          { ic: '📅', t: 'Visite confirmée — Julien Moreau · jeu. 28 mai 14h',     date: 'Il y a 3 h',  col: C.purple  },
          { ic: '✉️', t: 'Email envoyé à Pierre Roux — biens correspondants (3)',  date: 'Il y a 5 h',  col: C.blue    },
          { ic: '💰', t: 'Offre formulée — Étienne Berger · 850 000 €',           date: 'Hier 17:22',   col: C.success },
        ].map(a => (
          <div key={a.t} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 0', borderBottom: `1px solid ${C.border}`,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: `${a.col}1A`, display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 14,
            }}>{a.ic}</div>
            <div style={{ flex: 1, fontSize: 13, color: C.textPrimary, fontWeight: 600 }}>{a.t}</div>
            <span style={{ fontSize: 11, color: C.textSecondary }}>{a.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Sub-components ─── */
interface KpiCardProps {
  icon: string; iconBg: string; iconColor: string;
  value: string; label: string;
  trend: string; trendColor: string;
}
const KpiCard: React.FC<KpiCardProps> = ({ icon, iconBg, iconColor, value, label, trend, trendColor }) => (
  <div style={{
    background: C.white, borderRadius: 12,
    border: `1px solid ${C.border}`, padding: 18,
    display: 'flex', flexDirection: 'column', gap: 10,
  }}>
    <div style={{
      width: 40, height: 40, borderRadius: 10,
      background: iconBg, color: iconColor,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 19,
    }}>{icon}</div>
    <div>
      <div style={{
        fontFamily: F.display, fontSize: 30, fontWeight: 700,
        color: C.textPrimary, letterSpacing: '-0.03em', lineHeight: 1,
      }}>{value}</div>
      <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 5 }}>{label}</div>
    </div>
    <div style={{ fontSize: 11, fontWeight: 600, color: trendColor }}>{trend}</div>
  </div>
);

const filterBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '7px 12px', borderRadius: 100,
  background: C.white, border: `1px solid ${C.border}`,
  color: C.textPrimary, fontSize: 12, fontWeight: 600,
  cursor: 'pointer', fontFamily: F.body,
};

const viewBtn: React.CSSProperties = {
  width: 28, height: 26, borderRadius: 6,
  background: 'transparent', border: 'none',
  color: C.textSecondary,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
};
