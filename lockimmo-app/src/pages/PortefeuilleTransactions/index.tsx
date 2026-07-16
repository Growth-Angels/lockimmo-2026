import React from 'react';
import { C, F } from '../../tokens';

/* ─── Data ─────────────────────────────────────────────────────────── */

const KPIS = [
  { icon: '🏷️',  label: 'Biens en vente',      value: 11, color: C.accent  },
  { icon: '👀', label: 'Visites planifiées',   value: 24, color: '#3B7DF8' },
  { icon: '📝', label: 'Offres reçues',        value: 6,  color: '#8B5CF6' },
  { icon: '✍️',  label: 'Sous compromis',      value: 3,  color: '#28A566' },
];

const FILTERS = ['Tous (11)', 'En vente', 'Visites', 'Offres', 'Sous compromis', 'Vendus'];

const PROPERTIES = [
  {
    type: 'big',
    cover: {
      // Maison de pierre avec jardin — style Bordelais
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80&auto=format&fit=crop',
      from: '#FFD9C0', to: '#FFE0CC',
    },
    mandate: 'Exclusif',
    mandateColor: C.accent,
    title: '17 rue des Tilleuls',
    city: '33000 Bordeaux',
    price: '485 000 €',
    kind: 'Maison · 145 m² · 6 pièces',
    stats: [
      { icon: '👁', label: 'Visites',  value: '12' },
      { icon: '📬', label: 'Contacts', value: '24' },
      { icon: '⏱',  label: 'En vente', value: '8 j' },
    ],
    stage: 2,
    agent: { initials: 'PL', name: 'Pauline L.' },
    badge: null,
  },
  {
    type: 'medium',
    cover: {
      // Appartement haussmannien parisien
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=80&auto=format&fit=crop',
      from: '#DCEEFF', to: '#EEF4FF',
    },
    mandate: 'Simple',
    mandateColor: '#6C6057',
    title: '8 av. Foch',
    city: '75116 Paris',
    price: '320 000 €',
    kind: 'Appartement · 52 m² · 2 pièces',
    stats: [
      { icon: '👁', label: 'Visites',  value: '18' },
      { icon: '⏱',  label: 'En vente', value: '22 j' },
    ],
    stage: 1,
    agent: { initials: 'JM', name: 'Jérôme M.' },
    badge: { text: '1 offre en cours', color: '#8B5CF6', bg: '#F4EEFF' },
  },
  {
    type: 'small',
    cover: {
      // Studio cosy
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=80&auto=format&fit=crop',
      from: '#D4F4E4', to: '#EDFBF4',
    },
    mandate: 'Exclusif',
    mandateColor: C.accent,
    title: '5 rue Mercière',
    city: '69002 Lyon',
    price: '145 000 €',
    kind: 'Studio · 28 m²',
    stats: [
      { icon: '⏱',  label: 'Compromis', value: '23 mai' },
    ],
    stage: 3,
    agent: { initials: 'SY', name: 'Sylvie Y.' },
    badge: { text: 'Sous compromis', color: '#28A566', bg: '#EDFBF4' },
  },
];

const STAGES = ['Mandat', 'Visites', 'Offres', 'Compromis'];

/* ─── Skeleton tile variants ───────────────────────────────────────── */
const SKELETONS: { coverH: number; lines: number[] }[] = [
  { coverH: 180, lines: [70, 50, 90] },
  { coverH: 120, lines: [60, 80] },
  { coverH: 200, lines: [50, 90, 65, 80] },
  { coverH: 140, lines: [70, 55] },
  { coverH: 160, lines: [80, 60, 75] },
  { coverH: 220, lines: [65, 85, 50] },
  { coverH: 110, lines: [70, 60] },
  { coverH: 170, lines: [55, 80, 65] },
];

