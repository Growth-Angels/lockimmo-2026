import React from 'react';
import { C, F } from '../../tokens';

/* ───────────────────────────── BLOC 1 — Chiffres clés temps réel ──────────────────────── */
const ChiffresCles: React.FC = () => {
  const kpis = [
    { label: "Taux d'occupation", value: '90 %',  trend: '+2 pts',  trendColor: C.success, big: true  },
    { label: 'Biens loués',       value: '10/11', trend: 'sur 11',  trendColor: C.textSecondary       },
    { label: 'Dossiers impayés',  value: '5',     trend: 'à régler', trendColor: C.error              },
    { label: 'Biens vacants',     value: '1',     trend: 'en MEL',   trendColor: C.accent             },
  ];
  return (
    <FeatureCard
      title="Chiffres clés en temps réel"
      desc="Les indicateurs essentiels de votre activité, mis à jour à la seconde."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {kpis.map(k => (
          <div key={k.label} style={{
            background: C.bgLight, borderRadius: 12, padding: '14px 16px',
            border: `1px solid ${C.border}`,
            display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            <div style={{
              fontFamily: F.display, fontSize: 28, fontWeight: 700,
              color: C.textPrimary, letterSpacing: '-0.03em', lineHeight: 1,
            }}>{k.value}</div>
            <div style={{ fontSize: 11, color: C.textSecondary, fontWeight: 500 }}>{k.label}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: k.trendColor, marginTop: 2 }}>↗ {k.trend}</div>
          </div>
        ))}
      </div>
    </FeatureCard>
  );
};

/* ───────────────────────────── BLOC 2 — Agenda du jour ────────────────────────────────── */
const AgendaJour: React.FC = () => {
  const events = [
    { time: '09:00', title: 'État des lieux — Dupont',    place: '12 rue de la Paix',   tag: 'EDL',    color: C.accent  },
    { time: '11:30', title: 'Rendez-vous propriétaire',   place: 'Visio',                tag: 'RDV',    color: C.blue    },
    { time: '14:00', title: 'Visite appartement T3',       place: '45 bd Haussmann',     tag: 'Visite', color: C.success },
    { time: '16:30', title: 'Signature mandat — Garnier',  place: 'Bureau',               tag: 'Mandat', color: C.purple  },
  ];
  return (
    <FeatureCard
      title="Agenda et rendez-vous du jour"
      desc="Toutes vos visites, états des lieux et signatures organisés sur la journée."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {events.map(e => (
          <div key={e.title} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '12px 14px', background: C.bgLight,
            borderRadius: 10, border: `1px solid ${C.border}`,
          }}>
            <div style={{
              fontFamily: F.display, fontSize: 16, fontWeight: 700,
              color: C.textPrimary, width: 50, flexShrink: 0,
              letterSpacing: '-0.02em',
            }}>{e.time}</div>
            <div style={{ width: 1, height: 32, background: C.border, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>{e.title}</div>
              <div style={{ fontSize: 11, color: C.textSecondary, marginTop: 1 }}>📍 {e.place}</div>
            </div>
            <span style={{
              fontSize: 10, fontWeight: 800, letterSpacing: '0.04em',
              padding: '4px 10px', borderRadius: 100,
              background: `${e.color}1A`, color: e.color,
              textTransform: 'uppercase',
            }}>{e.tag}</span>
          </div>
        ))}
      </div>
    </FeatureCard>
  );
};