/* ─── Page CSS (masonry + shimmer) ─────────────────────────────────── */
const CSS = `
@keyframes pt-shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0;  }
}
.pt-skel {
  background: linear-gradient(90deg, #F3F0ED 0%, #FAFAF9 50%, #F3F0ED 100%);
  background-size: 200% 100%;
  animation: pt-shimmer 1.6s ease-in-out infinite;
  border-radius: 6px;
}
.pt-masonry {
  column-count: 4;
  column-gap: 14px;
}
@media (max-width: 1200px) { .pt-masonry { column-count: 3; } }
@media (max-width: 900px)  { .pt-masonry { column-count: 2; } }
@media (max-width: 600px)  { .pt-masonry { column-count: 1; } }
.pt-tile {
  break-inside: avoid;
  margin-bottom: 14px;
  display: block;
}
.pt-card {
  background: #fff;
  border: 1px solid rgba(53,50,48,0.08);
  border-radius: 14px;
  overflow: hidden;
  transition: transform 0.22s cubic-bezier(0.34, 1.2, 0.64, 1), box-shadow 0.22s;
  cursor: pointer;
}
.pt-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(53,50,48,0.10), 0 2px 6px rgba(53,50,48,0.05);
}
.pt-stage-bar {
  display: flex; gap: 4px; height: 4px; border-radius: 100px; overflow: hidden;
}
.pt-stage-seg { flex: 1; background: #F3F0ED; transition: background 0.3s; }
.pt-stage-seg.on { background: #FF8753; }
`;

/* ─── Components ───────────────────────────────────────────────────── */

const KpiCard: React.FC<{ icon: string; label: string; value: string | number; color: string }> = ({ icon, label, value, color }) => (
  <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }}>
    <div style={{ fontSize: 24, marginBottom: 10 }}>{icon}</div>
    <div style={{ fontFamily: F.display, fontSize: 28, fontWeight: 700, color, letterSpacing: '-0.5px' }}>{value}</div>
    <div style={{ fontSize: 13, color: C.textSecondary, marginTop: 4 }}>{label}</div>
  </div>
);