/* ───────────────────────────── BLOC 3 — Tâches prioritaires ─────────────────────────── */
const TachesPrioritaires: React.FC = () => {
  const tasks = [
    { done: true,  label: 'Relancer Camille Leblanc (impayé J+8)',     due: 'Aujourd\'hui', prio: 'Haute' },
    { done: false, label: 'Préparer le bail — Sophie Martin',          due: 'Demain',       prio: 'Haute' },
    { done: false, label: 'Envoyer quittances mai 2026',               due: 'Ven. 27',      prio: 'Moyenne' },
    { done: false, label: 'Programmer la visite — 7 av. Foch',         due: 'Lun. 30',      prio: 'Moyenne' },
  ];
  return (
    <FeatureCard
      title="Tâches prioritaires à traiter"
      desc="Une to-do list intelligente, priorisée par urgence et générée automatiquement."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {tasks.map(t => (
          <div key={t.label} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '11px 14px', background: t.done ? C.successLight : C.bgLight,
            borderRadius: 10, border: `1px solid ${C.border}`,
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: 5,
              background: t.done ? C.success : C.white,
              border: `1.5px solid ${t.done ? C.success : C.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {t.done && (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20,6 9,17 4,12"/>
                </svg>
              )}
            </div>
            <div style={{
              flex: 1, fontSize: 13, fontWeight: 600,
              color: t.done ? C.textSecondary : C.textPrimary,
              textDecoration: t.done ? 'line-through' : 'none',
            }}>{t.label}</div>
            <span style={{ fontSize: 11, color: C.textSecondary }}>{t.due}</span>
            <span style={{
              fontSize: 10, fontWeight: 700,
              padding: '3px 9px', borderRadius: 100,
              background: t.prio === 'Haute' ? C.errorLight : C.accentLight,
              color: t.prio === 'Haute' ? C.error : C.accent,
            }}>{t.prio}</span>
          </div>
        ))}
      </div>
    </FeatureCard>
  );
};

/* ───────────────────────────── Sous-composant partagé ───────────────────────────────── */
const FeatureCard: React.FC<{ title: string; desc: string; children: React.ReactNode }> = ({ title, desc, children }) => (
  <section style={{
    background: C.white, borderRadius: 20,
    padding: 28, border: `1px solid ${C.border}`,
    display: 'flex', flexDirection: 'column', gap: 16,
  }}>
    <div>
      <h3 style={{
        fontFamily: F.display, fontSize: 24, fontWeight: 600,
        color: C.textPrimary, letterSpacing: '-0.02em', margin: '0 0 6px',
      }}>{title}</h3>
      <p style={{ fontSize: 14, color: C.textSecondary, margin: 0, lineHeight: 1.5 }}>{desc}</p>
    </div>
    {children}
  </section>
);

const FEATURES = [
  'Chiffres clés en temps réel',
  'Agenda et rendez-vous du jour',
  'Tâches prioritaires à traiter',
];

const ChevronRight: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <polyline
      points="9,6 15,12 9,18"
      stroke={C.accent}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ───────────────────────────── Page ─────────────────────────────────────────────────── */
export const PitchTableauDeBord: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#F3F0ED',
      fontFamily: F.body,
      padding: '72px 32px',
    }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* ─── Pitch header ─── */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '10px 20px',
          background: C.accentLight,
          border: `1px solid ${C.accent}30`,
          borderRadius: 100, marginBottom: 32,
        }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: C.accent }} />
          <span style={{ fontSize: 15, fontWeight: 700, color: C.accent, letterSpacing: '-0.01em' }}>
            Vue d'ensemble · Temps réel
          </span>
        </div>
        <h1 style={{
          fontFamily: F.display, fontSize: 64, fontWeight: 600,
          color: C.textPrimary, letterSpacing: '-0.035em',
          lineHeight: 1.08, margin: '0 0 28px',
        }}>
          Toute votre activité sur<br />un seul tableau de bord
        </h1>
        <p style={{
          fontSize: 22, color: '#AAA09A', lineHeight: 1.45,
          margin: '0 0 32px', fontWeight: 400,
        }}>
          L'essentiel de votre journée, en un coup d'œil.
        </p>

        {/* Liste features (style pitch) */}
        <ul style={{
          listStyle: 'none', padding: 0, margin: '0 0 56px',
          display: 'flex', flexDirection: 'column', gap: 18,
        }}>
          {FEATURES.map(label => (
            <li key={label} style={{
              display: 'flex', alignItems: 'center', gap: 14, paddingLeft: 32,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.accent, flexShrink: 0 }} />
              <span style={{ fontSize: 21, fontWeight: 700, color: C.textPrimary, letterSpacing: '-0.01em' }}>{label}</span>
              <ChevronRight />
            </li>
          ))}
        </ul>

        {/* ─── 3 blocs fonctionnels ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <ChiffresCles />
          <AgendaJour />
          <TachesPrioritaires />
        </div>
      </div>
    </div>
  );
};