const PropertyCard: React.FC<{ p: typeof PROPERTIES[number] }> = ({ p }) => {
  const isBig = p.type === 'big';
  const isSmall = p.type === 'small';
  const coverHeight = isBig ? 200 : isSmall ? 130 : 160;

  return (
    <div className="pt-card">
      {/* Cover */}
      <div style={{
        height: coverHeight,
        background: `linear-gradient(135deg, ${p.cover.from}, ${p.cover.to})`,
        backgroundImage: `url(${p.cover.image}), linear-gradient(135deg, ${p.cover.from}, ${p.cover.to})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>

        {/* Mandate tag */}
        <div style={{
          position: 'absolute', top: 12, left: 12,
          background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)',
          color: p.mandateColor,
          fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
          padding: '4px 9px', borderRadius: 6,
        }}>{p.mandate}</div>

        {/* Status badge */}
        {p.badge && (
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: p.badge.bg, color: p.badge.color,
            fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
            padding: '4px 9px', borderRadius: 6,
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: p.badge.color }}/>
            {p.badge.text}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>

        <div>
          <div style={{
            fontFamily: F.display, fontSize: isBig ? 22 : 19,
            fontWeight: 500, color: C.accent, letterSpacing: '-0.04em', lineHeight: 1,
          }}>{p.price}</div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: C.textPrimary, marginTop: 6 }}>
            {p.title}
          </div>
          <div style={{ fontSize: 11.5, color: '#AAA09A', marginTop: 1 }}>{p.city}</div>
        </div>

        <div style={{
          fontSize: 11, color: '#6C6057',
          padding: '4px 8px', background: '#F3F0ED',
          borderRadius: 6, width: 'fit-content',
        }}>{p.kind}</div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 12, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
          {p.stats.map((s, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#AAA09A' }}>{s.label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Stage progress (only on big card) */}
        {isBig && (
          <div style={{ marginTop: 4 }}>
            <div className="pt-stage-bar">
              {STAGES.map((_, i) => (
                <div key={i} className={`pt-stage-seg ${i <= p.stage ? 'on' : ''}`}/>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              {STAGES.map((s, i) => (
                <span key={s} style={{
                  fontSize: 9.5, fontWeight: i <= p.stage ? 700 : 500,
                  color: i <= p.stage ? C.accent : '#AAA09A',
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Agent footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 4 }}>
          <div style={{
            width: 24, height: 24, borderRadius: '50%',
            background: '#FFF0E8', color: C.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 9.5, fontWeight: 700, flexShrink: 0,
          }}>{p.agent.initials}</div>
          <span style={{ fontSize: 11.5, color: '#6C6057' }}>{p.agent.name}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#AAA09A" strokeWidth="1.6" strokeLinecap="round" style={{ marginLeft: 'auto' }}><path d="M4 2l4 4-4 4"/></svg>
        </div>

      </div>
    </div>
  );
};

const SkeletonCard: React.FC<{ coverH: number; lines: number[] }> = ({ coverH, lines }) => (
  <div className="pt-card" style={{ cursor: 'default' }}>
    <div className="pt-skel" style={{ height: coverH, borderRadius: 0 }}/>
    <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="pt-skel" style={{ height: 22, width: '55%' }}/>
      <div className="pt-skel" style={{ height: 12, width: '75%' }}/>
      <div className="pt-skel" style={{ height: 10, width: '40%' }}/>
      <div style={{ display: 'flex', gap: 8, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
        {lines.map((w, i) => (
          <div key={i} style={{ flex: 1 }}>
            <div className="pt-skel" style={{ height: 8, width: '60%', marginBottom: 4 }}/>
            <div className="pt-skel" style={{ height: 12, width: `${w}%` }}/>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 4 }}>
        <div className="pt-skel" style={{ width: 24, height: 24, borderRadius: '50%' }}/>
        <div className="pt-skel" style={{ height: 10, flex: 1, maxWidth: 100 }}/>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════ */
export const PortefeuilleTransactions: React.FC = () => (
  <div>
    <style>{CSS}</style>

    {/* Breadcrumb */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#AAA09A', marginBottom: 14 }}>
      Accueil <span style={{ opacity: 0.4 }}>›</span>
      Transactions <span style={{ opacity: 0.4 }}>›</span>
      <span style={{ color: C.textPrimary, fontWeight: 500 }}>Portefeuille</span>
    </div>

    {/* Header */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: `linear-gradient(135deg, ${C.accent}, #FFBD86)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24, boxShadow: '0 4px 16px rgba(255,135,83,0.3)', flexShrink: 0,
      }}>🏷️</div>
      <div>
        <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 28, color: C.textPrimary, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
          Portefeuille transactions
        </div>
        <div style={{ fontSize: 13, color: '#AAA09A', marginTop: 2 }}>Vision globale des biens en vente · 11 mandats actifs</div>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
        <button style={{
          padding: '9px 16px', borderRadius: 9, border: `1px solid ${C.border}`, background: C.white,
          color: C.textPrimary, fontSize: 13, fontWeight: 600, cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 7,
        }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="1.5" y="2" width="10" height="9" rx="1"/><path d="M1.5 5h10M5 2v9"/></svg>
          Vue carte
        </button>
        <button style={{
          padding: '9px 16px', borderRadius: 9, border: 'none', background: C.accent,
          color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          boxShadow: '0 3px 10px rgba(255,135,83,0.3)',
          display: 'inline-flex', alignItems: 'center', gap: 7,
        }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M6.5 2v9M2 6.5h9"/></svg>
          Nouveau mandat
        </button>
      </div>
    </div>

    {/* KPIs */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
      {KPIS.map((k, i) => <KpiCard key={i} {...k}/>)}
    </div>

    {/* Filter tabs */}
    <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
      {FILTERS.map((f, i) => (
        <div key={f} style={{
          padding: '6px 14px', borderRadius: 100,
          background: i === 0 ? C.accent : C.white,
          color: i === 0 ? '#fff' : '#6C6057',
          border: i === 0 ? 'none' : `1px solid ${C.border}`,
          fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
          boxShadow: i === 0 ? '0 2px 8px rgba(255,135,83,0.22)' : 'none',
        }}>{f}</div>
      ))}
    </div>

    {/* Pinterest-style masonry */}
    <div className="pt-masonry">
      {PROPERTIES.map((p, i) => (
        <div key={`real-${i}`} className="pt-tile">
          <PropertyCard p={p}/>
        </div>
      ))}
      {SKELETONS.map((s, i) => (
        <div key={`skel-${i}`} className="pt-tile">
          <SkeletonCard coverH={s.coverH} lines={s.lines}/>
        </div>
      ))}
    </div>

    {/* Footer load more */}
    <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
      <button style={{
        padding: '10px 22px', borderRadius: 100, border: `1px solid ${C.border}`,
        background: C.white, color: C.textPrimary,
        fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 7,
      }}>
        Charger les biens suivants
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M3 4.5l3 3 3-3"/></svg>
      </button>
    </div>
  </div>
);
